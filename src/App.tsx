import { FairDOElasticSearch } from "./FairDOElasticSearch.tsx"
import { FairDOConfigProvider } from "./config/FairDOConfigProvider.ts"
import { FairDOConfig } from "./config/FairDOConfig.ts"

const objConfig: FairDOConfig = {
    logo: "/images/nfdi-logo.png",
    title: "NFDI4MatWerk Metadata Search",
    debug: false,
    alwaysSearchOnInitialLoad: true,
    host: "https://matwerk.datamanager.kit.edu/search-proxy/api/v1",
    indices: [
        {
            name: "metastore-scanning-electron-microscopy",
            searchFields: [
                "id",
                "metadataDocument.entry.title",
                "metadataDocument.entry.instrument.instrumentName",
                "metadataDocument.entry.instrument.instrumentManufacturer.modelName",
                "metadataDocument.entry.user.userName",
                "metadataDocument.entry.measurementPurpose",
                "metadataDocument.entry.technique"
            ],
            resultFields: [
                "id",
                "_index",
                "metadataDocument.entry.title",
                "metadataDocument.entry.instrument.instrumentName",
                "metadataDocument.entry.instrument.instrumentManufacturer.modelName",
                "metadataDocument.entry.instrument.eBeamSource.accelerationVoltage.value",
                "metadataDocument.entry.user.userName",
                "metadataDocument.entry.measurementPurpose",
                "metadataDocument.entry.technique",
                "metadataDocument.entry.instrument.stage.stageAlignmentDone",
                "metadataDocument.entry.parents.parentReference"
            ],
            facets: [
                {
                    key: "_index",
                    label: "Index"
                },
                {
                    key: "metadataDocument.entry.program.programVersion.keyword",
                    label: "Program Version"
                },
                {
                    key: "metadataDocument.entry.user.userName.keyword",
                    label: "Username"
                },
                {
                    key: "metadataDocument.entry.instrument.eBeamSource.accelerationVoltage.value",
                    label: "Acceleration Voltage",
                    renderer: "multiCheckbox",
                    type: "numeric",
                    ranges: ["0-5", "6-10", "11-15", "16-20", ">20"]
                },
                {
                    key: "metadataDocument.entry.endTime",
                    label: "End Time",
                    renderer: "multiCheckbox",
                    type: "date_time"
                }
            ]
        },
        {
            name: "metastore-user_description",
            searchFields: [
                "id",
                "metadataDocument.userName",
                "metadataDocument.givenName",
                "metadataDocument.familyName",
                "metadataDocument.role",
                "metadataDocument.affiliation.institutionName",
                "metadataDocument.affiliation.institutionAcronym"
            ],
            resultFields: [
                "id",
                "_index",
                "metadataRecord.relatedResource.identifier",
                "metadataRecord.lastUpdate",
                "metadataRecord.licenseUri",
                "metadataRecord.metadataDocumentUri",
                "metadataDocument.userName",
                "metadataDocument.givenName",
                "metadataDocument.familyName",
                "metadataDocument.role",
                "metadataDocument.age",
                "metadataDocument.affiliation.institutionName",
                "metadataDocument.affiliation.institutionAcronym",
                "metadataDocument.affiliation.institutionID.identifierValue",
                "metadataDocument.contact.orcid",
                "metadataDocument.contact.email"
            ],
            facets: [
                {
                    key: "_index",
                    label: "Index"
                },
                {
                    key: "metadataDocument.role.keyword",
                    label: "Role",
                    renderer: "multiCheckbox"
                },
                {
                    key: "metadataDocument.affiliation.institutionAcronym.keyword",
                    label: "Affiliation"
                },
                {
                    key: "metadataDocument.age",
                    label: "Age",
                    renderer: "multiCheckbox",
                    type: "numeric",
                    ranges: ["0-18", "19-25", "25-30", ">30"]
                }
            ]
        }
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
