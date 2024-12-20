import { ComponentType } from "react"

export interface FairDOCoreFacetConfig {
    key: string
    label: string
    isFilterable?: boolean
    optionsTextDisplay?: ComponentType<{ text: string }>
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

    // Remove?
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
