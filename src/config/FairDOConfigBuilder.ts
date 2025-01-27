import type { FacetConfiguration, FilterValueRange, SearchDriverOptions, SearchFieldConfiguration, SearchQuery } from "@elastic/search-ui"
import type { FairDOConfig, FairDODateRangeFacetConfig, FairDOFacetConfig, FairDONumericRangeFacetConfig } from "./FairDOConfig"
import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector"
import moment from "moment"
import { parseStringValueToNumber } from "./helpers"

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
            initialState: this.getConfig().initialState
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
                acc[n] = {}

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
                acc = acc || {}
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
                    name: n
                })
            } else if (n.startsWith(">")) {
                const fromValue = n.replace(">", "")
                acc.push({
                    from: parseStringValueToNumber(fromValue),
                    name: n
                })
            } else {
                const fromToValue = n.split("-")
                acc.push({
                    from: parseStringValueToNumber(fromToValue[0]),
                    to: parseStringValueToNumber(fromToValue[1]),
                    name: n
                })
            }
            return acc
        }, [])
    }

    buildDateRangeFacet(facetConfig: FairDODateRangeFacetConfig) {
        let ranges: FilterValueRange[] = []
        if (facetConfig.type === "date_year") {
            ranges = [
                {
                    from: moment().format("yyyy"),
                    name: "This Year"
                },
                {
                    from: moment().subtract(2, "years").format("yyyy"),
                    to: moment().subtract(1, "years").format("yyyy"),
                    name: "Last Year"
                },
                {
                    from: moment().subtract(3, "years").format("yyyy"),
                    to: moment().subtract(2, "years").format("yyyy"),
                    name: "2 years ago"
                },
                {
                    from: moment().subtract(4, "years").format("yyyy"),
                    to: moment().subtract(3, "years").format("yyyy"),
                    name: "3 years ago"
                },
                {
                    from: moment().subtract(5, "years").format("yyyy"),
                    to: moment().subtract(4, "years").format("yyyy"),
                    name: "4 years ago"
                },
                {
                    from: moment().subtract(6, "years").format("yyyy"),
                    to: moment().subtract(5, "years").format("yyyy"),
                    name: "5 years ago"
                },
                {
                    from: moment().subtract(10, "years").format("yyyy"),
                    to: moment().subtract(6, "years").format("yyyy"),
                    name: "10 years ago"
                },
                {
                    to: moment().subtract(11, "years").format("yyyy"),
                    name: "Older"
                }
            ]
        } else if (facetConfig.type === "date_time") {
            ranges = [
                {
                    from: moment().month("January").date(1).hour(0).minute(0).second(0).format("YYYY-MM-DDTHH:mm:ss"),
                    to: moment().month("December").date(31).hour(23).minute(59).second(59).format("YYYY-MM-DDTHH:mm:ss"),
                    name: "This Year"
                },
                {
                    from: moment().subtract(1, "years").month("January").date(1).hour(0).minute(0).second(0).format("YYYY-MM-DDTHH:mm:ss"),
                    to: moment().subtract(1, "years").month("December").date(31).hour(23).minute(59).second(59).format("YYYY-MM-DDTHH:mm:ss"),
                    name: "Last Year"
                },
                {
                    from: moment().subtract(2, "years").month("January").date(1).hour(0).minute(0).second(0).format("YYYY-MM-DDTHH:mm:ss"),
                    to: moment().subtract(2, "years").month("December").date(31).hour(23).minute(59).second(59).format("YYYY-MM-DDTHH:mm:ss"),
                    name: "2 years ago"
                },
                {
                    to: moment().subtract(3, "years").month("December").date(31).hour(23).minute(59).second(59).format("YYYY-MM-DDTHH:mm:ss"),
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
