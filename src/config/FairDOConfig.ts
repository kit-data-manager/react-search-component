export interface FairDONumericRangeFacetConfig {
    key: string
    label: string
    renderer: string
    type: "numeric"
    ranges: string[]
    isFilterable?: boolean
}

export interface FairDODateRangeFacetConfig {
    key: string
    label: string
    renderer: string
    type: "date_time" | "date_year"
    isFilterable?: boolean
}

export interface FairDODefaultFacetConfig {
    key: string
    label: string
    isFilterable?: boolean
}

export type FairDOFacetConfig =
    | FairDONumericRangeFacetConfig
    | FairDODefaultFacetConfig
    | FairDODateRangeFacetConfig

type ExtensibleField<A extends object> =
    | string
    | ({ field: string; valueMapper?: (fieldValue: unknown) => string } & A)

export interface FairDOFieldMappingConfig {
    title?: ExtensibleField<{ label: string }>
    imageUrl?: ExtensibleField<Record<never, never>>
    bodyText?: ExtensibleField<{ label: string }>
}

export interface FairDOIndexConfig {
    name: string
    searchFields: string[]
    resultFields: string[]
    facets: FairDOFacetConfig[]
    fieldMappings: FairDOFieldMappingConfig
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
