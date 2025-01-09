import type { FairDOConfig } from "@/config/FairDOConfig"
import { FairDOElasticSearch } from "@/components/FairDOElasticSearch"

const demoConfig: FairDOConfig = {
    logo: "",
    title: "NEP Search",
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

export default function Page() {
    return (
        <div className="flex flex-col items-center">
            <div className="bg-muted font-bold w-full p-10">
                <h1 className="text-4xl">NEP Search</h1>
            </div>
            <div className="max-w-[1300px] w-[min(1300px,100vw)]">
                <FairDOElasticSearch config={demoConfig} />
            </div>
        </div>
    )
}
