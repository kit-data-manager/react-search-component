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
import { PlainNode } from "@/components/graph/PlainNode"
import { RelationNode } from "@/lib/RelationNode"
import { buildGraphForReferences } from "@/components/graph/helpers"

const nodeTypes = {
    plain: PlainNode
}

/**
 * Renders an interactive graph for the specified RelationNodes.
 * @param props
 * @constructor
 */
export function RelationsGraph(props: {
    /**
     * Source of the relation
     */
    base: RelationNode
    /**
     * Targets of the relation. Will be connected to the base (source) only
     */
    referenced: RelationNode[]
}) {
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
