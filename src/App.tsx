import { FairDOElasticSearch } from "./FairDOElasticSearch.tsx"
import { FairDOConfigProvider } from "./config/FairDOConfigProvider.ts"
import { FairDOConfig } from "./config/FairDOConfig.ts"

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
                    key: "21.T11148/6f0d1c34a6ab5d67049f",
                    label: "Formel"
                },
                {
                    key: "21.T11148/2f314c8fe5fb6a0063a8",
                    label: "License"
                }
            ],
            resultFields: [
                "id",
                "pid",
                "21.T11148/076759916209e5d62bd5",
                "21.T11148/f3f0cbaa39fa9966b279",
                "21.T11148/6ae999552a0d2dca14d6",
                "21.T11148/aafd5fb4c7222e2d950a",
                "21.T11148/397d831aa3a9d18eb52c",
                "21.T11148/2f314c8fe5fb6a0063a8",
                "21.T11148/b8457812905b83046284",
                "21.T11148/8710d753ad10f371189b",
                "21.T11148/c83481d4bf467110e7c9",
                "21.T11148/82e2503c49209e987740",
                "21.T11148/68aed8017b345bf87643",
                "21.T11148/1c699a5d1b4ad3ba4956",
                "21.T11148/6f0d1c34a6ab5d67049f"
            ], // Leave empty to get all fields
            searchFields: ["T11148/4295aedecbcbfdd1433c"],
            fieldMappings: {
                title: "21.T11148/6ae999552a0d2dca14d6",
                bodyText: "21.T11148/82e2503c49209e987740"
            }
        }
        // {
        //     name: "metastore-scanning-electron-microscopy",
        //     searchFields: [
        //         "id",
        //         "metadataDocument.entry.title",
        //         "metadataDocument.entry.instrument.instrumentName",
        //         "metadataDocument.entry.instrument.instrumentManufacturer.modelName",
        //         "metadataDocument.entry.user.userName",
        //         "metadataDocument.entry.measurementPurpose",
        //         "metadataDocument.entry.technique"
        //     ],
        //     resultFields: [
        //         "id",
        //         "_index",
        //         "metadataDocument.entry.title",
        //         "metadataDocument.entry.instrument.instrumentName",
        //         "metadataDocument.entry.instrument.instrumentManufacturer.modelName",
        //         "metadataDocument.entry.instrument.eBeamSource.accelerationVoltage.value",
        //         "metadataDocument.entry.user.userName",
        //         "metadataDocument.entry.measurementPurpose",
        //         "metadataDocument.entry.technique",
        //         "metadataDocument.entry.instrument.stage.stageAlignmentDone",
        //         "metadataDocument.entry.parents.parentReference"
        //     ],
        //     facets: [
        //         {
        //             key: "_index",
        //             label: "Index"
        //         },
        //         {
        //             key: "metadataDocument.entry.program.programVersion.keyword",
        //             label: "Program Version"
        //         },
        //         {
        //             key: "metadataDocument.entry.user.userName.keyword",
        //             label: "Username"
        //         },
        //         {
        //             key: "metadataDocument.entry.instrument.eBeamSource.accelerationVoltage.value",
        //             label: "Acceleration Voltage",
        //             renderer: "multiCheckbox",
        //             type: "numeric",
        //             ranges: ["0-1", "2-3", "4-5", "6-10", "11-15", "16-20", ">20"]
        //         },
        //         {
        //             key: "metadataDocument.entry.endTime",
        //             label: "End Time",
        //             renderer: "multiCheckbox",
        //             type: "date_time"
        //         }
        //     ]
        // },
        // {
        //     name: "metastore-user_description",
        //     searchFields: [
        //         "id",
        //         "metadataDocument.userName",
        //         "metadataDocument.givenName",
        //         "metadataDocument.familyName",
        //         "metadataDocument.role",
        //         "metadataDocument.affiliation.institutionName",
        //         "metadataDocument.affiliation.institutionAcronym"
        //     ],
        //     resultFields: [
        //         "id",
        //         "_index",
        //         "metadataRecord.relatedResource.identifier",
        //         "metadataRecord.lastUpdate",
        //         "metadataRecord.licenseUri",
        //         "metadataRecord.metadataDocumentUri",
        //         "metadataDocument.userName",
        //         "metadataDocument.givenName",
        //         "metadataDocument.familyName",
        //         "metadataDocument.role",
        //         "metadataDocument.age",
        //         "metadataDocument.affiliation.institutionName",
        //         "metadataDocument.affiliation.institutionAcronym",
        //         "metadataDocument.affiliation.institutionID.identifierValue",
        //         "metadataDocument.contact.orcid",
        //         "metadataDocument.contact.email"
        //     ],
        //     facets: [
        //         {
        //             key: "_index",
        //             label: "Index"
        //         },
        //         {
        //             key: "metadataDocument.role.keyword",
        //             label: "Role",
        //             renderer: "multiCheckbox"
        //         },
        //         {
        //             key: "metadataDocument.affiliation.institutionAcronym.keyword",
        //             label: "Affiliation"
        //         },
        //         {
        //             key: "metadataDocument.age",
        //             label: "Age",
        //             renderer: "multiCheckbox",
        //             type: "numeric",
        //             ranges: ["0-18", "19-25", "25-30", ">30"]
        //         }
        //     ]
        // }
    ],
    disjunctiveFacets: ["metadata.resourceType.typeGeneral", "metadata.publicationYear"]
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
