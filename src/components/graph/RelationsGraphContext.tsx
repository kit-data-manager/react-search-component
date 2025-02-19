import { createContext } from "react"
import { GraphNode } from "@/components/graph/GraphNode"
import { RelationsGraphOptions } from "@/components/graph/RelationsGraphOptions"

export const RelationsGraphContext = createContext<{
    /**
     * Open the relations graph modal with the specified nodes and options. If the graph is already open, the current graph is replaced
     * with the specified nodes and options.
     * @param nodes Nodes to display in the Graph. Consider using GraphNodeUtils for constructing the nodes.
     * @param options Options to further configure the graph
     */
    openRelationsGraph: (nodes: GraphNode[], options?: RelationsGraphOptions) => void

    /**
     * Open the relations graph modal with the specified nodes and options. If the graph is already open, the current graph is extended
     * with the specified nodes. Iff options are specified, they will override the options of the currently open graph.
     * @param nodes Nodes to display in the Graph or add to the already open Graph. Consider using GraphNodeUtils for constructing the nodes.
     * @param options Options to further configure the Graph.
     */
    openOrAddToRelationsGraph: (nodes: GraphNode[], options?: RelationsGraphOptions) => void

    /**
     * Close the relations graph modal
     */
    closeRelationsGraph: () => void
}>({
    openRelationsGraph: (): void => {
        throw "RelationsGraphProvider not mounted"
    },
    openOrAddToRelationsGraph: () => {
        throw "RelationsGraphProvider not mounted"
    },
    closeRelationsGraph: (): void => {
        throw "RelationsGraphProvider not mounted"
    }
})
