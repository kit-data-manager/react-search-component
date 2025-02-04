import { MouseEvent, ReactNode, useCallback, useMemo } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { SearchResult } from "@elastic/search-ui"
import { autoUnwrap } from "@/components/result/utils"
import { useCopyToClipboard } from "usehooks-ts"

export interface GenericResultViewTagProps {
    /**
     * The elasticsearch field that this tag will display
     */
    field: string
    result: SearchResult
    /**
     * Icon for this tag, can be any react component. Ideally a [lucide icon](https://lucide.dev) with 16px by 16px site.
     */
    icon?: ReactNode
    /**
     * Label to display in a tooltip
     */
    label?: string
    /**
     * Optional, here you can map each value or all values of the elasticsearch field to a string or a React component.
     * Can't the used together with `singleValueMapper`
     * @param value
     */
    valueMapper?: (value: string | string[]) => ReactNode
    /**
     * Optional, here you can map each value of the elasticsearch field to a string or a React component. Can't be used
     * together with `valueMapper`
     * @param value
     */
    singleValueMapper?: (value: string) => ReactNode
    onClick?: (e: MouseEvent<HTMLDivElement>, tagValue: ReactNode) => void
    clickBehavior?: "copy-text"
}

export function GenericResultViewTag({
    field,
    result,
    icon,
    label,
    valueMapper,
    singleValueMapper,
    clickBehavior = "copy-text",
    onClick
}: GenericResultViewTagProps) {
    const value = useMemo(() => {
        const value: string | string[] = autoUnwrap(result[field])
        if (!value) return undefined
        if (valueMapper) return valueMapper(value)
        if (singleValueMapper) return Array.isArray(value) ? value.map(singleValueMapper) : singleValueMapper(value)
        else return value
    }, [field, result, singleValueMapper, valueMapper])

    const [, copy] = useCopyToClipboard()

    const copyTagValue = useCallback(
        (e: MouseEvent<HTMLDivElement>) => {
            if ("innerText" in e.target && typeof e.target.innerText === "string") {
                copy(e.target.innerText).then()
            } else console.warn("Failed to copy innerText of", e.target)
        },
        [copy]
    )

    const handleClick = useCallback(
        (value: ReactNode, e: MouseEvent<HTMLDivElement>) => {
            if (onClick) onClick(e, value)
            if (clickBehavior === "copy-text") {
                copyTagValue(e)
            }
        },
        [clickBehavior, copyTagValue, onClick]
    )

    const base = useCallback(
        (value: ReactNode) => {
            return (
                <Badge variant="secondary" className="rfs-truncate" onClick={(e) => handleClick(value, e)}>
                    <span className="rfs-flex rfs-truncate">
                        {icon} {value}
                    </span>
                </Badge>
            )
        },
        [handleClick, icon]
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
