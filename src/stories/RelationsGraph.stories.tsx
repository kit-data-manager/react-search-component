import type { Meta, StoryObj } from "@storybook/react"
import { ReactFlowProvider } from "@xyflow/react"
import { RelationsGraph } from "@/components/graph/RelationsGraph"
import { GenericResultView } from "@/components/result"
import { resultCache } from "@/lib/ResultCache"
import { FairDOSearchProvider } from "@/components/FairDOSearchProvider"
import { FairDOConfig } from "@/config/FairDOConfig"

const meta = {
    component: RelationsGraph,
    tags: ["autodocs"]
} satisfies Meta<typeof RelationsGraph>

export default meta

type Story = StoryObj<typeof meta>

const emptyConfig: FairDOConfig = { host: "", indices: [] }

export const Default: Story = {
    decorators: [
        (Story) => {
            resultCache.getState().set("a", { name: "Left side A" })
            resultCache.getState().set("b", { name: "Left side B" })
            resultCache.getState().set("c", { name: "Left side C" })
            resultCache.getState().set("self", { name: "Center entry" })
            resultCache.getState().set("1", { name: "Right side A" })
            resultCache.getState().set("2", { name: "Right side B" })
            resultCache.getState().set("3", { name: "Right side C" })
            resultCache.getState().set("4", { name: "Right side D" })
            resultCache.getState().set("5", { name: "Right side E" })

            return (
                <ReactFlowProvider>
                    <FairDOSearchProvider config={emptyConfig}>
                        <div style={{ width: "100%", height: "min(70vh, 700px)" }}>
                            <Story />
                        </div>
                    </FairDOSearchProvider>
                </ReactFlowProvider>
            )
        }
    ],
    args: {
        referencedBy: ["a", "b", "c"],
        base: "self",
        references: ["1", "2", "3", "4", "5"],
        resultView: (props) => <GenericResultView {...props} />
    }
}
