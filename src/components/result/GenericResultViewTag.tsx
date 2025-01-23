import { ReactNode, useMemo } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { SearchResult } from "@elastic/search-ui"
import { autoUnwrap } from "@/components/result/utils"

export interface GenericResultViewTagProps {
    field: string
    result: SearchResult
    icon?: ReactNode
    label?: string
    valueMapper?: (value: string) => string
}

export function GenericResultViewTag({ field, result, icon, label, valueMapper }: GenericResultViewTagProps) {
    const value = useMemo(() => {
        const value = autoUnwrap(result[field])
        if (valueMapper) return valueMapper(value)
        else return value
    }, [field, result, valueMapper])

    const base = useMemo(() => {
        return (
            <Badge variant="secondary" className="rfs-truncate">
                <span className="rfs-flex rfs-truncate">
                    {icon} {value}
                </span>
            </Badge>
        )
    }, [icon, value])

    if (!label) return base

    return (
        <Tooltip delayDuration={500}>
            <TooltipTrigger>{base}</TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
        </Tooltip>
    )
}
