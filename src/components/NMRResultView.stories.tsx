import type { Meta, StoryObj } from "@storybook/react"

import { NMRResultView } from "./NMRResultView"
import { DateTime } from "luxon"
import { FairDOSearchContext } from "@/components/FairDOSearchContext.tsx"

const meta = {
    component: NMRResultView
} satisfies Meta<typeof NMRResultView>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        result: {
            name: "NMRResultView",
            dateCreatedRfc3339: DateTime.now().toISO(),
            identifier: "TEST001",
            hadPrimarySource: "https://www.example.com/",
            licenseURL: "https://www.example.com/",
            digitalObjectType: "21.T11148/ca9fd0b2414177b79ac2",
            "locationPreview/Sample": "/src/assets/react.svg"
        }
    },
    decorators: [
        (Story) => (
            <FairDOSearchContext.Provider value={{ searchFor() {}, searchTerm: "" }}>
                <Story />
            </FairDOSearchContext.Provider>
        )
    ]
}
