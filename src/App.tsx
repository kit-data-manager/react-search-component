import { FairDOElasticSearch } from "./FairDOElasticSearch.tsx"
import { FairDOConfigProvider } from "./config/FairDOConfigProvider.ts"
import { FairDOConfig } from "./config/FairDOConfig.ts"
import { nmrFields } from "@/lib/nmrFields.ts"

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

function App() {
    return (
        <div className="bg-gray-200 p-10">
            <div className="bg-white">
                <FairDOElasticSearch config={fairConfig} />
            </div>
        </div>
    )
}

export default App
