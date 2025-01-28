import type { RelationNode } from "@/lib/RelationNode"
import { Edge, Node } from "@xyflow/react"
import Dagre from "@dagrejs/dagre"

export function buildGraphForReferences(base: RelationNode, parents: RelationNode[], _children: RelationNode[]) {
    const children = _children.filter((pid) => !parents.find((e) => e.id === pid.id))
    const yStartParents = -((parents.length - 1) * 100) / 2
    const yStartChildren = -((children.length - 1) * 100) / 2
    const nodes: { id: string; type: string; position: { x: number; y: number }; data: Record<string, unknown> }[] = [
        {
            id: base.id,
            type: "plain",
            position: { x: 0, y: 0 },
            data: { ...base }
        }
    ]
    const edges: { id: string; source: string; target: string }[] = []

    for (let i = 0; i < parents.length; i++) {
        nodes.push({
            id: parents[i].id,
            type: "plain",
            position: { x: -1000, y: yStartParents + i * 100 },
            data: { ...parents[i] }
        })

        edges.push({
            id: `e-${parents[i].id}-base`,
            source: parents[i].id,
            target: base.id
        })
    }

    for (let i = 0; i < children.length; i++) {
        nodes.push({
            id: children[i].id,
            type: "plain",
            position: { x: 1000, y: yStartChildren + i * 100 },
            data: { ...children[i] }
        })

        edges.push({
            id: `e-base-${children[i].id}`,
            source: base.id,
            target: children[i].id
        })
    }

    console.log(nodes, edges)

    return { initialNodes: nodes, initialEdges: edges }
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
