import { SearchResult } from "@elastic/search-ui"
import { useCallback, useMemo } from "react"
import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button.tsx"
import { ObjectRender } from "@/components/ObjectRender.tsx"
import { ExternalLink, File, Globe, Scale } from "lucide-react"
import { DateTime } from "luxon"
import { PidDisplay } from "@/components/PidDisplay.tsx"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog.tsx"

function autoUnwrap(item: string | { raw: string }) {
    if (typeof item === "string") return item
    else if (typeof item === "object" && "raw" in item && typeof item.raw === "string")
        return item.raw
    else return JSON.stringify(item)
}

export function NMRResultView({ result }: { result: SearchResult }) {
    const getField = useCallback(
        (field: string) => {
            return autoUnwrap(result[field])
        },
        [result]
    )

    const title = useMemo(() => {
        return getField("name")
    }, [getField])

    const identifier = useMemo(() => {
        return getField("identifier")
    }, [getField])

    const formula = useMemo(() => {
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

    const creationDate = useMemo(() => {
        const value = getField("dateCreatedRfc3339")
        return DateTime.fromISO(value).toLocaleString()
    }, [getField])

    return (
        <div className="m-2 p-4 border border-border rounded-lg">
            <div className="grid md:grid-cols-[200px_1fr] md:grid-rows-1 grid-rows-[100px_1fr] md:max-w-full overflow-x-auto gap-4">
                <div className="flex justify-center md:p-2 dark:bg-white rounded">
                    <img
                        className="md:w-[200px] md:h-[200px]"
                        src={previewImage}
                        alt={"Preview for " + title}
                    />
                </div>
                <div className="flex flex-col md:max-w-full overflow-x-auto">
                    <div className="md:text-xl font-bold mb-1">
                        {title}
                        <span className="ml-2 font-normal  text-sm text-muted-foreground">
                            {identifier} - {creationDate}
                        </span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <Badge variant="secondary" className="truncate">
                            <span className="truncate flex">
                                <Globe className="w-4 h-4 mr-2 shrink-0" /> {formula}
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

                    <div className="grow" />

                    <div className="flex gap-2 md:gap-4 md:items-center mt-8 justify-end md:flex-row flex-col">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="secondary" size="sm">
                                    Show FDO
                                </Button>
                            </DialogTrigger>
                            <DialogContent className={"max-w-[1000px] max-h-full overflow-y-auto"}>
                                <ObjectRender data={result} />
                            </DialogContent>
                        </Dialog>
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
