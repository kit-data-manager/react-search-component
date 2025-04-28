import { FieldValue, FilterType, RequestState, SearchFieldConfiguration, SortOption } from "@elastic/search-ui"
import { ReactNode } from "react"

export interface CoreFacetConfig {
    /**
     * The key of the elastic index for this facet.
     * @example
     * // Some examples on how to structure the key:
     * name // normal
     * data.entryName // nested
     * data.entries.name // array access
     *
     */
    key: string

    /**
     * Label to display in the UI
     */
    label: string

    /**
     *
     */
    description?: string

    /**
     * Determines the type of filter
     */
    filterType?: FilterType

    /**
     *
     * @param value
     */
    singleValueMapper?: (value: FieldValue) => ReactNode

    /**
     * Not properly implemented at the moment. Use with caution.
     */
    isFilterable?: boolean

    /**
     * @deprecated Use `singleValueMapper: v => <PidNameDisplay pid={v + ""} />`
     */
    usePidResolver?: boolean

    /**
     * @deprecated Use `singleValueMapper: v => prettyPrintURL(v + "")`
     */
    prettyPrintURLs?: boolean
}

/**
 * Numeric range facet. Pass possible ranges to the ranges property
 */
export interface NumericRangeFacetConfig extends CoreFacetConfig {
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
export interface DateRangeFacetConfig extends CoreFacetConfig {
    type: "date_time" | "date_year" | "date_time_no_millis"
}

export type DefaultFacetConfig = CoreFacetConfig

export type FacetConfig = NumericRangeFacetConfig | DefaultFacetConfig | DateRangeFacetConfig

export interface IndexConfig {
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
    facets: FacetConfig[]
}

/**
 * Configuration for the {@link ReactSearchComponent} component
 */
export interface SearchConfig {
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
    indices: IndexConfig[]
    /**
     * Configure possible sort options. Fields to sort by must be present in all used indices.
     */
    sortOptions?: (SortOption & { label?: string; default?: boolean })[]
    /**
     * Disjunctive facets as specified in the elastic search ui documentation
     * @link https://www.elastic.co/guide/en/search-ui/current/api-react-components-facet.html#api-react-components-facet-example-of-an-or-based-facet-filter
     */
    disjunctiveFacets?: string[]

    /**
     * Specify connection options, like an Authorization header
     * @example
     * connectionOptions: {
     *     headers: {
     *         Authorization: `Bearer ${myToken}`
     *     }
     * }
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
     * Rewrite image source URLs to use proxies for the images. You might want to consider using an image proxy
     * if the images in you dataset are large.
     * @example
     * imageProxy: (src) => `https://myproxy.org/${src}?format=webp`
     */
    imageProxy?: (src: string) => string

    /**
     * Initialize the internal state. This can be useful to specify some default states.
     */
    initialState?: Partial<RequestState>
}
