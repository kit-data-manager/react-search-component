"use client"

import type { SearchResult } from "@elastic/search-ui"
import { FairDOSearchContext } from "@/components/FairDOSearchContext"
import { GlobalModalContext } from "@/components/GlobalModalContext"
import { ObjectRender } from "@/components/result/ObjectRender"
import { PidDisplay } from "@/components/result/PidDisplay"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BasicRelationNode } from "@/lib/RelationNode"
import { resultCache } from "@/lib/ResultCache"
import { BookText, ChevronDown, File, GitFork, Globe, GraduationCap, ImageOff, LinkIcon, Microscope, Scale } from "lucide-react"
import { DateTime } from "luxon"
import { useCallback, useContext, useEffect, useMemo } from "react"
import { useStore } from "zustand"
import Image from "next/image"

const HTTP_REGEX = /https?:\/\/[a-z]+\.[a-z]+.*/gm

function autoUnwrap(item: string | { raw: string }) {
    if (typeof item === "string") {
        return item
    } else if (typeof item === "object" && "raw" in item && typeof item.raw === "string") {
        return item.raw
    } else {
        return JSON.stringify(item)
    }
}

function autoUnwrapArray(item: string[] | { raw: string[] }) {
    if (!item) {
        return []
    }
    if (Array.isArray(item)) {
        return item
    } else if (typeof item === "object" && "raw" in item && Array.isArray(item.raw)) {
        return item.raw
    } else {
        return [JSON.stringify(item)]
    }
}

/**
 * Renders the result card for one search entry. Specifically for NMR data.
 * @param result The search entry to render
 * @param debug Set to true to display the full record received from elastic
 * @constructor
 */
