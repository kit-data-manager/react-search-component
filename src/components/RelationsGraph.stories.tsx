import type { Meta, StoryObj } from "@storybook/react"

import { RelationsGraph } from "./RelationsGraph"
import { ReactFlowProvider } from "@xyflow/react"
import { basicRelationNode } from "@/components/helpers.ts"

const meta = {
    component: RelationsGraph
} satisfies Meta<typeof RelationsGraph>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    decorators: [
        (Story) => (
            <ReactFlowProvider>
                <div style={{ width: "100%", height: "min(70vh, 700px)" }}>
                    <Story />{" "}
                </div>
            </ReactFlowProvider>
        )
    ],
    args: {
        base: basicRelationNode("T10/436895408650943", "Source"),
        referenced: [
            basicRelationNode("T10/436895408650941", "Something else"),
            basicRelationNode("T10/436895408650942"),
            basicRelationNode("T10/436895408650944"),
            basicRelationNode("T10/436895408650945", "Another example"),
            basicRelationNode("T10/436895408650946"),
            basicRelationNode("T10/436895408650947")
        ]
    }
}
