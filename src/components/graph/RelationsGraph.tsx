import { buildGraphForReferences, getLayoutedElements, ResultPID } from "@/components/graph/helpers"
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
import { useStore } from "zustand"
import { resultCache } from "@/lib/ResultCache"
import { ResultViewWrapper } from "@/components/graph/ResultViewWrapper"
import { ResultViewProps } from "@elastic/react-search-ui-views"

/**
 * Renders an interactive graph for the specified RelationNodes.
 */
export function RelationsGraph(props: { base: string; referencedBy: string[]; references: string[]; resultView: ComponentType<ResultViewProps> }) {
    const getFromCache = useStore(resultCache, (s) => s.get)

    const { initialEdges, initialNodes } = useMemo(() => {
        const base: ResultPID = { pid: props.base, result: getFromCache(props.base) }
        const referencedBy = props.referencedBy.map((pid) => ({ pid, result: getFromCache(pid) }))
        const references = props.references.map((pid) => ({ pid, result: getFromCache(pid) }))

        return buildGraphForReferences(base, referencedBy, references)
    }, [getFromCache, props.base, props.referencedBy, props.references])

    const nodeTypes = useMemo(() => {
        return {
            plain: (nodeProps: NodeProps) => <ResultViewWrapper {...nodeProps} resultView={props.resultView} />
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
                fitView({ nodes: [{ id: props.base }], duration: 200, padding: 1 })
                updateNodeInternals(nodes.map((n) => n.id))
            }, 100)
        })
    }, [nodes, edges, setNodes, setEdges, fitView, props.base, updateNodeInternals])

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
            <MiniMap zoomable pannable />
        </ReactFlow>
    )
}
