import type { Meta, StoryObj } from "@storybook/react"

import { RelationsGraph } from "./RelationsGraph.tsx"
import { ReactFlowProvider } from "@xyflow/react"
import { BasicRelationNode } from "@/lib/RelationNode.ts"

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
        base: new BasicRelationNode("T10/436895408650943", "Source"),
        referenced: [
            new BasicRelationNode("T10/436895408650941", "Something else"),
            new BasicRelationNode("T10/436895408650942"),
            new BasicRelationNode("T10/436895408650944"),
            new BasicRelationNode("T10/436895408650945", "Another example"),
            new BasicRelationNode("T10/436895408650946"),
            new BasicRelationNode("T10/436895408650947")
        ]
    }
}
