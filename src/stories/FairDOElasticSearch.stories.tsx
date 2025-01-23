import type { FairDOConfig } from "@/config/FairDOConfig.ts"

import type { Meta, StoryObj } from "@storybook/react"
import { FairDOElasticSearch } from "@/components/FairDOElasticSearch"
import { GenericResultView } from "@/components/result/GenericResultView"
import { AtomIcon, GlobeIcon, GraduationCap, ScaleIcon } from "lucide-react"
import { tryURLPrettyPrint } from "@/lib/utils"

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
            name: "fdo-test-3",
            facets: [
                {
                    key: "resourceType.keyword",
                    label: "Resource Type"
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
                    usePidResolver: true
                }
            ],
            resultFields: [], // Leave empty to get all fields
            searchFields: ["name", "pid", "hasMetadata", "isMetadataFor", "NMR_Method"]
        }
    ],
    initialState: {
        sortList: [
            {
                field: "_score",
                direction: "desc"
            },
            {
                field: "name.keyword",
                direction: "asc"
            },
            {
                field: "locationPreview/Sample.keyword",
                direction: "asc"
            }
        ]
    },
    disjunctiveFacets: ["NMR_Method.keyword"]
}

export const NoResultRenderer: Story = {
    args: {
        config: demoConfig,
        resultView: null!
    }
}

export const GenericResultRenderer: Story = {
    args: {
        config: demoConfig,
        resultView: (props) => (
            <GenericResultView
                result={props.result}
                invertImageInDarkMode
                tags={[
                    {
                        icon: <GraduationCap className="rfs-shrink-0 rfs-size-4 rfs-mr-2" />,
                        label: "Resource Type",
                        field: "resourceType"
                    },
                    {
                        icon: <GlobeIcon className="rfs-shrink-0 rfs-size-4 rfs-mr-2" />,
                        field: "hadPrimarySource",
                        valueMapper: tryURLPrettyPrint
                    },
                    {
                        icon: <ScaleIcon className="rfs-shrink-0 rfs-size-4 rfs-mr-2" />,
                        field: "licenseURL",
                        valueMapper: tryURLPrettyPrint
                    },
                    {
                        icon: <AtomIcon className="rfs-shrink-0 rfs-size-4 rfs-mr-2" />,
                        field: "Compound"
                    }
                ]}
                titleField="name"
                creationDateField="dateCreatedRfc3339"
                identifierField="identifier"
                digitalObjectLocationField="digitalObjectLocation"
                imageField="locationPreview/Sample"
                parentItemPidField="hasMetadata"
                relatedItemPidsField="isMetadataFor"
                pidField="pid"
                relatedItemsPrefetch={{ prefetchAmount: 20, searchFields: { pid: {}, isMetadataFor: {}, hasMetadata: {} } }}
                showOpenInFairDoScope
            />
        )
    }
}
