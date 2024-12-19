import {
    NodeProps,
    ReactFlow,
    Handle,
    Position,
    useNodesState,
    useEdgesState,
    useReactFlow,
    useNodesInitialized,
    Background,
    BackgroundVariant
} from "@xyflow/react"

import "@xyflow/react/dist/style.css"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button.tsx"
import { ExternalLink, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge.tsx"

function PlainNode(data: NodeProps) {
    const [expand, setExpand] = useState(false)

    const toggleExpand = useCallback(() => {
        setExpand((v) => !v)
    }, [])

    return (
        <>
            <Handle type="target" position={Position.Left} />
            <div
                className={`border border-border bg-background rounded-lg grid transition-all ${expand ? "grid-rows-[auto_1fr] shadow-lg" : "grid-rows-[auto_0fr]"}`}
            >
                <div onClick={toggleExpand} className="p-4">
                    <div className="flex gap-3 items-centers">
                        <Badge>FDO</Badge>
                        <div className="font-semibold">{data.data.pid as string}</div>
                    </div>
                </div>
                <div className="overflow-hidden">
                    <div className="flex justify-around p-4 pt-0">
                        <Button size="sm" variant="secondary">
                            <Search className="w-4 h-4" /> Find
                        </Button>
                        <Button size="sm">
                            <ExternalLink className="w-4 h-4" /> Open
                        </Button>
                    </div>
                </div>
            </div>
            <Handle type="source" position={Position.Right} id="a" />
        </>
    )
}

function buildGraphForReferences(basePid: string, referencedPids: string[]) {
    const yStart = -((referencedPids.length - 1) * 100) / 2
    const nodes = [{ id: "base", type: "plain", position: { x: 0, y: 0 }, data: { pid: basePid } }]
    const edges: { id: string; source: string; target: string }[] = []

    for (let i = 0; i < referencedPids.length; i++) {
        nodes.push({
            id: `ref-${i}`,
            type: "plain",
            position: { x: 800, y: yStart + i * 100 },
            data: { pid: referencedPids[i] }
        })
        edges.push({ id: `base-ref-${i}`, source: "base", target: `ref-${i}` })
    }

    return { initialNodes: nodes, initialEdges: edges }
}

const nodeTypes = {
    plain: PlainNode
}

export function RelationsGraph(props: { basePid: string; referencedPids: string[] }) {
    const { initialEdges, initialNodes } = useMemo(() => {
        return buildGraphForReferences(props.basePid, props.referencedPids)
    }, [props.basePid, props.referencedPids])

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
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
            <Background color="#f5f5f5" variant={BackgroundVariant.Lines} />
        </ReactFlow>
    )
}
