import type { Meta, StoryObj } from "@storybook/react"

import { RelationsGraph } from "./RelationsGraph"
import { ReactFlowProvider } from "@xyflow/react"

const meta = {
    component: RelationsGraph
} satisfies Meta<typeof RelationsGraph>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    decorators: [
        (Story) => (
            <ReactFlowProvider>
                <div style={{ width: "500px", height: "500px" }}>
                    <Story />{" "}
                </div>
            </ReactFlowProvider>
        )
    ],
    args: {
        basePid: "T10/436895408650943",
        referencedPids: [
            "T10/436895408650943",
            "T10/436895408650943",
            "T10/436895408650943",
            "T10/436895408650943",
            "T10/436895408650943",
            "T10/436895408650943"
        ]
    }
}
