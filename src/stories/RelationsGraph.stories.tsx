import type { Meta, StoryObj } from "@storybook/react"

import { BasicRelationNode } from "@/lib/RelationNode"
import { ReactFlowProvider } from "@xyflow/react"
import { RelationsGraph } from "@/components/graph/RelationsGraph"

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
        referencedBy: [
            new BasicRelationNode("T10/parentA", "Parent"),
            new BasicRelationNode("T10/parentB", "Parent"),
            new BasicRelationNode("T10/parentC", "Source")
        ],
        base: new BasicRelationNode("T10/436895408650943, abcde", "Source"),
        references: [
            new BasicRelationNode("T10/436895408650941", "Dataset", "Something else"),
            new BasicRelationNode("T10/436895408650942", "Dataset"),
            new BasicRelationNode("T10/436895408650944", "Dataset"),
            new BasicRelationNode("T10/436895408650945", "Dataset", "Another example"),
            new BasicRelationNode("T10/436895408650946", "Dataset"),
            new BasicRelationNode("T10/436895408650947", "Dataset")
        ]
    }
}
