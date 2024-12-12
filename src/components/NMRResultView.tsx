import { SearchResult } from "@elastic/search-ui"
import { useCallback, useMemo } from "react"
import { nmrFields } from "@/lib/nmrFields.ts"
import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx"
import { ObjectRender } from "@/components/ObjectRender.tsx"
import { Download } from "lucide-react"
import { DateTime } from "luxon"

function autoUnwrap(item: string | { raw: string }) {
    if (typeof item === "string") return item
    else return item.raw
}

export function NMRResultView({ result }: { result: SearchResult }) {
    const getField = useCallback(
        (field: string) => {
            return autoUnwrap(result[field])
        },
        [result]
    )

    const title = useMemo(() => {
        return getField(nmrFields.name)
    }, [getField])

    const identifier = useMemo(() => {
        return getField(nmrFields.identifier)
    }, [getField])

    const formula = useMemo(() => {
        return getField(nmrFields.ChemicalFormula)
    }, [getField])

    const license = useMemo(() => {
        return getField(nmrFields.licenseURL)
    }, [getField])

    const fileType = useMemo(() => {
        return getField(nmrFields.genericObjectType)
    }, [getField])

    const medicalImageModality = useMemo(() => {
        return getField(nmrFields.MedicalImageModality)
    }, [getField])

    const doLocation = useMemo(() => {
        return getField(nmrFields.digitalObjectLocation)
    }, [getField])

    const creationDate = useMemo(() => {
        const value = getField(nmrFields.dateCreatedRfc3339)
        return DateTime.fromISO(value).toLocaleString()
    }, [getField])

    return (
        <div className="m-2 p-4 border border-border rounded-lg">
            <div className="text-xl font-bold">
                {title}
                <span className="ml-2 font-normal  text-sm text-muted-foreground">
                    {identifier} - {creationDate}
                </span>
            </div>
            <div className="flex gap-2">
                <Badge variant="secondary">🧪 {formula}</Badge>
                <Badge variant="secondary">⚖️ {license}</Badge>
                <Badge variant="secondary">📄 {fileType}</Badge>
            </div>

            <div className="mt-4">{medicalImageModality}</div>

            <div className="flex gap-4 items-center mt-8 justify-end">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="secondary" size="sm">
                            Details anzeigen
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[1000px]">
                        <ObjectRender data={result} />
                    </PopoverContent>
                </Popover>
                <a href={doLocation} target={"_blank"}>
                    <Button size="sm">
                        <Download className="w-4 h-4 mr-1" /> Herunterladen
                    </Button>
                </a>
            </div>
        </div>
    )
}
