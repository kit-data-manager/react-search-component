import { SearchResult } from "@elastic/search-ui"
import { useCallback, useMemo } from "react"
import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button.tsx"
import { ObjectRender } from "@/components/ObjectRender.tsx"
import { ExternalLink } from "lucide-react"
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
            <div className="grid grid-cols-[200px_1fr] gap-4">
                <div className="flex justify-center p-2 dark:bg-white rounded">
                    <img className="w-[200px] h-[200px]" src={previewImage} alt={title} />
                </div>
                <div className="flex flex-col">
                    <div className="text-xl font-bold mb-1">
                        {title}
                        <span className="ml-2 font-normal  text-sm text-muted-foreground">
                            {identifier} - {creationDate}
                        </span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <Badge variant="secondary" className="truncate">
                            <span className="truncate">🧪 {formula}</span>
                        </Badge>
                        <Badge variant="secondary" className="truncate">
                            <span className="truncate">⚖️ {license}</span>
                        </Badge>
                        <Badge variant="secondary" className="truncate">
                            <span className="truncate">
                                📄 <PidDisplay pid={fileType} />
                            </span>
                        </Badge>
                    </div>

                    <div className="grow" />

                    <div className="flex gap-4 items-center mt-8 justify-end">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="secondary" size="sm">
                                    Show FDO
                                </Button>
                            </DialogTrigger>
                            <DialogContent className={"max-w-[1000px]"}>
                                <ObjectRender data={result} />
                            </DialogContent>
                        </Dialog>
                        <a href={doLocation} target={"_blank"}>
                            <Button size="sm">
                                <ExternalLink className="w-4 h-4 mr-1" /> Open
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
