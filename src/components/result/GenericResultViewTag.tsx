import { ReactNode, useCallback, useMemo } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { SearchResult } from "@elastic/search-ui"
import { autoUnwrap } from "@/components/result/utils"

export interface GenericResultViewTagProps {
    field: string
    result: SearchResult
    icon?: ReactNode
    label?: string
    valueMapper?: (value: string | string[]) => string | ReactNode
}

export function GenericResultViewTag({ field, result, icon, label, valueMapper }: GenericResultViewTagProps) {
    const value = useMemo(() => {
        const value = autoUnwrap(result[field])
        if (!value) return undefined
        if (valueMapper) return valueMapper(value)
        else return value
    }, [field, result, valueMapper])

    const base = useCallback(
        (value: string) => {
            return (
                <Badge variant="secondary" className="rfs-truncate">
                    <span className="rfs-flex rfs-truncate">
                        {icon} {value}
                    </span>
                </Badge>
            )
        },
        [icon]
    )

    if (!label) return base(value)
    if (!value) return null

    if (Array.isArray(value)) {
        return value.map((entry, i) => (
            <Tooltip delayDuration={500} key={i}>
                <TooltipTrigger>{base(entry)}</TooltipTrigger>
                <TooltipContent>{label}</TooltipContent>
            </Tooltip>
        ))
    }

    return (
        <Tooltip delayDuration={500}>
            <TooltipTrigger>{base(value)}</TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
        </Tooltip>
    )
}
