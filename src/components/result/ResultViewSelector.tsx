import { ResultViewProps } from "@elastic/react-search-ui-views"
import { ComponentType, useMemo } from "react"
import { PlaceholderResultView } from "@/components/result/PlaceholderResultView"
import { z } from "zod"

interface ResultViewSelectorProps {
    resultView?: ComponentType<ResultViewProps>
    resultViewPerIndex?: Record<string, ComponentType<ResultViewProps>>
    resultProps: ResultViewProps
}

const resultWithMeta = z.object({
    _meta: z.object({
        rawHit: z.object({
            _index: z.string()
        })
    })
})

export function ResultViewSelector({ resultProps, resultView, resultViewPerIndex }: ResultViewSelectorProps) {
    const fallbackResultView: ComponentType<ResultViewProps> = useMemo(() => {
        return resultView ?? ((props: ResultViewProps) => <PlaceholderResultView {...props} />)
    }, [resultView])

    const index = useMemo(() => {
        try {
            const parsed = resultWithMeta.parse(resultProps.result)
            return parsed._meta.rawHit._index
        } catch (e) {
            console.error("Could not determine result source index in ResultViewSelector", e)
            return null
        }
    }, [resultProps.result])

    const specificResultView = useMemo(() => {
        if (index === null) return null
        if (resultViewPerIndex && index in resultViewPerIndex) {
            return resultViewPerIndex[index]
        } else return null
    }, [index, resultViewPerIndex])

    const Selected = useMemo(() => {
        return specificResultView ?? fallbackResultView
    }, [fallbackResultView, specificResultView])

    return <Selected {...resultProps} />
}
