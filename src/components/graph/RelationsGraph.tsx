import { buildGraphForReferences, getLayoutedElements } from "@/components/graph/helpers"
import {
    Background,
    BackgroundVariant,
    Controls,
    MiniMap,
    NodeProps,
    ReactFlow,
    useEdgesState,
    useNodesInitialized,
    useNodesState,
    useReactFlow,
    useUpdateNodeInternals
} from "@xyflow/react"
import { ComponentType, useCallback, useEffect, useMemo, useRef } from "react"
import "@xyflow/react/dist/style.css"
import { ResultViewWrapper } from "@/components/graph/ResultViewWrapper"
import { ResultViewProps } from "@elastic/react-search-ui-views"
import { GraphNode } from "@/components/graph/GraphNode"
import { RelationsGraphOptions } from "@/components/graph/RelationsGraphOptions"

/**
 * Renders an interactive graph for the specified results. Results will be fetched from cache via PID. Currently intended for internal use only.
 */
export function RelationsGraph(props: { nodes: GraphNode[]; options?: RelationsGraphOptions; resultView: ComponentType<ResultViewProps> }) {
    const { initialEdges, initialNodes } = useMemo(() => {
        return buildGraphForReferences(props.nodes)
    }, [props.nodes])

    const nodeTypes = useMemo(() => {
        return {
            result: (nodeProps: NodeProps) => <ResultViewWrapper {...nodeProps} resultView={props.resultView} />
        }
    }, [props.resultView])

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
    const { fitView } = useReactFlow()
    const nodesInitialized = useNodesInitialized()
    const updateNodeInternals = useUpdateNodeInternals()

    useEffect(() => {
        setNodes(initialNodes)
        setEdges(initialEdges)
    }, [initialEdges, initialNodes, setEdges, setNodes])

    const onLayout = useCallback(() => {
        const layouted = getLayoutedElements(nodes, edges)

        setNodes([...layouted.nodes])
        setEdges([...layouted.edges])

        window.requestAnimationFrame(() => {
            setTimeout(() => {
                fitView({ nodes: props.options?.focusedNodes?.map((n) => ({ id: n })), duration: 200, padding: 1 })
                updateNodeInternals(nodes.map((n) => n.id))
            }, 100)
        })
    }, [nodes, edges, setNodes, setEdges, fitView, props.options?.focusedNodes, updateNodeInternals])

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
            <Controls />
            <MiniMap zoomable pannable position={"top-left"} />
        </ReactFlow>
    )
}
