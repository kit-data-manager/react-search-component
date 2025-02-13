import { GraphNode } from "@/components/graph/GraphNode"
import { toArray } from "@/components/result"

export class GraphNodeUtils {
    static buildNodesSequential(type: string, ...ids: (string | string[])[]): GraphNode[] {
        const nodes: GraphNode[] = []

        for (let layer = 0; layer < ids.length; layer++) {
            const previousLayer = layer > 0 ? toArray(ids[layer - 1]) : []
            const currentLayer = toArray(ids[layer])
            const nextLayer = layer + 1 < ids.length ? toArray(ids[layer + 1]) : []

            for (const node of currentLayer) {
                nodes.push({
                    type,
                    id: node,
                    in: previousLayer,
                    out: nextLayer
                })
            }
        }

        return nodes
    }
}
