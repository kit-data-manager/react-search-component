import { Handle, NodeProps, Position } from "@xyflow/react"
import { useCallback, useContext, useMemo, useRef } from "react"
import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button.tsx"
import { ExternalLink, Search } from "lucide-react"
import { createStore, useStore } from "zustand"
import { RelationNode } from "@/components/RelationsGraph.tsx"
import { FairDOSearchContext } from "@/components/FairDOSearchContext.tsx"

interface PlainNodeStore {
    activeNodeLabel: string
    setActiveNodeLabel: (label: string) => void
    unsetActiveNodeLabel: (label: string) => void
}

const plainNodeStore = createStore<PlainNodeStore>()((set) => ({
    activeNodeLabel: "",
    setActiveNodeLabel: (label: string) => {
        set({ activeNodeLabel: label })
    },
    unsetActiveNodeLabel: (label: string) => {
        set((v) => ({ activeNodeLabel: v.activeNodeLabel === label ? "" : label }))
    }
}))

export function PlainNode(data: NodeProps) {
    const { searchFor } = useContext(FairDOSearchContext)

    const nodeLabel = useRef(Math.random() + "")
    const activeNodeLabel = useStore(plainNodeStore, (s) => s.activeNodeLabel)
    const setActiveNodeLabel = useStore(plainNodeStore, (s) => s.setActiveNodeLabel)
    const unsetActiveNodeLabel = useStore(plainNodeStore, (s) => s.unsetActiveNodeLabel)

    const relationNode = useMemo(() => {
        return data.data as unknown as RelationNode
    }, [data.data])

    const expand = useMemo(() => {
        return nodeLabel.current === activeNodeLabel
    }, [activeNodeLabel])

    const toggleExpand = useCallback(() => {
        if (expand) {
            unsetActiveNodeLabel(nodeLabel.current)
        } else {
            setActiveNodeLabel(nodeLabel.current)
        }
    }, [expand, setActiveNodeLabel, unsetActiveNodeLabel])

    const executeFind = useCallback(() => {
        if (relationNode.searchQuery) searchFor(relationNode.searchQuery)
    }, [relationNode.searchQuery, searchFor])

    return (
        <>
            <Handle type="target" position={Position.Left} />
            <div
                className={`border border-border bg-background rounded-lg grid transition-all ${expand ? "grid-rows-[auto_1fr] shadow-lg" : "grid-rows-[auto_0fr]"}`}
            >
                <div onClick={toggleExpand} className="p-4">
                    <div className="flex gap-3 items-centers">
                        <div className="flex items-center">
                            <Badge>FDO</Badge>
                        </div>
                        <div>
                            <div className="font-semibold">{relationNode.label}</div>
                            <div
                                className={
                                    relationNode.label ? "text-sm text-muted-foreground" : ""
                                }
                            >
                                {relationNode.id}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="overflow-hidden">
                    <div className="flex p-4 pt-0 gap-4">
                        {relationNode.searchQuery && (
                            <Button className="grow" variant="secondary" onClick={executeFind}>
                                <Search className="w-4 h-4" /> Find
                            </Button>
                        )}

                        {relationNode.remoteURL && (
                            <a
                                href={relationNode.remoteURL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="grow"
                            >
                                <Button className="w-full">
                                    <ExternalLink className="w-4 h-4" /> Open
                                </Button>
                            </a>
                        )}
                    </div>
                </div>
            </div>
            <Handle type="source" position={Position.Right} id="a" />
        </>
    )
}
