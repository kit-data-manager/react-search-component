import type { SearchConfig } from "@/lib/config/SearchConfig.ts"

import type { Meta, StoryObj } from "@storybook/react"
import { ReactSearchComponent } from "@/components/ReactSearchComponent"
import { GenericResultView } from "@/components/result/GenericResultView"
import { AtomIcon, AudioLines, CircleDot, FlaskConical, GlobeIcon, GraduationCap, Microscope, ScaleIcon, UserIcon } from "lucide-react"
import { PidNameDisplay } from "@/components/result/PidNameDisplay"
import { OrcidDisplay } from "@/components/result/OrcidDisplay"

const meta = {
    component: ReactSearchComponent,
    tags: ["autodocs"]
} satisfies Meta<typeof ReactSearchComponent>

export default meta

type Story = StoryObj<typeof meta>

function mapPrimarySource(pid: string) {
    // Hardcoded PIDs for NEP, can't be resolved
    if (pid === "21.T11981/935ad20c-e8f7-485d-8987-b4f22431ff4b") {
        return "chemotion-repository.net"
    } else if (pid === "21.T11981/352621cf-b0c6-4105-89a4-324f16cf7776") {
        return "nmrxiv.org"
    }
}

const demoConfig: SearchConfig = {
    debug: false,
    alwaysSearchOnInitialLoad: true,
    // host: "https://matwerk.datamanager.kit.edu/search-proxy/api/v1",
    host: "https://ddaa9283-f114-4496-b6ed-af12ee34b107.ka.bw-cloud-instance.org",
    apiKey: "UGNoTW1KUUJ3WmluUHBTcEVpalo6cGloOUVKZ0tTdnlMYVlpTzV4SXBrUQ==",
    indices: [
        {
            name: "fdo-prod",
            facets: [
                {
                    key: "resourceType.keyword",
                    label: "Resource Type"
                },
                {
                    key: "hadPrimarySource.keyword",
                    label: "Source",
                    singleValueMapper: (v) => mapPrimarySource(v + "")
                },
                {
                    key: "NMR_Method.keyword",
                    label: "NMR Method",
                    singleValueMapper: (v) => <PidNameDisplay pid={v + ""} />
                },
                {
                    key: "NMR_Solvent.keyword",
                    label: "NMR Solvent",
                    singleValueMapper: (v) => <PidNameDisplay pid={v + ""} />
                },
                {
                    key: "Compound.Molar_mass",
                    label: "Molar Mass",
                    type: "numeric",
                    ranges: [
                        "0-100",
                        "101-200",
                        "201-300",
                        "301-400",
                        "401-500",
                        "501-600",
                        "601-700",
                        "701-800",
                        "801-900",
                        "901-1000",
                        "1001-1200",
                        "1201-1400",
                        ">1401"
                    ]
                },
                {
                    key: "Pulse_Sequence_Name.keyword",
                    label: "Pulse Sequence Name"
                },
                {
                    key: "Acquisition_Nucleus.keyword",
                    label: "Acquisition Nucleus",
                    singleValueMapper: (v) => <PidNameDisplay pid={v + ""} />
                },
                {
                    key: "dateCreatedRfc3339",
                    label: "Created",
                    type: "date_time"
                },
                {
                    key: "dateModified",
                    label: "Last modified",
                    type: "date_time"
                },
                {
                    key: "licenseURL.keyword",
                    label: "License",
                    singleValueMapper: (v) => <PidNameDisplay pid={v + ""} />
                },
                {
                    key: "digitalObjectType.keyword",
                    label: "Digital Object Type",
                    singleValueMapper: (v) => <PidNameDisplay pid={v + ""} />
                }
            ],
            resultFields: [], // Leave empty to get all fields
            searchFields: [
                { field: "name", weight: 2 },
                { field: "pid", weight: 2 },
                "hasMetadata",
                "isMetadataFor",
                "NMR_Method",
                "digitalObjectType",
                "Acquisition_Nucleus",
                "Pulse_Sequence_Name",
                "hadPrimarySource",
                "resourceType"
            ]
        }
    ],
    sortOptions: [
        { field: "_score", direction: "desc", label: "Relevance" },
        { field: "name.keyword", direction: "asc", label: "Name (ascending)", default: true },
        { field: "name.keyword", direction: "desc", label: "Name (descending)" },
        { field: "Compound.Molar_mass", direction: "asc", label: "Molar Mass (ascending)" },
        { field: "Compound.Molar_mass", direction: "desc", label: "Molar Mass (descending)" },
        { field: "dateCreatedRfc3339", direction: "asc", label: "Date Created (ascending)" },
        { field: "dateCreatedRfc3339", direction: "desc", label: "Date Created (descending)" },
        { field: "dateModified", direction: "asc", label: "Date Modified (ascending)" },
        { field: "dateModified", direction: "desc", label: "Date Modified (descending)" }
    ],
    disjunctiveFacets: [
        "NMR_Method.keyword",
        "resourceType.keyword",
        "Pulse_Sequence_Name.keyword",
        "Acquisition_Nucleus.keyword",
        "licenseURL.keyword"
    ],
    imageProxy: (src) => `https://wsrv.nl/?url=${src}&h=1000&output=webp&ll`
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
                        icon: <UserIcon className="rfs-shrink-0 rfs-size-4 rfs-mr-2" />,
                        label: "Contact",
                        field: "contact",
                        singleValueMapper: (v) => <OrcidDisplay orcid={v + ""} />,
                        clickBehavior: "follow-url"
                    },
                    {
                        icon: <GraduationCap className="rfs-shrink-0 rfs-size-4 rfs-mr-2" />,
                        label: "Resource Type",
                        field: "resourceType"
                    },
                    {
                        icon: <GlobeIcon className="rfs-shrink-0 rfs-size-4 rfs-mr-2" />,
                        field: "hadPrimarySource",
                        singleValueMapper: (v) => mapPrimarySource(v + ""),
                        label: "Source",
                        onClick: (e) =>
                            "innerText" in e.target &&
                            typeof e.target.innerText === "string" &&
                            window.open("https://" + e.target.innerText, "_blank")
                    },
                    {
                        icon: <ScaleIcon className="rfs-shrink-0 rfs-size-4 rfs-mr-2" />,
                        field: "licenseURL",
                        singleValueMapper: (v) => <PidNameDisplay pid={v + ""} />,
                        label: "License URL",
                        clickBehavior: "follow-url"
                    },
                    {
                        icon: <AtomIcon className="rfs-shrink-0 rfs-size-4 rfs-mr-2" />,
                        field: "Compound.Molar_mass",
                        label: "Molar Mass",
                        singleValueMapper: (v) => v + " g/mol"
                    },
                    {
                        icon: <Microscope className="rfs-shrink-0 rfs-size-4 rfs-mr-2" />,
                        label: "NMR Method",
                        field: "NMR_Method",
                        singleValueMapper: (v) => <PidNameDisplay pid={v + ""} />
                    },
                    {
                        icon: <FlaskConical className="rfs-shrink-0 rfs-size-4 rfs-mr-2" />,
                        label: "NMR Solvent",
                        field: "NMR_Solvent",
                        singleValueMapper: (v) => <PidNameDisplay pid={v + ""} />
                    },
                    {
                        icon: <AudioLines className="rfs-shrink-0 rfs-size-4 rfs-mr-2" />,
                        label: "Pulse Sequence Name",
                        field: "Pulse_Sequence_Name"
                    },
                    {
                        icon: <CircleDot className="rfs-shrink-0 rfs-size-4 rfs-mr-2" />,
                        label: "Acquisition Nucleus",
                        field: "Acquisition_Nucleus",
                        singleValueMapper: (v) => <PidNameDisplay pid={v + ""} />
                    }
                ]}
                titleField="name"
                creationDateField="dateCreatedRfc3339"
                editedDateField={"dateModified"}
                additionalIdentifierField="identifier"
                digitalObjectLocationField="digitalObjectLocation"
                imageField="locationPreview/Sample"
                parentItemPidField="hasMetadata"
                childItemPidField="isMetadataFor"
                pidField="pid"
                showOpenInFairDoScope
            />
        )
    }
}
