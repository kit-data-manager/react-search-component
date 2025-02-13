import { MouseEvent, ReactNode, useCallback, useEffect, useMemo, useState } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { SearchResult } from "@elastic/search-ui"
import { autoUnwrap } from "@/components/result/utils"
import { useCopyToClipboard } from "usehooks-ts"
import { CheckIcon } from "lucide-react"

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
    onClick?: (e: MouseEvent<HTMLDivElement>, tagValue: ReactNode, fieldValue: string | string[]) => void
    clickBehavior?: "copy-text" | "follow-url" | string
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
    const [showCopiedNotice, setShowCopiedNotice] = useState(false)

    useEffect(() => {
        if (showCopiedNotice) {
            setTimeout(() => {
                setShowCopiedNotice(false)
            }, 1000)
        }
    }, [showCopiedNotice])

    const fieldValue = useMemo(() => {
        return autoUnwrap(result[field]) as string | string[]
    }, [field, result])

    const value = useMemo(() => {
        if (!fieldValue) return undefined
        if (valueMapper) return valueMapper(fieldValue)
        if (singleValueMapper) return Array.isArray(fieldValue) ? fieldValue.map(singleValueMapper) : singleValueMapper(fieldValue)
        else return fieldValue
    }, [fieldValue, singleValueMapper, valueMapper])

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
        (fieldValue: string | string[], value: ReactNode, e: MouseEvent<HTMLDivElement>) => {
            if (onClick) onClick(e, value, fieldValue)
            if (clickBehavior === "copy-text" && !showCopiedNotice) {
                copyTagValue(e)
                setShowCopiedNotice(true)
            } else if (clickBehavior === "follow-url" && !Array.isArray(fieldValue)) {
                window.open(fieldValue, "_blank")
            }
        },
        [clickBehavior, copyTagValue, onClick, showCopiedNotice]
    )

    const clickBehaviourText = useMemo(() => {
        if (onClick) return null // We don't know what will happen on click...
        if (clickBehavior === "copy-text") {
            return "Click to copy"
        } else if (clickBehavior === "follow-url") {
            return "Click to open"
        } else return null
    }, [clickBehavior, onClick])

    const base = useCallback(
        (fieldValue: string | string[], value: ReactNode, key?: string) => {
            return (
                <Badge key={key} variant="secondary" className="rfs-truncate" onClick={(e) => handleClick(fieldValue, value, e)}>
                    <span className="rfs-flex rfs-truncate">
                        {showCopiedNotice ? (
                            <>
                                <CheckIcon className="rfs-size-4 rfs-mr-2" /> <span>Copied</span>
                            </>
                        ) : (
                            <>
                                {icon} {value}
                            </>
                        )}
                    </span>
                </Badge>
            )
        },
        [handleClick, icon, showCopiedNotice]
    )

    if (!label) return Array.isArray(value) ? value.map((v, i) => base(fieldValue[value.indexOf(v)], v, field + i)) : base(fieldValue, value)
    if (!value) return null

    if (Array.isArray(value)) {
        return value.map((entry, i) => (
            <Tooltip delayDuration={500} key={field + i}>
                <TooltipTrigger>{base(fieldValue[value.indexOf(entry)], entry)}</TooltipTrigger>
                <TooltipContent>
                    <div>{label}</div>
                    <div className="rfs-text-xs rfs-text-muted-foreground">{clickBehaviourText}</div>
                </TooltipContent>
            </Tooltip>
        ))
    }

    return (
        <Tooltip delayDuration={500}>
            <TooltipTrigger>{base(fieldValue, value)}</TooltipTrigger>
            <TooltipContent>
                <div>{label}</div>
                <div className="rfs-text-xs rfs-text-muted-foreground">{clickBehaviourText}</div>
            </TooltipContent>
        </Tooltip>
    )
}
