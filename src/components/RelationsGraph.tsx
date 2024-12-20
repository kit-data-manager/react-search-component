import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    useReactFlow,
    useNodesInitialized,
    Background,
    BackgroundVariant
} from "@xyflow/react"

import "@xyflow/react/dist/style.css"
import { useEffect, useMemo } from "react"
import { PlainNode } from "@/components/PlainNode.tsx"

export interface RelationNode {
    id: string
    label: string
    remoteURL?: string
    searchQuery?: string
}

function buildGraphForReferences(base: RelationNode, _referenced: RelationNode[]) {
    const referenced = _referenced.filter((pid) => pid !== base)
    const yStart = -((referenced.length - 1) * 100) / 2
    const nodes = [{ id: base.id, type: "plain", position: { x: 0, y: 0 }, data: { ...base } }]
    const edges: { id: string; source: string; target: string }[] = []

    for (let i = 0; i < referenced.length; i++) {
        nodes.push({
            id: referenced[i].id,
            type: "plain",
            position: { x: 800, y: yStart + i * 100 },
            data: { ...referenced[i] }
        })
        edges.push({
            id: `e-${base.id}-${referenced[i].id}`,
            source: base.id,
            target: referenced[i].id
        })
    }

    return { initialNodes: nodes, initialEdges: edges }
}

const nodeTypes = {
    plain: PlainNode
}

export function RelationsGraph(props: { base: RelationNode; referenced: RelationNode[] }) {
    const { initialEdges, initialNodes } = useMemo(() => {
        return buildGraphForReferences(props.base, props.referenced)
    }, [props.base, props.referenced])

    const [nodes, , onNodesChange] = useNodesState(initialNodes)
    const [edges, , onEdgesChange] = useEdgesState(initialEdges)
    const { fitView } = useReactFlow()
    const nodesInitialized = useNodesInitialized()

    useEffect(() => {
        if (nodesInitialized) fitView().then()
    }, [fitView, nodesInitialized])

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            proOptions={{ hideAttribution: true }}
        >
            <Background color="hsl(var(--border))" variant={BackgroundVariant.Lines} />
        </ReactFlow>
    )
}
