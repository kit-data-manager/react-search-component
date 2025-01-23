"use client"

import type { SearchResult } from "@elastic/search-ui"
import { FairDOSearchContext } from "@/components/FairDOSearchContext"
import { GlobalModalContext } from "@/components/GlobalModalContext"
import { ObjectRender } from "@/components/result/ObjectRender"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BasicRelationNode } from "@/lib/RelationNode"
import { resultCache } from "@/lib/ResultCache"
import { Atom, BookText, ChevronDown, GitFork, Globe, GraduationCap, ImageOff, LinkIcon, Microscope, Scale } from "lucide-react"
import { DateTime } from "luxon"
import { useCallback, useContext, useEffect, useMemo } from "react"
import { useStore } from "zustand"
import { tryURLPrettyPrint } from "@/lib/utils"
import { autoUnwrap, autoUnwrapArray } from "@/components/result/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

const HTTP_REGEX = /https?:\/\/[a-z]+\.[a-z]+.*/gm

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
        const value = getField("hadPrimarySource")
        return tryURLPrettyPrint(value)
    }, [getField])

    const license = useMemo(() => {
        const value = getField("licenseURL")
        return tryURLPrettyPrint(value)
    }, [getField])

    // const fileType = useMemo(() => {
    //     return getField("digitalObjectType")
    // }, [getField])

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

    const compound = useMemo(() => {
        return getField("Compound")
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
        <div className={`rfs-m-2 rfs-rounded-lg rfs-border rfs-border-border rfs-p-4 ${exactPidMatch ? "rfs-animate-outline-ping" : ""}`}>
            <div className="rfs-grid rfs-grid-rows-[100px_1fr] rfs-gap-4 rfs-overflow-x-auto md:rfs-max-w-full md:rfs-grid-cols-[200px_1fr] md:rfs-grid-rows-1">
                <div className="rfs-flex rfs-justify-center rfs-rounded md:rfs-items-center rfs-p-2 d dark:rfs-invert">
                    {previewImage ? (
                        <img className="md:rfs-size-[200px]" src={previewImage} alt={`Preview for ${title}`} />
                    ) : (
                        <div className="rfs-flex rfs-flex-col rfs-justify-center dark:rfs-text-background">
                            <ImageOff className="rfs-size-6 rfs-text-muted-foreground/50" />
                        </div>
                    )}
                </div>
                <div className="rfs-flex rfs-flex-col rfs-overflow-x-auto md:rfs-max-w-full">
                    {exactPidMatch && (
                        <div className="rfs-mb-2">
                            <Badge>Exact Match</Badge>
                        </div>
                    )}
                    <div className="rfs-font-bold md:rfs-text-xl">
                        {title}
                        <span className="rfs-ml-2 rfs-text-sm rfs-font-normal rfs-text-muted-foreground">
                            {identifier} - {creationDate}
                        </span>
                    </div>
                    <a href={`https://hdl.handle.net/${id}`} target="_blank" className="rfs-mb-2 rfs-block rfs-leading-3 hover:rfs-underline">
                        <span className="rfs-text-sm rfs-text-muted-foreground">{id}</span>
                    </a>
                    <div className="rfs-flex rfs-flex-wrap rfs-gap-2">
                        <Tooltip delayDuration={500}>
                            <TooltipTrigger>
                                <Badge variant="secondary" className="rfs-truncate">
                                    <span className="rfs-flex rfs-truncate">
                                        <GraduationCap className="rfs-mr-2 rfs-size-4 rfs-shrink-0" /> {resourceType}
                                    </span>
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent>Resource Type</TooltipContent>
                        </Tooltip>
                        <Tooltip delayDuration={500}>
                            <TooltipTrigger>
                                <Badge variant="secondary" className="rfs-truncate">
                                    <span className="rfs-flex rfs-truncate">
                                        <Globe className="rfs-mr-2 rfs-size-4 rfs-shrink-0" /> {hadPrimarySource}
                                    </span>
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent>Source Website</TooltipContent>
                        </Tooltip>
                        <Tooltip delayDuration={500}>
                            <TooltipTrigger>
                                <Badge variant="secondary" className="rfs-truncate">
                                    <span className="rfs-flex rfs-truncate">
                                        <Scale className="rfs-mr-2 rfs-size-4 rfs-shrink-0" />️{license}
                                    </span>
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent>License URL</TooltipContent>
                        </Tooltip>
                        <Tooltip delayDuration={500}>
                            <TooltipTrigger>
                                <Badge variant="secondary" className="rfs-truncate">
                                    <span className="rfs-flex rfs-truncate">
                                        <Atom className="rfs-mr-2 rfs-size-4 rfs-shrink-0" />️{compound}
                                    </span>
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent>Compound (weight in Mol)</TooltipContent>
                        </Tooltip>
                    </div>
                    <div className="rfs-grow"></div>
                    <div className="rfs-mt-8 rfs-flex rfs-flex-col rfs-flex-wrap rfs-justify-end rfs-gap-2 md:rfs-flex-row md:rfs-items-center md:rfs-gap-4">
                        {debug && (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="secondary" size="sm">
                                        Show FDO
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="rfs-max-h-full rfs-max-w-[1000px] rfs-overflow-y-auto">
                                    <ObjectRender data={result} />
                                </DialogContent>
                            </Dialog>
                        )}
                        {isMetadataFor.length > 0 && (
                            <div className="rfs-flex rfs-items-center">
                                <Button className="rfs-grow rfs-rounded-r-none" size="sm" variant="secondary" onClick={showRelatedItems}>
                                    <GitFork className="rfs-mr-1 rfs-size-4" /> Show Related Items
                                </Button>
                                <Button
                                    className="rfs-rounded-l-none rfs-border-l rfs-border-l-border rfs-text-xs rfs-font-bold"
                                    size="sm"
                                    variant="secondary"
                                    onClick={showRelatedItems}
                                >
                                    {isMetadataFor.length}
                                </Button>
                            </div>
                        )}
                        {hasMetadata && (
                            <Button className="" size="sm" variant="secondary" onClick={goToMetadata}>
                                <BookText className="rfs-mr-1 rfs-size-4" /> Find Metadata
                            </Button>
                        )}

                        <div className="rfs-flex rfs-items-center">
                            <a href={doLocation} target="_blank" className="grow">
                                <Button size="sm" className="rfs-w-full rfs-rounded-r-none rfs-px-4">
                                    Open
                                </Button>
                            </a>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size="sm" className="rfs-rounded-l-none rfs-border-l">
                                        <ChevronDown className="rfs-mr-1 rfs-size-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <a href={doLocation} target="_blank">
                                        <DropdownMenuItem>
                                            <LinkIcon className="rfs-mr-1 rfs-size-4" /> Open Source
                                        </DropdownMenuItem>
                                    </a>
                                    <a href={`https://kit-data-manager.github.io/fairdoscope/?pid=${pid}`} target="_blank">
                                        <DropdownMenuItem>
                                            <Microscope className="rfs-mr-1 rfs-size-4" /> Open in FAIR-DOscope
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
