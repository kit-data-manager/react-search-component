import type { Meta, StoryObj } from "@storybook/react"

import { FairDOElasticSearch } from "./FairDOElasticSearch.tsx"
import { FairDOConfig } from "@/config/FairDOConfig.ts"
import { nmrFields } from "@/lib/nmrFields.ts"
import { FairDOConfigProvider } from "@/config/FairDOConfigProvider.ts"

const meta = {
    component: FairDOElasticSearch
} satisfies Meta<typeof FairDOElasticSearch>

export default meta

type Story = StoryObj<typeof meta>

const localConfig: FairDOConfig = {
    logo: "/images/nfdi-logo.png",
    title: "NFDI4MatWerk Metadata Search",
    debug: false,
    alwaysSearchOnInitialLoad: true,
    //host: "https://matwerk.datamanager.kit.edu/search-proxy/api/v1",
    host: "http://localhost:9200",
    indices: [
        {
            name: "fairdo",
            facets: [
                {
                    key: nmrFields.ChemicalFormula,
                    label: "Chemical Formula"
                },
                {
                    key: nmrFields.genericObjectType,
                    label: "Data Type"
                },
                {
                    key: nmrFields.dateCreatedRfc3339,
                    label: "Created",
                    type: "date_year"
                },
                {
                    key: nmrFields.dateModified,
                    label: "Last Modified",
                    type: "date_year"
                },
                {
                    key: nmrFields.licenseURL,
                    label: "License"
                }
            ],
            resultFields: ["id", "pid", ...Object.values(nmrFields)], // Leave empty to get all fields
            searchFields: [],
            fieldMappings: {}
        }
    ],
    disjunctiveFacets: []
}

const localFairConfig = new FairDOConfigProvider(localConfig)

export const LocalElastic: Story = {
    args: {
        config: localFairConfig
    }
}

const demoConfig: FairDOConfig = {
    logo: "/images/nfdi-logo.png",
    title: "NFDI4MatWerk Metadata Search",
    debug: false,
    alwaysSearchOnInitialLoad: true,
    //host: "https://matwerk.datamanager.kit.edu/search-proxy/api/v1",
    host: "https://4103e5b9-9a45-47a7-b9a4-6b1d36f49460.ka.bw-cloud-instance.org:9200",
    indices: [
        {
            name: "fdo-test-1",
            facets: [
                // {
                //     key: "licenseURL",
                //     label: "License"
                // }
            ],
            resultFields: [], // Leave empty to get all fields
            searchFields: ["name"],
            fieldMappings: {}
        }
    ],
    disjunctiveFacets: []
}

const demoFairConfig = new FairDOConfigProvider(demoConfig)

export const DemoElastic: Story = {
    args: {
        config: demoFairConfig
    }
}