export function NMRResultView({ result, debug }: { result: SearchResult; debug?: boolean }) {
    const { openRelationGraph } = useContext(GlobalModalContext)
    const { searchFor, searchTerm, elasticConnector } = useContext(FairDOSearchContext)
    const addToResultCache = useStore(resultCache, (s) => s.set)
    const getResultFromCache = useStore(resultCache, (s) => s.get)

    const getField = useCallback(
        (field: string) => {
            return autoUnwrap(result[field])
        },
        [result]
    )

    const getArrayField = useCallback(
        (field: string) => {
            return autoUnwrapArray(result[field])
        },
        [result]
    )

    const pid = useMemo(() => {
        const _pid = getField("pid")
        if (_pid && _pid.startsWith("https://")) {
            return /https:\/\/.*?\/(.*)/.exec(_pid)?.[1] ?? _pid
        } else {
            return _pid
        }
    }, [getField])

    const title = useMemo(() => {
        return getField("name")
    }, [getField])

    const identifier = useMemo(() => {
        return getField("identifier")
    }, [getField])

    const hadPrimarySource = useMemo(() => {
        return getField("hadPrimarySource")
    }, [getField])

    const license = useMemo(() => {
        return getField("licenseURL")
    }, [getField])

    const fileType = useMemo(() => {
        return getField("digitalObjectType")
    }, [getField])

    const doLocation = useMemo(() => {
        const value = getField("digitalObjectLocation")
        if (HTTP_REGEX.test(value)) return value
        else return `https://doi.org/${value}`
    }, [getField])

    const previewImage = useMemo(() => {
        return getField("locationPreview/Sample")
    }, [getField])

    const id = useMemo(() => {
        return getField("id")
    }, [getField])

    const isMetadataFor = useMemo(() => {
        return getArrayField("isMetadataFor")
    }, [getArrayField])

    const creationDate = useMemo(() => {
        const value = getField("dateCreatedRfc3339")
        const dateTime = DateTime.fromISO(value)
        return dateTime.isValid ? dateTime.toLocaleString() : ""
    }, [getField])

    const hasMetadata = useMemo(() => {
        return getField("hasMetadata")
    }, [getField])

    const resourceType = useMemo(() => {
        return getField("resourceType")
    }, [getField])

    const fetchRelatedItems = useCallback(async () => {
        const search = await elasticConnector?.onSearch(
            { searchTerm: pid, resultsPerPage: 20 },
            {
                result_fields: {},
                searchTerm: pid,
                search_fields: { pid: {}, name: {}, hasMetadata: {}, isMetadataFor: {} },
                resultsPerPage: 20
            }
        )

        if (search) {
            for (const entry of search.results) {
                addToResultCache(entry.pid.raw, {
                    pid: entry.pid.raw,
                    name: entry.name.raw
                })
            }
        }
    }, [addToResultCache, elasticConnector, pid])

    const showRelatedItems = useCallback(async () => {
        await fetchRelatedItems()

        openRelationGraph(
            {
                id: pid,
                label: title,
                tag: "Study",
                remoteURL: doLocation,
                searchQuery: pid
            },
            isMetadataFor.map((pid) => {
                const cached = getResultFromCache(pid)
                return new BasicRelationNode(pid, "Dataset", cached?.name)
            })
        )
    }, [doLocation, fetchRelatedItems, getResultFromCache, isMetadataFor, openRelationGraph, pid, title])

    const goToMetadata = useCallback(() => {
        searchFor(hasMetadata)
    }, [hasMetadata, searchFor])

    const exactPidMatch = useMemo(() => {
        return searchTerm === pid || searchTerm === doLocation
    }, [doLocation, pid, searchTerm])

    useEffect(() => {
        if (title && pid) {
            addToResultCache(pid, {
                name: title,
                pid
            })
        }
    }, [addToResultCache, pid, title])

    return (
        <div className={`m-2 rounded-lg border border-border p-4 ${exactPidMatch ? "animate-outline-ping" : ""}`}>
            <div className="grid grid-rows-[100px_1fr] gap-4 overflow-x-auto md:max-w-full md:grid-cols-[200px_1fr] md:grid-rows-1">
                <div className="flex justify-center rounded dark:bg-white md:items-center md:p-2">
                    {previewImage ? (
                        <Image className="md:size-[200px]" src={previewImage} alt={`Preview for ${title}`} width={200} height={200} />
                    ) : (
                        <div className="flex flex-col justify-center dark:text-background">
                            <ImageOff className="size-6 text-muted-foreground/50" />
                        </div>
                    )}
                </div>
                <div className="flex flex-col overflow-x-auto md:max-w-full">
                    {exactPidMatch && (
                        <div className="mb-2">
                            <Badge>Exact Match</Badge>
                        </div>
                    )}
                    <div className="font-bold md:text-xl">
                        {title}
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                            {identifier} -{creationDate}
                        </span>
                    </div>
                    <a href={`https://hdl.handle.net/${id}`} target="_blank" className="mb-2 block leading-3 hover:underline">
                        <span className="text-sm text-muted-foreground">{id}</span>
                    </a>
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="truncate">
                            <span className="flex truncate">
                                <GraduationCap className="mr-2 size-4 shrink-0" /> {resourceType}
                            </span>
                        </Badge>
                        <Badge variant="secondary" className="truncate">
                            <span className="flex truncate">
                                <Globe className="mr-2 size-4 shrink-0" /> {hadPrimarySource}
                            </span>
                        </Badge>
                        <Badge variant="secondary" className="truncate">
                            <span className="flex truncate">
                                <Scale className="mr-2 size-4 shrink-0" />️{license}
                            </span>
                        </Badge>
                        <Badge variant="secondary" className="truncate">
                            <span className="flex truncate">
                                <File className="mr-2 size-4 shrink-0" />
                                <PidDisplay pid={fileType} />
                            </span>
                        </Badge>
                    </div>
                    <div className="grow"></div>
                    <div className="mt-8 flex flex-col flex-wrap justify-end gap-2 md:flex-row md:items-center md:gap-4">
                        {debug && (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="secondary" size="sm">
                                        Show FDO
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-h-full max-w-[1000px] overflow-y-auto">
                                    <ObjectRender data={result} />
                                </DialogContent>
                            </Dialog>
                        )}
                        {isMetadataFor.length > 0 && (
                            <div className="flex items-center">
                                <Button className="grow rounded-r-none" size="sm" variant="secondary" onClick={showRelatedItems}>
                                    <GitFork className="mr-1 size-4" /> Show Related Items
                                </Button>
                                <Button className="rounded-l-none border-l border-l-border text-xs font-bold" size="sm" variant="secondary" onClick={showRelatedItems}>
                                    {isMetadataFor.length}
                                </Button>
                            </div>
                        )}
                        {hasMetadata && (
                            <Button className="" size="sm" variant="secondary" onClick={goToMetadata}>
                                <BookText className="mr-1 size-4" /> Find Metadata
                            </Button>
                        )}

                        <div className="flex items-center">
                            <a href={doLocation} target="_blank" className="grow">
                                <Button size="sm" className="w-full rounded-r-none px-4">
                                    Open
                                </Button>
                            </a>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size="sm" className="rounded-l-none border-l">
                                        <ChevronDown className="mr-1 size-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <a href={doLocation} target="_blank">
                                        <DropdownMenuItem>
                                            <LinkIcon className="mr-1 size-4" /> Open Source
                                        </DropdownMenuItem>
                                    </a>
                                    <a href={`https://kit-data-manager.github.io/fairdoscope/?pid=${pid}`} target="_blank">
                                        <DropdownMenuItem>
                                            <Microscope className="mr-1 size-4" /> Open in FAIR-DOscope
                                        </DropdownMenuItem>
                                    </a>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
