import type { RelationNode } from "@/lib/RelationNode"

import { buildGraphForReferences, getLayoutedElements } from "@/components/graph/helpers"
import { PlainNode } from "@/components/graph/PlainNode"
import { Background, BackgroundVariant, ReactFlow, useEdgesState, useNodesInitialized, useNodesState, useReactFlow } from "@xyflow/react"
import { useCallback, useEffect, useMemo, useRef } from "react"
import "@xyflow/react/dist/style.css"

const nodeTypes = {
    plain: PlainNode
}

/**
 * Renders an interactive graph for the specified RelationNodes.
 */
export function RelationsGraph(props: { base: RelationNode; referencedBy: RelationNode[]; references: RelationNode[] }) {
    const { initialEdges, initialNodes } = useMemo(() => {
        return buildGraphForReferences(props.base, props.referencedBy, props.references)
    }, [props.base, props.referencedBy, props.references])

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
    const { fitView } = useReactFlow()
    const nodesInitialized = useNodesInitialized()

    const onLayout = useCallback(() => {
        const layouted = getLayoutedElements(nodes, edges)

        setNodes([...layouted.nodes])
        setEdges([...layouted.edges])

        window.requestAnimationFrame(() => {
            fitView()
        })
    }, [nodes, edges, setNodes, setEdges, fitView])

    const onLayoutDebounced = useRef(onLayout)
    useEffect(() => {
        onLayoutDebounced.current = onLayout
    }, [onLayout])

    useEffect(() => {
        if (nodesInitialized) {
            onLayoutDebounced.current()
        }
    }, [nodesInitialized])

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            proOptions={{ hideAttribution: true }}
        >
            <Background color="hsl(var(--rfs-border))" variant={BackgroundVariant.Lines} />
        </ReactFlow>
    )
}
