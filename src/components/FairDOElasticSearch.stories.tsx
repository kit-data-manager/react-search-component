import type { FairDOConfig } from "@/config/FairDOConfig"

import type { Meta, StoryObj } from "@storybook/react"
import { FairDOElasticSearch } from "./FairDOElasticSearch"

const meta = {
    component: FairDOElasticSearch
} satisfies Meta<typeof FairDOElasticSearch>

export default meta

type Story = StoryObj<typeof meta>

// const localConfig: FairDOConfig = {
//     logo: "/images/nfdi-logo.png",
//     title: "NFDI4MatWerk Metadata Search",
//     debug: false,
//     alwaysSearchOnInitialLoad: true,
//     //host: "https://matwerk.datamanager.kit.edu/search-proxy/api/v1",
//     host: "http://localhost:9200",
//     indices: [
//         {
//             name: "fairdo",
//             facets: [
//                 {
//                     key: nmrFields.ChemicalFormula,
//                     label: "Chemical Formula"
//                 },
//                 {
//                     key: nmrFields.genericObjectType,
//                     label: "Data Type"
//                 },
//                 {
//                     key: nmrFields.dateCreatedRfc3339,
//                     label: "Created",
//                     type: "date_year"
//                 },
//                 {
//                     key: nmrFields.dateModified,
//                     label: "Last Modified",
//                     type: "date_year"
//                 },
//                 {
//                     key: nmrFields.licenseURL,
//                     label: "License"
//                 }
//             ],
//             resultFields: ["id", "pid", ...Object.values(nmrFields)], // Leave empty to get all fields
//             searchFields: [],
//             fieldMappings: {}
//         }
//     ],
//     disjunctiveFacets: []
// }
//
// const localFairConfig = new FairDOConfigProvider(localConfig)
//
// export const LocalElastic: Story = {
//     args: {
//         config: localFairConfig,
//         debug: false
//     }
// }

const demoConfig: FairDOConfig = {
    logo: "",
    title: "NEP",
    debug: false,
    alwaysSearchOnInitialLoad: true,
    // host: "https://matwerk.datamanager.kit.edu/search-proxy/api/v1",
    host: "https://ddaa9283-f114-4496-b6ed-af12ee34b107.ka.bw-cloud-instance.org:9200",
    apiKey: "VG9NNFNwUUJyWWdtamJ6UGExcjY6aXhKUkk1M0xTT1dTS2xzN3daQjA3UQ==",
    indices: [
        {
            name: "fdo-test-1",
            facets: [
                {
                    key: "resourceType.keyword",
                    label: "Resource Type"
                },
                {
                    key: "digitalObjectType.keyword",
                    label: "File Type",
                    usePidResolver: true
                },
                {
                    key: "hadPrimarySource.keyword",
                    label: "Source"
                },
                {
                    key: "licenseURL.keyword",
                    label: "License"
                },
                {
                    key: "NMR_Method.keyword",
                    label: "NMR Method"
                }
            ],
            resultFields: [], // Leave empty to get all fields
            searchFields: ["name", "pid", "hasMetadata", "isMetadataFor", "NMR_Method"],
            fieldMappings: {}
        }
    ],
    disjunctiveFacets: []
}

export const DemoElastic: Story = {
    args: {
        config: demoConfig,
        debug: false
    }
}
