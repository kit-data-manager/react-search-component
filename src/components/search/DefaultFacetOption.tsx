import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { PidNameDisplay } from "@/components/result/PidNameDisplay"
import { FacetValue } from "@elastic/search-ui"
import { FacetConfig } from "@/lib/config/SearchConfig"
import { useMemo } from "react"
import { filterValueToString, prettyPrintURL } from "@/lib/utils"

export function DefaultFacetOption({
    option,
    facetConfig,
    onSelect,
    onRemove
}: {
    option: FacetValue
    facetConfig: FacetConfig
    onSelect(v: string): void
    onRemove(v: string): void
}) {
    const value = useMemo(() => {
        return filterValueToString(option.value)
    }, [option.value])

    const parsedValue = useMemo(() => {
        if (facetConfig.singleValueMapper) {
            return facetConfig.singleValueMapper(value)
        } else if (value && facetConfig.prettyPrintURLs) {
            console.warn("[react-search-component] Used deprecated facet config `prettyPrintURLs`")
            return prettyPrintURL(value)
        } else if (value && facetConfig.usePidResolver) {
            console.warn("[react-search-component] Used deprecated facet config `usePidResolver`")
            return <PidNameDisplay pid={value} />
        } else return value
    }, [facetConfig, value])

    return (
        <div key={value} className="rfs:flex rfs:max-w-full rfs:items-center rfs:gap-2 rfs:wrap-break-word rfs:p-1 rfs:pb-2">
            <Checkbox id={value + facetConfig.key} checked={option.selected} onCheckedChange={(v) => (v ? onSelect(value) : onRemove(value))} />
            <Label htmlFor={value + facetConfig.key} className="rfs:min-w-0 rfs:grow rfs:wrap-break-word">
                {parsedValue || <span className="rfs:text-muted-foreground">None</span>}
            </Label>
            <div className="rfs:text-xs rfs:text-muted-foreground">{option.count}</div>
        </div>
    )
}
