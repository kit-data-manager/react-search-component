import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { RelationsGraphContext } from "@/components/graph/RelationsGraphContext"
import { FairDOSearchContext } from "@/components/FairDOSearchContext"
import { useStore } from "zustand/index"
import { resultCache } from "@/lib/ResultCache"
import { autoUnwrap, autoUnwrapArray, toArray } from "@/components/result/utils"
import { DateTime } from "luxon"
import { ChevronDown, Download, GitFork, LoaderCircle, Microscope, Pencil, PlusIcon, SearchIcon, TableProperties } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SearchFieldConfiguration } from "@elastic/search-ui"
import { GenericResultViewTag, GenericResultViewTagProps } from "@/components/result/GenericResultViewTag"
import { z } from "zod"
import { GenericResultViewImage } from "@/components/result/GenericResultViewImage"
import { GraphNodeUtils } from "@/components/graph/GraphNodeUtils"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { PidComponent } from "@kit-data-manager/react-pid-component"

const HTTP_REGEX = /https?:\/\/.*/

export interface GenericResultViewProps {
    /**
     * Search result that will be rendered in this view. Will be provided by FairDOElasticSearch
     */
    result: Record<string, unknown>

    /**
     * The elastic field where the title of the card will be read from
     */
    titleField?: string

    /**
     * The elastic field where the description of the card will be read from
     */
    descriptionField?: string

    /**
     * The elastic field where the image of the card will be read from. Will directly be passed to the `src` attribute of an `img` tag
     */
    imageField?: string

    /**
     * Enable this option to invert the image on dark mode. This is useful for greyscale schematics.
     */
    invertImageInDarkMode?: boolean

    /**
     * The elastic field where the digital object location (the target page of the `Open` button) will be read from
     */
    digitalObjectLocationField?: string

    /**
     * The elastic field where the landing page location will be read from
     */
    landingPageLocationField?: string

    /**
     * The elastic field where the PID of the current FDO will be read from. Can be omitted if you don't have a PID
     */
    pidField?: string

    /**
     * The elastic field where the unique identifier of the child item(s) of the current FDO will be read from. Should be an array of PIDs or otherwise unique identifiers. Will be displayed in a related items graph.
     */
    childItemPidField?: string

    /**
     * Options for prefetching of related items in the relations graph. It is recommended to define this if the default settings don't work properly.
     * @default Value of pidField
     * @example
     * relatedItemsPrefetch={{ searchFields: { pid: {} } }}
     */
    relatedItemsPrefetchOptions?: { searchFields?: Record<string, SearchFieldConfiguration> }

    /**
     * The elastic field where the unique identifier of the parent item(s) of the current FDO will be read from. Should be an array of PIDs or otherwise unique identifiers. Will be displayed in a related items graph.
     */
    parentItemPidField?: string

    /**
     * The elastic field where the creation date of the FDO will be read from. Will be parsed as an ISO Date.
     */
    creationDateField?: string

    /**
     * The elastic field where the edited date of the FDO will be read from. Will be parsed as an ISO Date.
     */
    editedDateField?: string

    /**
     * The elastic field where an additional identifier will be read from. You don't need to provide this if you don't have any additional identifiers apart from the PID.
     */
    additionalIdentifierField?: string

    /**
     * Define custom tags to display on the card. Each tag displays the information from one field.
     */
    tags?: Omit<GenericResultViewTagProps, "result">[]

    /**
     * Whether to show the open in FairDOScope button in the dropdown
     */
    showOpenInFairDoScope?: boolean

    /**
     * Whether to show the Inspect FDO button in the dropdown
     */
    showInspectFDO?: boolean
}

/**
 * Configurable result view component that can be customized for specific use cases. Will display a card for each search result from elastic. If this component
 * doesn't fit your needs, feel free to implement your own result view.
 */
