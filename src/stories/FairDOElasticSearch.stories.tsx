import type { FairDOConfig } from "@/config/FairDOConfig.ts"

import type { Meta, StoryObj } from "@storybook/react"
import { FairDOElasticSearch } from "@/components/FairDOElasticSearch"

const meta = {
    component: FairDOElasticSearch,
    tags: ["autodocs"]
} satisfies Meta<typeof FairDOElasticSearch>

export default meta

type Story = StoryObj<typeof meta>

const demoConfig: FairDOConfig = {
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
                    label: "Source",
                    prettyPrintURLs: true
                },
                {
                    key: "licenseURL.keyword",
                    label: "License",
                    prettyPrintURLs: true
                },
                {
                    key: "NMR_Method.keyword",
                    label: "NMR Method",
                    prettyPrintURLs: true
                }
            ],
            resultFields: [], // Leave empty to get all fields
            searchFields: ["name", "pid", "hasMetadata", "isMetadataFor", "NMR_Method"]
        }
    ]
}

const demoConfig2: FairDOConfig = {
    debug: false,
    alwaysSearchOnInitialLoad: true,
    // host: "https://matwerk.datamanager.kit.edu/search-proxy/api/v1",
    host: "https://ddaa9283-f114-4496-b6ed-af12ee34b107.ka.bw-cloud-instance.org:9200",
    apiKey: "VG9NNFNwUUJyWWdtamJ6UGExcjY6aXhKUkk1M0xTT1dTS2xzN3daQjA3UQ==",
    indices: [
        {
            name: "fdo-test-2",
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
                    label: "Source",
                    prettyPrintURLs: true
                },
                {
                    key: "licenseURL.keyword",
                    label: "License",
                    prettyPrintURLs: true
                },
                {
                    key: "NMR_Method.keyword",
                    label: "NMR Method",
                    prettyPrintURLs: true
                }
            ],
            resultFields: [], // Leave empty to get all fields
            searchFields: ["name", "pid", "hasMetadata", "isMetadataFor", "NMR_Method"]
        }
    ]
}

export const DemoElastic: Story = {
    args: {
        config: demoConfig,
        debug: false
    }
}

export const DemoElastic2: Story = {
    args: {
        config: demoConfig2,
        debug: false
    }
}
