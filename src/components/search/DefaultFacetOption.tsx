import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { PidNameDisplay } from "@/components/result/PidNameDisplay"
import { FacetValue } from "@elastic/search-ui"
import { FairDOFacetConfig } from "@/lib/config/FairDOConfig"
import { useMemo } from "react"
import { prettyPrintURL } from "@/lib/utils"

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

    const modifiedValue = useMemo(() => {
        if (facetConfig.prettyPrintURLs) {
            return prettyPrintURL(value)
        } else return value
    }, [facetConfig.prettyPrintURLs, value])

    return (
        <div key={value} className="rfs-flex rfs-max-w-full rfs-items-center rfs-gap-2 rfs-break-words rfs-p-1 rfs-pb-2">
            <Checkbox id={value + facetConfig.key} checked={option.selected} onCheckedChange={(v) => (v ? onSelect(value) : onRemove(value))} />
            <Label htmlFor={value + facetConfig.key} className="rfs-min-w-0 rfs-grow rfs-break-words">
                {value ? (
                    facetConfig.usePidResolver ? (
                        <PidNameDisplay pid={value} />
                    ) : (
                        modifiedValue
                    )
                ) : (
                    <span className="rfs-text-muted-foreground">None</span>
                )}
            </Label>
            <div className="rfs-text-xs rfs-text-muted-foreground">{option.count}</div>
        </div>
    )
}
