import type { RelationNode } from "@/lib/RelationNode"
import type { NodeProps } from "@xyflow/react"
import { FairDOSearchContext } from "@/components/FairDOSearchContext"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Handle, Position } from "@xyflow/react"
import { ExternalLink, Search } from "lucide-react"
import { useCallback, useContext, useMemo, useRef } from "react"
import { createStore, useStore } from "zustand"

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

/**
 * Renders a node for one elastic search entry in the relations graph
 * @param data Should contain the RelationNode that should be displayed in the `data` field
 * @constructor
 */
export function PlainNode(data: NodeProps) {
    const { searchFor } = useContext(FairDOSearchContext)

    const nodeLabel = useRef(`${Math.random()}`)
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
        if (relationNode.searchQuery) {
            searchFor(relationNode.searchQuery)
        }
    }, [relationNode.searchQuery, searchFor])

    return (
        <>
            <Handle type="target" position={Position.Left} />
            <div
                className={`grid rounded-lg border border-border bg-background transition-all ${expand ? "grid-rows-[auto_1fr] shadow-lg" : "grid-rows-[auto_0fr]"}`}
            >
                <div onClick={toggleExpand} className="p-4">
                    <div className="items-centers flex gap-3">
                        <div className="flex items-center">
                            <Badge>{relationNode.tag ?? "FDO"}</Badge>
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
                    <div className="flex gap-4 p-4 pt-0">
                        {relationNode.searchQuery && (
                            <Button className="grow" onClick={executeFind}>
                                <Search className="size-4" /> Find
                            </Button>
                        )}

                        {relationNode.remoteURL && (
                            <a
                                href={relationNode.remoteURL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="grow"
                            >
                                <Button className="w-full" variant="secondary">
                                    <ExternalLink className="size-4" /> Open
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
