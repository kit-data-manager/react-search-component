export interface FairDONumericRangeFacetConfig {
    key: string
    label: string
    renderer: string
    type: "numeric"
    ranges: string[]
}

export interface FairDODateRangeFacetConfig {
    key: string
    label: string
    renderer: string
    type: "date_time" | "date_year"
}

export interface FairDODefaultFacetConfig {
    key: string
    label: string
}

export type FairDOFacetConfig =
    | FairDONumericRangeFacetConfig
    | FairDODefaultFacetConfig
    | FairDODateRangeFacetConfig

export interface FairDOIndexConfig {
    name: string
    searchFields: string[]
    resultFields: string[]
    facets: FairDOFacetConfig[]
}

export interface FairDOConfig {
    logo: string
    title: string
    debug: boolean
    alwaysSearchOnInitialLoad?: boolean
    host: string
    indices: FairDOIndexConfig[]
    disjunctiveFacets: string[]
}
