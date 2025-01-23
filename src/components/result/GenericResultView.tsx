import { useCallback, useContext, useEffect, useMemo } from "react"
import { RFS_GlobalModalContext } from "@/components/RFS_GlobalModalContext"
import { FairDOSearchContext } from "@/components/FairDOSearchContext"
import { useStore } from "zustand/index"
import { resultCache } from "@/lib/ResultCache"
import { autoUnwrap, autoUnwrapArray } from "@/components/result/utils"
import { DateTime } from "luxon"
import { BasicRelationNode } from "@/lib/RelationNode"
import { BookText, ChevronDown, GitFork, ImageOff, LinkIcon, Microscope } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SearchFieldConfiguration, SearchResult } from "@elastic/search-ui"
import { GenericResultViewTag, GenericResultViewTagProps } from "@/components/result/GenericResultViewTag"

const HTTP_REGEX = /https?:\/\/[a-z]+\.[a-z]+.*/gm

export function GenericResultView({
    result,
    titleField,
    descriptionField,
    imageField,
    invertImageInDarkMode,
    digitalObjectLocationField,
    pidField,
    relatedItemPidsField,
    parentItemPidField,
    creationDateField,
    identifierField,
    relatedItemsPrefetch,
    tags,
    showOpenInFairDoScope
}: {
    result: SearchResult
    titleField?: string
    descriptionField?: string
    imageField?: string
    invertImageInDarkMode?: boolean
    digitalObjectLocationField?: string
    pidField?: string
    relatedItemPidsField?: string
    relatedItemsPrefetch?: { prefetchAmount?: number; searchFields?: Record<string, SearchFieldConfiguration> }
    parentItemPidField?: string
    creationDateField?: string
    identifierField?: string
    tags?: Omit<GenericResultViewTagProps, "result">[]
    showOpenInFairDoScope?: boolean
}) {
    const { openRelationGraph } = useContext(RFS_GlobalModalContext)
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
        return getField(titleField ?? "name")
    }, [getField, titleField])

    const description = useMemo(() => {
        return getField(descriptionField ?? "description")
    }, [descriptionField, getField])

    const doLocation = useMemo(() => {
        const value = getField(digitalObjectLocationField ?? "digitalObjectLocation")
        if (HTTP_REGEX.test(value)) return value
        else return `https://doi.org/${value}`
    }, [digitalObjectLocationField, getField])

    const previewImage = useMemo(() => {
        return getField(imageField ?? "imageURL")
    }, [getField, imageField])

    const identifier = useMemo(() => {
        return getField(identifierField ?? "identifier")
    }, [getField, identifierField])

    const isMetadataFor = useMemo(() => {
        return getArrayField(relatedItemPidsField ?? "isMetadataFor")
    }, [getArrayField, relatedItemPidsField])

    const creationDate = useMemo(() => {
        const value = getField(creationDateField ?? "dateCreated")
        const dateTime = DateTime.fromISO(value)
        return dateTime.isValid ? dateTime.toLocaleString() : value
    }, [creationDateField, getField])

    const hasMetadata = useMemo(() => {
        return getField(parentItemPidField ?? "hasMetadata")
    }, [getField, parentItemPidField])

    const fetchRelatedItems = useCallback(async () => {
        const search = await elasticConnector?.onSearch(
            { searchTerm: pid, resultsPerPage: relatedItemsPrefetch?.prefetchAmount },
            {
                result_fields: {},
                searchTerm: pid,
                search_fields: relatedItemsPrefetch?.searchFields ?? { [pidField ?? "pid"]: {} },
                resultsPerPage: relatedItemsPrefetch?.prefetchAmount
            }
        )

        if (search) {
            for (const entry of search.results) {
                addToResultCache(autoUnwrap(entry[pidField ?? "pid"]), {
                    pid: autoUnwrap(entry[pidField ?? "pid"]),
                    name: autoUnwrap(entry[titleField ?? "name"])
                })
            }
        }
    }, [addToResultCache, elasticConnector, pid, pidField, relatedItemsPrefetch?.prefetchAmount, relatedItemsPrefetch?.searchFields, titleField])

    const showRelatedItems = useCallback(async () => {
        await fetchRelatedItems()

        openRelationGraph(
            {
                id: pid,
                label: title,
                tag: "Current",
                remoteURL: doLocation,
                searchQuery: pid
            },
            isMetadataFor.map((pid) => {
                const cached = getResultFromCache(pid)
                return new BasicRelationNode(pid, "Related", cached?.name)
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
            <div
                className={`rfs-grid ${imageField ? "rfs-grid-rows-[100px_1fr] md:rfs-grid-cols-[200px_1fr] md:rfs-grid-rows-1" : ""} rfs-gap-4 rfs-overflow-x-auto md:rfs-max-w-full`}
            >
                {imageField && (
                    <div
                        className={`rfs-flex rfs-justify-center rfs-rounded md:rfs-items-center rfs-p-2 d ${invertImageInDarkMode ? "dark:rfs-invert" : ""} `}
                    >
                        {previewImage ? (
                            <img className="md:rfs-size-[200px]" src={previewImage} alt={`Preview for ${title}`} />
                        ) : (
                            <div className="rfs-flex rfs-flex-col rfs-justify-center dark:rfs-text-background">
                                <ImageOff className="rfs-size-6 rfs-text-muted-foreground/50" />
                            </div>
                        )}
                    </div>
                )}
                <div className="rfs-flex rfs-flex-col rfs-overflow-x-auto md:rfs-max-w-full">
                    {exactPidMatch && (
                        <div className="rfs-mb-2">
                            <Badge>Exact Match</Badge>
                        </div>
                    )}
                    <div className="rfs-font-bold md:rfs-text-xl">
                        {title}
                        <span className="rfs-ml-2 rfs-text-sm rfs-font-normal rfs-text-muted-foreground">
                            {identifier} {identifier && creationDate ? "-" : ""} {creationDate}
                        </span>
                    </div>
                    <a href={`https://hdl.handle.net/${pid}`} target="_blank" className="rfs-mb-2 rfs-block rfs-leading-3 hover:rfs-underline">
                        <span className="rfs-text-sm rfs-text-muted-foreground">{pid}</span>
                    </a>
                    <div className="rfs-flex rfs-flex-wrap rfs-gap-2">
                        {tags && tags.map((tag) => <GenericResultViewTag key={tag.field} result={result} {...tag} />)}
                    </div>
                    <div className="rfs-grow">{description}</div>
                    <div className="rfs-mt-8 rfs-flex rfs-flex-col rfs-flex-wrap rfs-justify-end rfs-gap-2 md:rfs-flex-row md:rfs-items-center md:rfs-gap-4">
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
                                    {showOpenInFairDoScope && (
                                        <a href={`https://kit-data-manager.github.io/fairdoscope/?pid=${pid}`} target="_blank">
                                            <DropdownMenuItem>
                                                <Microscope className="rfs-mr-1 rfs-size-4" /> Open in FAIR-DOscope
                                            </DropdownMenuItem>
                                        </a>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
