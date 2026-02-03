import type { FacetConfiguration, SearchDriverOptions, SearchFieldConfiguration, SearchQuery } from "@elastic/search-ui"
import type { SearchConfig, DateRangeFacetConfig, FacetConfig, NumericRangeFacetConfig } from "./SearchConfig"
import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector"
import { DateRangeBuilder } from "@/lib/config/date/DateRangeBuilder"
import { parseStringValueToNumber } from "@/lib/utils"

export class SearchConfigBuilder {
    private readonly config: SearchConfig

    constructor(config: SearchConfig) {
        this.config = config
    }

    getConfig() {
        return this.config
    }

    buildConnector() {
        return new ElasticsearchAPIConnector({
            host: this.getConfig().host,
            index: this.getSearchOptions().index_names.join(","),
            apiKey: this.getConfig().apiKey,
            connectionOptions: this.getConfig().connectionOptions
        })
    }

    buildElasticSearchConfig(): SearchDriverOptions {
        return {
            searchQuery: {
                facets: this.getFacetConfig(),
                ...this.getSearchOptions()
            },
            autocompleteQuery: this.getAutocompleteQueryConfig(),
            apiConnector: this.buildConnector(),
            alwaysSearchOnInitialLoad: true,
            initialState: this.getConfig().initialState,
            debug: this.getConfig().debug
        }
    }

    getFacetFields() {
        const facets: FacetConfig[] = []
        const uniqueKeys: string[] = []
        for (const index of this.getConfig().indices) {
            for (const facet of index.facets) {
                // check for potential duplicates
                if (!uniqueKeys.includes(facet.key)) {
                    facets.push(facet)
                    uniqueKeys.push(facet.key)
                } else {
                    console.warn(
                        `[react-search-component] Facet "${facet.key}" is defined in multiple indices. The definition in index "${index.name}" has no effect. Only the first definition will be used for all indices.`
                    )
                }
            }
        }

        return facets
    }

    getSearchOptions(): SearchQuery & { index_names: string[] } {
        const config = this.getConfig()
        const index_names: string[] = []
        let allSearchFields: Record<string, SearchFieldConfiguration> = {}
        let allResultFields: Record<string, { raw: Record<never, never> }> = {}

        for (const index of config.indices) {
            index_names.push(index.name)

            allSearchFields = (index.searchFields || []).reduce((acc, n) => {
                if (typeof n === "string") {
                    acc[n] = {}
                } else {
                    acc[n.field] = n
                }

                return acc
            }, allSearchFields)

            allResultFields = (index.resultFields || []).reduce((acc, n) => {
                acc = acc || {}
                acc[n] = {
                    raw: {}
                }
                return acc
            }, allResultFields)
        }

        return {
            index_names,
            search_fields: allSearchFields,
            result_fields: allResultFields,
            disjunctiveFacets: this.getConfig().disjunctiveFacets
        }
    }

    getFacetConfig() {
        const config = this.getConfig()
        let allFacets: Record<string, FacetConfiguration> = {}
        for (const index of config.indices) {
            allFacets = (index.facets || []).reduce((acc, n) => {
                if ("type" in n && n.type === "numeric") {
                    const facetRanges = this.buildNumericRangeFacet(n)
                    acc[n.key] = {
                        ...n,
                        type: "range",
                        ranges: facetRanges
                    }
                } else if ("type" in n && (n.type === "date_time" || n.type === "date_year" || n.type === "date_time_no_millis")) {
                    const facetRanges = this.buildDateRangeFacet(n)
                    acc[n.key] = {
                        ...n,
                        type: "range",
                        ranges: facetRanges
                    }
                } else {
                    // no specific range facet, use default arguments
                    acc[n.key] = {
                        ...n,
                        type: "value",
                        size: 100
                    }
                }
                return acc
            }, allFacets)
        }

        return allFacets
    }

    buildNumericRangeFacet(facetConfig: NumericRangeFacetConfig) {
        const ranges = facetConfig.ranges
        // ranges are an array which each element in the format <X or X-Y or >Y
        return ranges?.reduce((acc: { to?: number; from?: number; name: string }[], n) => {
            if (n.startsWith("<")) {
                const toValue = n.replace("<", "")
                acc.push({
                    to: parseStringValueToNumber(toValue),
                    name: n.replace("<", "< ")
                })
            } else if (n.startsWith(">")) {
                const fromValue = n.replace(">", "")
                acc.push({
                    from: parseStringValueToNumber(fromValue),
                    name: n.replace(">", "> ")
                })
            } else {
                const fromToValue = n.split("-")
                acc.push({
                    from: parseStringValueToNumber(fromToValue[0]),
                    to: parseStringValueToNumber(fromToValue[1]),
                    name: n.replace("-", " - ")
                })
            }
            return acc
        }, [])
    }

    buildDateRangeFacet(facetConfig: DateRangeFacetConfig) {
        if (facetConfig.type === "date_year") {
            return DateRangeBuilder.dateYears()
        } else if (facetConfig.type === "date_time") {
            return DateRangeBuilder.dateTimes()
        } else if (facetConfig.type === "date_time_no_millis") {
            return DateRangeBuilder.dateTimesNoMillis()
        }
    }

    getAutocompleteQueryConfig() {
        // Currently not supported
        return {}
    }
}
