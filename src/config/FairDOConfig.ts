export interface FairDOCoreFacetConfig {
    key: string
    label: string
    isFilterable?: boolean
    usePidResolver?: boolean
}

export interface FairDONumericRangeFacetConfig extends FairDOCoreFacetConfig {
    renderer: string
    type: "numeric"
    ranges: string[]
}

export interface FairDODateRangeFacetConfig extends FairDOCoreFacetConfig {
    renderer: string
    type: "date_time" | "date_year"
}

export type FairDODefaultFacetConfig = FairDOCoreFacetConfig

export type FairDOFacetConfig = FairDONumericRangeFacetConfig | FairDODefaultFacetConfig | FairDODateRangeFacetConfig

export interface FairDOIndexConfig {
    /**
     * Name of the index in Elasticsearch
     */
    name: string
    /**
     * Fields that support searching
     */
    searchFields: string[]
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
     * Unused
     */
    logo: string
    /**
     * Unused
     */
    title: string
    /**
     * Enables debug features. Should be disabled in production
     */
    debug: boolean
    /**
     * Directly issue a search query to the elastic endpoint when the component is loaded
     */
    alwaysSearchOnInitialLoad?: boolean
    /**
     * Elasticsearch endpoint
     */
    host: string
    /**
     * @deprecated Only for testing! Using this in production will leak your API key
     */
    apiKey: string
    /**
     * Configuration for the elastic indices that should be accessed
     */
    indices: FairDOIndexConfig[]
    /**
     * Disjunctive facets as specified in the elastic search ui documentation
     * @link https://www.elastic.co/guide/en/search-ui/current/api-react-components-facet.html#api-react-components-facet-example-of-an-or-based-facet-filter
     */
    disjunctiveFacets: string[]

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
}
