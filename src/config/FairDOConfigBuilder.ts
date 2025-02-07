import type { FacetConfiguration, FilterValueRange, SearchDriverOptions, SearchFieldConfiguration, SearchQuery } from "@elastic/search-ui"
import type { FairDOConfig, FairDODateRangeFacetConfig, FairDOFacetConfig, FairDONumericRangeFacetConfig } from "./FairDOConfig"
import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector"
import { parseStringValueToNumber } from "./helpers"
import { DateTime, Duration } from "luxon"

export class FairDOConfigBuilder {
    private readonly config: FairDOConfig

    constructor(config: FairDOConfig) {
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
        const facets: FairDOFacetConfig[] = []
        const uniqueKeys: string[] = []
        for (const index of this.getConfig().indices) {
            for (const facet of index.facets) {
                // check for potential duplicates
                if (!uniqueKeys.includes(facet.key)) {
                    facets.push(facet)
                    uniqueKeys.push(facet.key)
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

            // build result fields for current index
            allResultFields = (index.resultFields || []).reduce(
                // accumulate from index.resultFields
                (acc, n) => {
                    // initialize accumulator if acc is not available, yet
                    acc = acc || {}
                    // set n-element (n is resultFieldKey) in acc to result object to obtain raw value
                    acc[n] = {
                        raw: {}
                        /* snippet: {
                  size: 100,
                  fallback: true
                } */
                    }
                    // return current acc to next iteration
                    return acc
                },
                // set initial value to already collected fields
                allResultFields
            )
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
                } else if ("type" in n && (n.type === "date_time" || n.type === "date_year")) {
                    const facetRanges = this.buildDateRangeFacet(n)
                    acc[n.key] = {
                        ...n,
                        type: "range",
                        ranges: facetRanges
                    }
                } else if ("type" in n && n.type === "min-max-slider") {
                    // TODO work out how to get slider min and max values
                    acc[n.key] = {
                        ...n,
                        type: "value",
                        size: 100
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

    buildNumericRangeFacet(facetConfig: FairDONumericRangeFacetConfig) {
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

    buildDateRangeFacet(facetConfig: FairDODateRangeFacetConfig) {
        let ranges: FilterValueRange[] = []
        const getDate = (minus: number) =>
            DateTime.now()
                .minus(Duration.fromObject({ years: minus }))
                .toFormat("yyyy")

        if (facetConfig.type === "date_year") {
            ranges = [
                {
                    from: DateTime.now().toFormat("yyyy"),
                    name: "This Year"
                },
                {
                    from: getDate(2),
                    to: getDate(1),
                    name: "Last Year"
                },
                {
                    from: getDate(3),
                    to: getDate(2),
                    name: "2 years ago"
                },
                {
                    from: getDate(4),
                    to: getDate(3),
                    name: "3 years ago"
                },
                {
                    from: getDate(5),
                    to: getDate(4),
                    name: "4 years ago"
                },
                {
                    from: getDate(6),
                    to: getDate(5),
                    name: "5 years ago"
                },
                {
                    from: getDate(10),
                    to: getDate(6),
                    name: "10 years ago"
                },
                {
                    to: getDate(11),
                    name: "Older"
                }
            ]
        } else if (facetConfig.type === "date_time") {
            ranges = [
                {
                    from: DateTime.now().startOf("year").toFormat("YYYY-MM-DDTHH:mm:ss"),
                    to: DateTime.now().endOf("year").toFormat("YYYY-MM-DDTHH:mm:ss"),
                    name: "This Year"
                },
                {
                    from: DateTime.now()
                        .minus(Duration.fromObject({ years: 1 }))
                        .startOf("year")
                        .toFormat("YYYY-MM-DDTHH:mm:ss"),
                    to: DateTime.now()
                        .minus(Duration.fromObject({ years: 1 }))
                        .endOf("year")
                        .toFormat("YYYY-MM-DDTHH:mm:ss"),
                    name: "Last Year"
                },
                {
                    from: DateTime.now()
                        .minus(Duration.fromObject({ years: 2 }))
                        .startOf("year")
                        .toFormat("YYYY-MM-DDTHH:mm:ss"),
                    to: DateTime.now()
                        .minus(Duration.fromObject({ years: 2 }))
                        .endOf("year")
                        .toFormat("YYYY-MM-DDTHH:mm:ss"),
                    name: "2 years ago"
                },
                {
                    to: DateTime.now()
                        .minus(Duration.fromObject({ years: 3 }))
                        .endOf("year")
                        .toFormat("YYYY-MM-DDTHH:mm:ss"),
                    name: "Older"
                }
            ]
        }

        return ranges
    }

    getAutocompleteQueryConfig() {
        /* const querySuggestFields = getConfig().querySuggestFields
        if (
            !querySuggestFields ||
            !Array.isArray(querySuggestFields) ||
            querySuggestFields.length === 0
        ) {
            return {}
        }

        return {
            suggestions: {
                types: {
                    documents: {
                        fields: getConfig().querySuggestFields
                    }
                }
            }
        } */
        return {}
    }
}
