import { SearchResult } from "@elastic/search-ui"
import { useMemo } from "react"
import { FairDOConfigProvider } from "@/config/FairDOConfigProvider.ts"
import { DataCard } from "data-card-react"

function autoUnwrap(item: string | { raw: string }) {
    if (typeof item === "string") return item
    else return item.raw
}

/**
 * @deprecated Unused
 * @param result
 * @param config
 * @constructor
 */
export function ResultView({
    result,
    config
}: {
    result: SearchResult
    config: FairDOConfigProvider
}) {
    const index = useMemo(() => {
        return result._meta.rawHit._index as string
    }, [result._meta.rawHit._index])

    const indexConfig = useMemo(() => {
        return config.getFieldMappings(index)
    }, [config, index])

    const titleValue = useMemo(() => {
        if (!indexConfig) return `No mapper configured for index ${index}`

        if (typeof indexConfig.title === "string") {
            return autoUnwrap(result[indexConfig.title])
        } else if (indexConfig.title) {
            let value = autoUnwrap(result[indexConfig.title.field])
            if (indexConfig.title.valueMapper) value = indexConfig.title.valueMapper(value)

            return indexConfig.title.label
                ? {
                      value,
                      label: indexConfig.title.label
                  }
                : value
        }
    }, [index, indexConfig, result])

    return <DataCard dataTitle={titleValue} />
}
