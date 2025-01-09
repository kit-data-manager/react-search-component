import { PidDisplay } from "@/components/result/PidDisplay"
import { FairDOConfig } from "@/config/FairDOConfig"
import { FairDOElasticSearch } from "@/components/FairDOElasticSearch"

const demoConfig: FairDOConfig = {
    logo: "",
    title: "NEP",
    debug: false,
    alwaysSearchOnInitialLoad: true,
    //host: "https://matwerk.datamanager.kit.edu/search-proxy/api/v1",
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
                    optionsTextDisplay: (props) => <PidDisplay pid={props.text} />
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
                    label: "NMR Method",
                    optionsTextDisplay: (props) => <PidDisplay pid={props.text} />
                }
            ],
            resultFields: [], // Leave empty to get all fields
            searchFields: ["name", "pid", "hasMetadata", "isMetadataFor", "NMR_Method"],
            fieldMappings: {}
        }
    ],
    disjunctiveFacets: []
}

export function App() {
    return <FairDOElasticSearch config={demoConfig} />
}
