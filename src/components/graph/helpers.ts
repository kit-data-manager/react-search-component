import { Edge, Node } from "@xyflow/react"
import Dagre from "@dagrejs/dagre"

export type ResultPID = {
    pid: string
    result?: Record<string, unknown>
}

export function buildGraphForReferences(base: ResultPID, parents: ResultPID[], _children: ResultPID[]) {
    const children = _children.filter((pid) => !parents.find((e) => e.pid === pid.pid))
    const yStartParents = -((parents.length - 1) * 100) / 2
    const yStartChildren = -((children.length - 1) * 100) / 2
    const nodes: { id: string; type: string; position: { x: number; y: number }; data: Record<string, unknown> }[] = [
        {
            id: base.pid,
            type: "plain",
            position: { x: 0, y: 0 },
            data: { ...base.result }
        }
    ]
    const edges: { id: string; source: string; target: string }[] = []

    for (let i = 0; i < parents.length; i++) {
        nodes.push({
            id: parents[i].pid,
            type: "plain",
            position: { x: -1000, y: yStartParents + i * 100 },
            data: { ...parents[i].result }
        })

        edges.push({
            id: `e-${parents[i].pid}-base`,
            source: parents[i].pid,
            target: base.pid
        })
    }

    for (let i = 0; i < children.length; i++) {
        nodes.push({
            id: children[i].pid,
            type: "plain",
            position: { x: 1000, y: yStartChildren + i * 100 },
            data: { ...children[i].result }
        })

        edges.push({
            id: `e-base-${children[i].pid}`,
            source: base.pid,
            target: children[i].pid
        })
    }

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
