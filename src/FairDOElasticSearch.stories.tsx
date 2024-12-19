import type { Meta, StoryObj } from "@storybook/react"

import { FairDOElasticSearch } from "./FairDOElasticSearch"
import { FairDOConfig } from "@/config/FairDOConfig.ts"
import { nmrFields } from "@/lib/nmrFields.ts"
import { FairDOConfigProvider } from "@/config/FairDOConfigProvider.ts"

const meta = {
    component: FairDOElasticSearch
} satisfies Meta<typeof FairDOElasticSearch>

export default meta

type Story = StoryObj<typeof meta>

const objConfig: FairDOConfig = {
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

const fairConfig = new FairDOConfigProvider(objConfig)

export const Default: Story = {
    args: {
        config: fairConfig
    }
}
