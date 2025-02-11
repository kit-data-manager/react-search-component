import type { Meta, StoryObj } from "@storybook/react"
import { ReactFlowProvider } from "@xyflow/react"
import { RelationsGraph } from "@/components/graph/RelationsGraph"
import { GenericResultView } from "@/components/result"

const meta = {
    component: RelationsGraph,
    tags: ["autodocs"]
} satisfies Meta<typeof RelationsGraph>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    decorators: [
        (Story) => (
            <ReactFlowProvider>
                <div style={{ width: "100%", height: "min(70vh, 700px)" }}>
                    <Story />
                </div>
            </ReactFlowProvider>
        )
    ],
    args: {
        referencedBy: ["a", "b", "c"],
        base: "self",
        references: ["1", "2", "3", "4", "5"],
        resultView: (props) => <GenericResultView {...props} config={{ host: "", indices: [] }} />
    }
}
