import { SearchResult } from "@elastic/search-ui"
import { useCallback, useContext, useMemo } from "react"
import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button.tsx"
import { ObjectRender } from "@/components/ObjectRender.tsx"
import { ExternalLink, File, GitFork, Globe, ImageOff, Scale } from "lucide-react"
import { DateTime } from "luxon"
import { PidDisplay } from "@/components/PidDisplay.tsx"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog.tsx"
import { GlobalModalContext } from "@/components/GlobalModalContext.tsx"
import { basicRelationNode } from "@/components/helpers.ts"
import { FairDOSearchContext } from "@/components/FairDOSearchContext.tsx"

function autoUnwrap(item: string | { raw: string }) {
    if (typeof item === "string") return item
    else if (typeof item === "object" && "raw" in item && typeof item.raw === "string")
        return item.raw
    else return JSON.stringify(item)
}

function autoUnwrapArray(item: string[] | { raw: string[] }) {
    if (!item) return []
    if (Array.isArray(item)) return item
    else if (typeof item === "object" && "raw" in item && Array.isArray(item.raw)) return item.raw
    else return [JSON.stringify(item)]
}

export function NMRResultView({ result, debug }: { result: SearchResult; debug?: boolean }) {
    const { openRelationGraph } = useContext(GlobalModalContext)
    const { searchFor, searchTerm } = useContext(FairDOSearchContext)

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
            return /https:\/\/.*?\/(.*)/gm.exec(_pid)?.[1] ?? _pid
        } else return _pid
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
        return getField("digitalObjectLocation")
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

    const showRelations = useCallback(() => {
        openRelationGraph(
            {
                id: pid,
                label: title,
                remoteURL: doLocation,
                searchQuery: pid
            },
            isMetadataFor.map((pid) => basicRelationNode(pid))
        )
    }, [doLocation, isMetadataFor, openRelationGraph, pid, title])

    const goToMetadata = useCallback(() => {
        searchFor(hasMetadata)
    }, [hasMetadata, searchFor])

    const exactPidMatch = useMemo(() => {
        return searchTerm === pid || searchTerm === doLocation
    }, [doLocation, pid, searchTerm])

    return (
        <div className="m-2 p-4 border border-border rounded-lg">
            <div className="grid md:grid-cols-[200px_1fr] md:grid-rows-1 grid-rows-[100px_1fr] md:max-w-full overflow-x-auto gap-4">
                <div className="flex justify-center md:p-2 dark:bg-white rounded">
                    {previewImage ? (
                        <img
                            className="md:w-[200px] md:h-[200px]"
                            src={previewImage}
                            alt={"Preview for " + title}
                        />
                    ) : (
                        <div className="flex flex-col justify-center dark:text-background">
                            <ImageOff className="w-6 h-6 text-muted-foreground" />
                        </div>
                    )}
                </div>
                <div className="flex flex-col md:max-w-full overflow-x-auto">
                    {exactPidMatch && (
                        <div className="mb-2">
                            <Badge>Exact Match</Badge>
                        </div>
                    )}
                    <div className="md:text-xl font-bold">
                        {title}
                        <span className="ml-2 font-normal text-sm text-muted-foreground">
                            {identifier} - {creationDate}
                        </span>
                    </div>
                    <a
                        href={"https://hdl.handle.net/" + id}
                        target="_blank"
                        className="hover:underline mb-2 block leading-3"
                    >
                        <span className="text-sm text-muted-foreground">{id}</span>
                    </a>
                    <div className="flex gap-2 flex-wrap">
                        <Badge variant="secondary" className="truncate">
                            <span className="truncate flex">
                                <Globe className="w-4 h-4 mr-2 shrink-0" /> {hadPrimarySource}
                            </span>
                        </Badge>
                        <Badge variant="secondary" className="truncate">
                            <span className="truncate flex">
                                <Scale className="w-4 h-4 mr-2 shrink-0" />️ {license}
                            </span>
                        </Badge>
                        <Badge variant="secondary" className="truncate">
                            <span className="truncate flex">
                                <File className="w-4 h-4 mr-2 shrink-0" />
                                <PidDisplay pid={fileType} />
                            </span>
                        </Badge>
                    </div>
                    <div className="grow"></div>
                    <div className="flex gap-2 md:gap-4 md:items-center mt-8 justify-end md:flex-row flex-col flex-wrap">
                        {debug && (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="secondary" size="sm">
                                        Show FDO
                                    </Button>
                                </DialogTrigger>
                                <DialogContent
                                    className={"max-w-[1000px] max-h-full overflow-y-auto"}
                                >
                                    <ObjectRender data={result} />
                                </DialogContent>
                            </Dialog>
                        )}
                        {isMetadataFor.length > 0 && (
                            <div className="flex items-center">
                                <Button
                                    className="rounded-r-none grow"
                                    size="sm"
                                    variant="secondary"
                                    onClick={showRelations}
                                >
                                    <GitFork className="w-4 h-4 mr-1" /> Show Relations
                                </Button>
                                <Button
                                    className="border-l border-l-border rounded-l-none text-xs font-bold"
                                    size="sm"
                                    variant="secondary"
                                    onClick={showRelations}
                                >
                                    {isMetadataFor.length}
                                </Button>
                            </div>
                        )}
                        {hasMetadata && (
                            <Button
                                className=""
                                size="sm"
                                variant="secondary"
                                onClick={goToMetadata}
                            >
                                <GitFork className="w-4 h-4 mr-1" /> Go to Metadata
                            </Button>
                        )}
                        <a
                            href={"https://kit-data-manager.github.io/fairdoscope/?pid=" + pid}
                            target={"_blank"}
                        >
                            <Button size="sm" variant="secondary" className="w-full">
                                <ExternalLink className="w-4 h-4 mr-1" /> Open in FairDO Scope
                            </Button>
                        </a>
                        <a href={doLocation} target={"_blank"}>
                            <Button size="sm" className="w-full">
                                <ExternalLink className="w-4 h-4 mr-1" /> Open
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
