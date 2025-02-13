import { Edge, Node } from "@xyflow/react"
import Dagre from "@dagrejs/dagre"
import { GraphNode } from "@/components/graph/GraphNode"

export function buildGraphForReferences(nodes: GraphNode[]) {
    const initialNodes: { id: string; type: string; position: { x: number; y: number }; data: Record<string, unknown> }[] = nodes.map((node) => ({
        type: node.type,
        id: node.id,
        position: { x: 0, y: 0 },
        data: node.data ?? {}
    }))

    const initialEdges: { id: string; source: string; target: string }[] = []

    for (const node of nodes) {
        for (const out of node.out) {
            initialEdges.push({
                id: `${node.id}-${out}`,
                source: node.id,
                target: out
            })
        }
    }

    return { initialNodes, initialEdges }
}

export function getLayoutedElements(nodes: (Node & { type: string })[], edges: Edge[]) {
    const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))
    g.setGraph({ rankdir: "LR", nodesep: 25, ranksep: 100 })

    edges.forEach((edge) => g.setEdge(edge.source, edge.target))
    nodes.forEach((node) =>
        g.setNode(node.id, {
            ...node,
            width: node.measured?.width ?? 0,
            height: node.measured?.height ?? 0
        })
    )

    Dagre.layout(g)

    return {
        nodes: nodes.map((node) => {
            const position = g.node(node.id)
            // We are shifting the dagre node position (anchor=center center) to the top left
            // so it matches the React Flow node anchor point (top left).
            const x = position.x - (node.measured?.width ?? 0) / 2
            const y = position.y - (node.measured?.height ?? 0) / 2

            return { ...node, position: { x, y } }
        }),
        edges
    }
}
