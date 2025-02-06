import type { Meta, StoryObj } from "@storybook/react"

import { GenericResultView } from "@/components/result/GenericResultView"
import { AtomIcon, GlobeIcon, GraduationCap, ScaleIcon } from "lucide-react"
import { tryURLPrettyPrint } from "@/lib/utils"
import { GlobalModalProvider } from "@/components/GlobalModalProvider"
import { TooltipProvider } from "@/components/ui/tooltip"

const meta = {
    component: GenericResultView,
    tags: ["autodocs"]
} satisfies Meta<typeof GenericResultView>

export default meta

type Story = StoryObj<typeof meta>

export const Simple: Story = {
    decorators: [
        (Story) => (
            <TooltipProvider>
                <GlobalModalProvider resultView={GenericResultView}>
                    <div>
                        <Story />
                    </div>
                </GlobalModalProvider>
            </TooltipProvider>
        )
    ],
    args: {
        result: {
            title: "GenericResultView",
            description: "This view can be customized"
        },
        titleField: "title",
        descriptionField: "description",
        imageField: undefined,
        invertImageInDarkMode: true
    }
}

export const MultipleImages: Story = {
    decorators: [
        (Story) => (
            <TooltipProvider>
                <GlobalModalProvider resultView={GenericResultView}>
                    <div>
                        <Story />
                    </div>
                </GlobalModalProvider>
            </TooltipProvider>
        )
    ],
    args: {
        result: {
            title: "Multi Image support",
            description: "Automatically renders an image slider when multiple images are returned",
            images: {
                raw: [
                    "https://www.chemotion-repository.net/images/samples/c830eb171cd3b0a481eda0e2a49279ad78765ab0a3b29238b59bb754a67dfd3cd69b3fadba0db65545ed0f9bf4eec9936d16f23e88453c53c3c21b65d54a853f.svg",
                    "https://www.chemotion-repository.net/images/samples/36d8f52238fe63c89855af68b865d237313c8cabd6acec2be6f6770a4e2c98ca99c4ea43e783e546e27cfbbbb956a90c43a173fca460e1fb0439cf9cfe077624.svg",
                    "https://www.chemotion-repository.net/images/samples/c830eb171cd3b0a481eda0e2a49279ad78765ab0a3b29238b59bb754a67dfd3cd69b3fadba0db65545ed0f9bf4eec9936d16f23e88453c53c3c21b65d54a853f.svg"
                ]
            }
        },
        titleField: "title",
        descriptionField: "description",
        invertImageInDarkMode: true,
        imageField: "images"
    }
}

export const Full: Story = {
    decorators: [
        (Story) => (
            <TooltipProvider>
                <GlobalModalProvider resultView={GenericResultView}>
                    <div>
                        <Story />
                    </div>
                </GlobalModalProvider>
            </TooltipProvider>
        )
    ],
    args: {
        result: {
            pid: "sandboxed/849e64fe-ae6f-49ce-b5c3-91ea9b6b2fe7",
            KernelInformationProfile: "21.T11148/b9b76f887845e32d29f7",
            digitalObjectType: "21.T11148/ca9fd0b2414177b79ac2",
            hadPrimarySource: "https://www.chemotion-repository.net",
            digitalObjectLocation: "10.14272/UMEUUBQHJXGOAF-UHFFFAOYSA-N.1",
            contact: "https://orcid.org/0009-0009-6122-7739",
            dateCreatedRfc3339: "2024-05-21",
            resourceType: "Study",
            licenseURL: "https://www.gnu.org/licenses/agpl-3.0.en.html",
            checksum: "TODO",
            "locationPreview/Sample":
                "https://www.chemotion-repository.net/images/samples/c830eb171cd3b0a481eda0e2a49279ad78765ab0a3b29238b59bb754a67dfd3cd69b3fadba0db65545ed0f9bf4eec9936d16f23e88453c53c3c21b65d54a853f.svg",
            Compound: "323.43023999999986",
            name: " (rac)-2-([2.2]paracyclophan-4-yl)-1H-indole",
            landingPageLocation: "https://www.chemotion-repository.net/inchikey/UMEUUBQHJXGOAF-UHFFFAOYSA-N.1",
            identifier: "CRS-39445",
            isMetadataFor: ["example1", "example2", "example3"],
            timestamp: "2024-05-21",
            numberTest: 2025,
            numberArrayTest: [1, 2, 3],
            booleanTest: true,
            booleanArrayTest: [true, false],
            stringTest: "A single entry",
            stringArrayTest: ["Works", "with", "arrays"]
        },
        imageField: "locationPreview/Sample",
        invertImageInDarkMode: true,
        tags: [
            {
                icon: <GraduationCap className="rfs-shrink-0 rfs-size-4 rfs-mr-2" />,
                label: "Resource Type",
                field: "resourceType"
            },
            {
                icon: <GlobeIcon className="rfs-shrink-0 rfs-size-4 rfs-mr-2" />,
                field: "hadPrimarySource",
                singleValueMapper: tryURLPrettyPrint,
                label: "Primary Source",
                clickBehavior: "follow-url"
            },
            {
                icon: <ScaleIcon className="rfs-shrink-0 rfs-size-4 rfs-mr-2" />,
                field: "licenseURL",
                singleValueMapper: tryURLPrettyPrint,
                label: "License URL",
                clickBehavior: "follow-url"
            },
            {
                icon: <AtomIcon className="rfs-shrink-0 rfs-size-4 rfs-mr-2" />,
                field: "Compound",
                label: "Compound"
            },
            {
                field: "numberTest"
            },
            {
                field: "numberArrayTest"
            },
            {
                field: "booleanTest",
                singleValueMapper: (b) => (b ? "Yes" : "No")
            },
            {
                field: "booleanArrayTest",
                singleValueMapper: (b) => (b ? "Yes" : "No")
            },
            {
                field: "stringTest"
            },
            {
                field: "stringArrayTest"
            },
            {
                field: "stringArrayTest",
                singleValueMapper: (v) => v.toUpperCase()
            }
        ]
    }
}
