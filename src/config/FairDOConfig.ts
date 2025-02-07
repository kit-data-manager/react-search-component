import { FilterType, RequestState, SearchFieldConfiguration } from "@elastic/search-ui"

export interface FairDOCoreFacetConfig {
    key: string
    label: string
    description?: string
    filterType?: FilterType
    /**
     * Not properly implemented at the moment
     */
    isFilterable?: boolean
    usePidResolver?: boolean
    prettyPrintURLs?: boolean
}

/**
 * Numeric range facet. Pass possible ranges to the ranges property
 */
export interface FairDONumericRangeFacetConfig extends FairDOCoreFacetConfig {
    type: "numeric"

    /**
     * Possible ranges to select in this facet
     * @example ["0-10", "11-50", "51-200"]
     */
    ranges: string[]
}

/**
 * Date range facet that automatically renders available options
 */
export interface FairDODateRangeFacetConfig extends FairDOCoreFacetConfig {
    type: "date_time" | "date_year"
}

export interface FairDOSliderFacetConfig extends FairDOCoreFacetConfig {
    type: "min-max-slider"
}

export type FairDODefaultFacetConfig = FairDOCoreFacetConfig

export type FairDOFacetConfig = FairDONumericRangeFacetConfig | FairDODefaultFacetConfig | FairDODateRangeFacetConfig | FairDOSliderFacetConfig

export interface FairDOIndexConfig {
    /**
     * Name of the index in Elasticsearch
     */
    name: string
    /**
     * Fields that support searching
     */
    searchFields: (string | ({ field: string } & SearchFieldConfiguration))[]
    /**
     * Fields that should be included in the results for a search query
     */
    resultFields: string[]
    /**
     * Facets for this index
     */
    facets: FairDOFacetConfig[]
}

/**
 * Configuration for the {@link FairDOElasticSearch} component
 */
export interface FairDOConfig {
    /**
     * Enables debug features. Should be disabled in production
     */
    debug?: boolean
    /**
     * Directly issue a search query to the elastic endpoint when the component is loaded
     */
    alwaysSearchOnInitialLoad?: boolean
    /**
     * Elasticsearch endpoint
     */
    host: string
    /**
     * Authenticate against the elasticsearch backend using an API Key. Using this in a browser environment will leak this API key to all users!
     */
    apiKey?: string
    /**
     * Configuration for the elastic indices that should be accessed
     */
    indices: FairDOIndexConfig[]
    /**
     * Disjunctive facets as specified in the elastic search ui documentation
     * @link https://www.elastic.co/guide/en/search-ui/current/api-react-components-facet.html#api-react-components-facet-example-of-an-or-based-facet-filter
     */
    disjunctiveFacets?: string[]

    /**
     * Specify connection options, like an Authorization header
     */
    connectionOptions?: {
        /**
         * Specify headers to append to the requests to elastic
         * @example
         * headers: {
         *     Authorization: `Bearer ${myToken}`
         * }
         */
        headers?: Record<string, string>
    }

    /**
     * Initialize the internal state. This can be useful to specify the default sorting of the results.
     * @example
     * initialState: {
     *         sortList: [
     *             {
     *                 field: "_score",
     *                 direction: "desc"
     *             },
     *             {
     *                 field: "name.keyword",
     *                 direction: "asc"
     *             }
     *         ]
     *     },
     */
    initialState?: Partial<RequestState>
}
