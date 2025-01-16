import type { Meta, StoryObj } from "@storybook/react"

import { FairDOSearchContext } from "@/components/FairDOSearchContext"
import { GlobalModalProvider } from "@/components/GlobalModalProvider"
import { DateTime } from "luxon"
import { NMRResultView } from "@/components/result/NMRResultView"

const meta = {
    component: NMRResultView,
    tags: ["autodocs"]
} satisfies Meta<typeof NMRResultView>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        result: {
            pid: "mockPID0",
            name: "NMRResultView",
            dateCreatedRfc3339: DateTime.now().toISO(),
            identifier: "TEST001",
            hadPrimarySource: "https://www.example.com/",
            licenseURL: "https://www.example.com/",
            digitalObjectType: "21.T11148/ca9fd0b2414177b79ac2",
            "locationPreview/Sample": "/react.svg",
            hasMetadata: "mockMetadataPID",
            isMetadataFor: ["mockPID1", "mockPID2", "mockPID3", "mockPID4"]
        }
    },
    decorators: [
        (Story) => (
            <FairDOSearchContext.Provider
                value={{
                    searchFor(str: string) {
                        alert(`Searching for ${str}`)
                    },
                    searchTerm: "",
                    async searchForBackground() {
                        return undefined
                    }
                }}
            >
                <GlobalModalProvider>
                    <Story />
                </GlobalModalProvider>
            </FairDOSearchContext.Provider>
        )
    ]
}
