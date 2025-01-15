import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { PidDisplay } from "@/components/result/PidDisplay"
import { FacetValue } from "@elastic/search-ui"
import { FairDOFacetConfig } from "@/config/FairDOConfig"
import { useEffect, useMemo } from "react"
import { ontobeeResolver } from "@/lib/OntobeeResolver"

export function DefaultFacetOption({
    option,
    facetConfig,
    onSelect,
    onRemove
}: {
    option: FacetValue
    facetConfig: FairDOFacetConfig
    onSelect(v: string): void
    onRemove(v: string): void
}) {
    const value = useMemo(() => {
        return option.value.toString()
    }, [option.value])

    useEffect(() => {
        if (value.startsWith("http://purl.obolibrary.org")) {
            ontobeeResolver.parse(value)
        }
    }, [value])

    return (
        <div key={value} className="flex max-w-full items-center gap-2 break-words p-1 pb-2">
            <Checkbox id={value} checked={option.selected} onCheckedChange={(v) => (v ? onSelect(value) : onRemove(value))} />
            <Label htmlFor={value} className="min-w-0 grow break-words">
                {value ? facetConfig.usePidResolver ? <PidDisplay pid={value} /> : value : <span className="text-muted-foreground">None</span>}
            </Label>
            <div className="text-xs text-muted-foreground">{option.count}</div>
        </div>
    )
}
