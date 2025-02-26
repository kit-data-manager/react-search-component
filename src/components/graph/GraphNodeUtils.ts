import { GraphNode } from "@/components/graph/GraphNode"

import { toArray } from "@/lib/utils"

/**
 * Utilities for working with the RelationsGraph
 */
export abstract class GraphNodeUtils {
    /**
     * Build a sequential graph (n:n:n:...) by passing just the identifiers of the nodes in layers.
     * @param type Type of the nodes (use "result" to display your resultView)
     * @param ids Each entry resembled one layer in the sequential graph
     * @example
     * buildSequentialGraphFromIds("result", "a", ["b", "c", "d"], "e")
     * // result:
     * //        b
     * //     /     \
     * //    a - c - e
     * //     \     /
     * //        d
     */
    static buildSequentialGraphFromIds(type: string, ...ids: (string | string[])[]): GraphNode[] {
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
