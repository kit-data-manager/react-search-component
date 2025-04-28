import { MouseEvent, ReactNode, useCallback, useEffect, useMemo, useState } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { SearchResult, FieldValue } from "@elastic/search-ui"
import { useCopyToClipboard } from "usehooks-ts"
import { CheckIcon } from "lucide-react"
import { autoUnwrap } from "@/lib/utils"

export interface GenericResultViewTagProps {
    /**
     * The elasticsearch field that this tag will display
     */
    field: string
    /**
     * When specified, does not read the field from elastic and instead just displays this value
     */
    valueOverride?: string | number | boolean
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
    valueMapper?: (value: FieldValue) => ReactNode
    /**
     * Optional, here you can map each value of the elasticsearch field to a string or a React component. Can't be used
     * together with `valueMapper`
     * @param value
     */
    singleValueMapper?: (value: string | number | boolean) => ReactNode
    onClick?: (e: MouseEvent<HTMLDivElement>, tagValue: ReactNode, fieldValue: FieldValue) => void
    clickBehavior?: "copy-text" | "follow-url" | string
}

export function GenericResultViewTag(props: GenericResultViewTagProps) {
    const { field, valueOverride, result, icon, label, valueMapper, singleValueMapper, clickBehavior = "copy-text", onClick } = props

    const [showCopiedNotice, setShowCopiedNotice] = useState(false)

    useEffect(() => {
        if (showCopiedNotice) {
            setTimeout(() => {
                setShowCopiedNotice(false)
            }, 1000)
        }
    }, [showCopiedNotice])

    const fieldValue = useMemo(() => {
        if (valueOverride !== undefined) return valueOverride
        return autoUnwrap(result[field]) as FieldValue
    }, [field, result, valueOverride])

    const value = useMemo(() => {
        if (fieldValue === null || fieldValue === undefined) return undefined
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
        (fieldValue: FieldValue, value: ReactNode, e: MouseEvent<HTMLDivElement>) => {
            if (onClick) onClick(e, value, fieldValue)
            if (clickBehavior === "copy-text" && !showCopiedNotice) {
                copyTagValue(e)
                setShowCopiedNotice(true)
            } else if (clickBehavior === "follow-url" && !Array.isArray(fieldValue)) {
                window.open(fieldValue.toString(), "_blank")
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
        (fieldValue: FieldValue, value: ReactNode, key?: string) => {
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

    if (value === undefined) return null

    if (Array.isArray(value) && Array.isArray(fieldValue)) {
        return value.map((entry, i) => <GenericResultViewTag {...props} key={field + i} valueOverride={fieldValue[value.indexOf(entry)]} />)
    } else if (!label) {
        return base(fieldValue, value)
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