export function GenericResultView({
    result,
    titleField = "name",
    descriptionField = "description",
    imageField,
    invertImageInDarkMode = false,
    landingPageLocationField = "landingPageLocation",
    digitalObjectLocationField = "digitalObjectLocation",
    pidField = "pid",
    childItemPidField = "isMetadataFor",
    parentItemPidField = "hasMetadata",
    creationDateField = "creationDate",
    editedDateField = "editedDate",
    additionalIdentifierField = "identifier",
    relatedItemsPrefetchOptions = { searchFields: { pid: {} } },
    tags = [],
    showOpenInFairDoScope = true,
    showInspectFDO = true
}: GenericResultViewProps) {
    const { openRelationsGraph } = useContext(RelationsGraphContext)
    const { searchTerm, elasticConnector, searchFor, config } = useContext(FairDOSearchContext)
    const addToResultCache = useStore(resultCache, (s) => s.set)
    const [loadingRelatedItems, setLoadingRelatedItems] = useState(false)
    const [showInspectDialog, setShowInspectDialog] = useState(false)

    const getField = useCallback(
        (field: string) => {
            try {
                const value = autoUnwrap(
                    z
                        .string()
                        .or(z.number())
                        .or(z.object({ raw: z.string().or(z.number()) }))
                        .optional()
                        .parse(result[field])
                )

                return value ? value + "" : undefined
            } catch (e) {
                console.warn(`Parsing field ${field} failed`, e)
                return undefined
            }
        },
        [result]
    )

    const getArrayField = useCallback(
        (field: string) => {
            try {
                const value = autoUnwrapArray<string | number>(
                    z
                        .string()
                        .array()
                        .or(z.number().array())
                        .or(z.object({ raw: z.string().array() }))
                        .or(z.object({ raw: z.number().array() }))
                        .optional()
                        .parse(result[field])
                )
                return value ? value.map((v) => v + "") : []
            } catch (e) {
                console.warn(`Parsing array field ${field} failed`, e)
                return []
            }
        },
        [result]
    )

    const getArrayOrSingleField = useCallback(
        (field: string) => {
            const _field: unknown = result[field]
            if (Array.isArray(_field) || (typeof _field === "object" && _field && "raw" in _field && Array.isArray(_field.raw))) {
                return getArrayField(field)
            } else {
                return getField(field)
            }
        },
        [getArrayField, getField, result]
    )

    const extractPid = useCallback((pidFieldValue: string) => {
        if (pidFieldValue.startsWith("https://")) {
            return /https:\/\/.*?\/(.*)/.exec(pidFieldValue)?.[1] ?? pidFieldValue
        } else {
            return pidFieldValue
        }
    }, [])

    const pid = useMemo(() => {
        const _pid = getField(pidField ?? "pid")
        return _pid ? extractPid(_pid) : _pid
    }, [extractPid, getField, pidField])

    const title = useMemo(() => {
        const maybeArray = getArrayOrSingleField(titleField ?? "name")
        return Array.isArray(maybeArray) ? maybeArray.join(", ") : maybeArray
    }, [getArrayOrSingleField, titleField])

    const description = useMemo(() => {
        const maybeArray = getArrayOrSingleField(descriptionField ?? "description")
        return Array.isArray(maybeArray) ? maybeArray.join("\n\r") : maybeArray
    }, [descriptionField, getArrayOrSingleField])

    const doLocation = useMemo(() => {
        const value = getField(digitalObjectLocationField ?? "digitalObjectLocation")
        if (!value) return undefined
        if (HTTP_REGEX.test(value)) return value
        else return `https://doi.org/${value}`
    }, [digitalObjectLocationField, getField])

    const landingPageLocation = useMemo(() => {
        return getField(landingPageLocationField ?? "landingPageLocation")
    }, [getField, landingPageLocationField])

    const previewImage = useMemo(() => {
        const images = getArrayOrSingleField(imageField ?? "imageURL")
        const normalized = Array.isArray(images) ? (images.length === 1 ? images[0] : images) : images
        if (config.imageProxy && normalized) {
            return Array.isArray(normalized) ? normalized.map(config.imageProxy) : config.imageProxy(normalized)
        } else return normalized
    }, [config, getArrayOrSingleField, imageField])

    const identifier = useMemo(() => {
        const maybeArray = getArrayOrSingleField(additionalIdentifierField ?? "identifier")
        return Array.isArray(maybeArray) ? maybeArray.join(" - ") : maybeArray
    }, [getArrayOrSingleField, additionalIdentifierField])

    const isMetadataFor = useMemo(() => {
        const val = getArrayOrSingleField(childItemPidField ?? "isMetadataFor")
        return val ? toArray(val) : undefined
    }, [getArrayOrSingleField, childItemPidField])

    const creationDate = useMemo(() => {
        const value = getField(creationDateField ?? "dateCreated")
        if (!value) return undefined
        const dateTime = DateTime.fromISO(value)
        return dateTime.isValid ? dateTime.toLocaleString() : value
    }, [creationDateField, getField])

    const editedDate = useMemo(() => {
        const value = getField(editedDateField ?? "editedDate")
        if (!value) return undefined
        const dateTime = DateTime.fromISO(value)
        return dateTime.isValid ? dateTime.toLocaleString() : value
    }, [editedDateField, getField])

    const hasMetadata = useMemo(() => {
        const val = getArrayOrSingleField(parentItemPidField ?? "hasMetadata")
        return val ? toArray(val) : undefined
    }, [getArrayOrSingleField, parentItemPidField])

    const fetchRelatedItems = useCallback(
        async (term: string, amount: number) => {
            try {
                const search = await elasticConnector?.onSearch(
                    { searchTerm: term, resultsPerPage: amount + 5 },
                    {
                        result_fields: {},
                        searchTerm: term,
                        search_fields: relatedItemsPrefetchOptions?.searchFields ?? { [pidField ?? "pid"]: {} },
                        resultsPerPage: amount
                    }
                )

                if (search) {
                    for (const entry of search.results) {
                        const pid = autoUnwrap(entry[pidField ?? "pid"])
                        if (!pid) continue
                        addToResultCache(pid, entry)
                    }
                }
            } catch (e) {
                console.warn("Failed to fetch related items", e)
                alert("Failed to fetch related items, graph may be incomplete")
            }
        },
        [addToResultCache, elasticConnector, pidField, relatedItemsPrefetchOptions?.searchFields]
    )

    const showRelatedItemsGraph = useCallback(async () => {
        if (!pid) return
        setLoadingRelatedItems(true)
        if (isMetadataFor) await fetchRelatedItems(isMetadataFor.join(" "), isMetadataFor.length)
        if (hasMetadata) await fetchRelatedItems(hasMetadata.join(" "), hasMetadata.length)
        setLoadingRelatedItems(false)

        const nodes = GraphNodeUtils.buildSequentialGraphFromIds("result", hasMetadata ?? [], pid, isMetadataFor ?? [])
        openRelationsGraph(nodes, {
            focusedNodes: [pid]
        })
    }, [fetchRelatedItems, hasMetadata, isMetadataFor, openRelationsGraph, pid])

    const showRelatedItemsButton = useMemo(() => {
        return (hasMetadata && hasMetadata.length > 0) || (isMetadataFor && isMetadataFor.length > 0)
    }, [hasMetadata, isMetadataFor])

    const relatedItemsAmount = useMemo(() => {
        return (hasMetadata ? hasMetadata.length : 0) + (isMetadataFor ? isMetadataFor.length : 0)
    }, [hasMetadata, isMetadataFor])

    const exactPidMatch = useMemo(() => {
        return searchTerm === pid || searchTerm === doLocation
    }, [doLocation, pid, searchTerm])

    const searchForThis = useCallback(() => {
        if (!pid) return
        setTimeout(() => {
            searchFor(pid)
        }, 100)
    }, [pid, searchFor])

    useEffect(() => {
        if (pid) {
            addToResultCache(pid, result)
        }
    }, [addToResultCache, pid, result])

    return (
        <div
            className={`rfs-m-2 rfs-rounded-lg rfs-border rfs-border-border rfs-bg-background rfs-p-4 rfs-group/resultView ${exactPidMatch ? "rfs-outline-primary rfs-outline" : ""}`}
        >
            <div
                className={`rfs-grid ${imageField ? "rfs-grid-rows-[150px_1fr] md:rfs-grid-cols-[200px_1fr] md:rfs-grid-rows-1" : ""} rfs-gap-4 rfs-overflow-x-auto md:rfs-max-w-full`}
            >
                {imageField && <GenericResultViewImage previewImage={previewImage} title={title} invertImageInDarkMode={invertImageInDarkMode} />}
                <div className="rfs-flex rfs-flex-col rfs-overflow-x-auto md:rfs-max-w-full">
                    {exactPidMatch && (
                        <div className="rfs-mb-2">
                            <Badge>Exact Match</Badge>
                        </div>
                    )}
                    <div>
                        <div className="rfs-font-bold md:rfs-text-xl rfs-mr-2">{title}</div>
                        <div className="rfs-flex rfs-text-sm rfs-font-normal rfs-text-muted-foreground rfs-gap-3">
                            {identifier}
                            {creationDate && (
                                <div className="rfs-flex rfs-items-center">
                                    <PlusIcon className="rfs-size-3 rfs-mr-0.5" /> {creationDate}
                                </div>
                            )}
                            {editedDate && (
                                <div className="rfs-flex rfs-items-center">
                                    <Pencil className="rfs-size-3 rfs-mr-0.5" /> {editedDate}
                                </div>
                            )}
                        </div>
                    </div>
                    <a
                        href={`https://hdl.handle.net/${pid}?noredirect`}
                        target="_blank"
                        className="rfs-mb-2 rfs-block rfs-leading-3 hover:rfs-underline"
                    >
                        <span className="rfs-text-sm rfs-text-muted-foreground">{pid}</span>
                    </a>
                    <div className="rfs-flex rfs-flex-wrap rfs-gap-2 rfs-truncate rfs-items-center">
                        {tags && tags.map((tag, i) => <GenericResultViewTag key={i} result={result} {...tag} />)}
                    </div>
                    <div className="rfs-grow">{description}</div>
                    <div className="rfs-mt-8 rfs-flex rfs-flex-col rfs-flex-wrap rfs-justify-end rfs-gap-2 md:rfs-flex-row md:rfs-items-center md:rfs-gap-4">
                        {showRelatedItemsButton && (
                            <div className="rfs-flex rfs-items-center">
                                <Button
                                    className="rfs-grow rfs-rounded-r-none"
                                    disabled={loadingRelatedItems}
                                    size="sm"
                                    variant="secondary"
                                    onClick={showRelatedItemsGraph}
                                >
                                    {loadingRelatedItems ? (
                                        <LoaderCircle className="rfs-mr-1 rfs-size-4 rfs-animate-spin" />
                                    ) : (
                                        <GitFork className="rfs-mr-1 rfs-size-4" />
                                    )}
                                    Show Related Items
                                </Button>
                                <Button
                                    className="rfs-rounded-l-none rfs-border-l rfs-border-l-border rfs-text-xs rfs-font-bold"
                                    size="sm"
                                    variant="secondary"
                                    onClick={showRelatedItemsGraph}
                                >
                                    {relatedItemsAmount}
                                </Button>
                            </div>
                        )}

                        {landingPageLocation && (
                            <div className="rfs-flex rfs-items-center">
                                <a href={landingPageLocation} target="_blank" className="rfs-grow">
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
                                                <Download className="rfs-mr-1 rfs-size-4" /> Download Digital Object
                                            </DropdownMenuItem>
                                        </a>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={searchForThis}>
                                            <SearchIcon className="rfs-mr-1 rfs-size-4" /> Search for this
                                        </DropdownMenuItem>
                                        {showOpenInFairDoScope && (
                                            <a href={`https://kit-data-manager.github.io/fairdoscope/?pid=${pid}`} target="_blank">
                                                <DropdownMenuItem>
                                                    <Microscope className="rfs-mr-1 rfs-size-4" /> Open in FAIR-DOscope
                                                </DropdownMenuItem>
                                            </a>
                                        )}
                                        {showInspectFDO && (
                                            <>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => setShowInspectDialog(true)}>
                                                    <TableProperties className="rfs-size-4 rfs-mr-1" /> Inspect FDO
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showInspectFDO && (
                <Dialog open={showInspectDialog} onOpenChange={setShowInspectDialog}>
                    <DialogContent className="!rfs-max-w-[calc(100vw-40px)] !rfs-min-w-[min(1200px,calc(100vw-40px))]">
                        <DialogTitle>Inspect Fair Digital Object</DialogTitle>

                        <div className={"rfs-overflow-auto"}>
                            <PidComponent openByDefault value={pid} levelOfSubcomponents={10} />
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}
