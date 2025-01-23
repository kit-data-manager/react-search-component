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
                className={`rfs-grid rfs-rounded-lg rfs-border rfs-border-border rfs-bg-background rfs-transition-all ${expand ? "rfs-grid-rows-[auto_1fr] rfs-shadow-lg" : "rfs-grid-rows-[auto_0fr]"}`}
            >
                <div onClick={toggleExpand} className="rfs-p-4">
                    <div className="rfs-items-centers rfs-flex rfs-gap-3">
                        <div className="rfs-flex rfs-items-center">
                            <Badge>{relationNode.tag ?? "FDO"}</Badge>
                        </div>
                        <div>
                            <div className="rfs-font-semibold">{relationNode.label}</div>
                            <div className={relationNode.label ? "rfs-text-sm rfs-text-muted-foreground" : ""}>{relationNode.id}</div>
                        </div>
                    </div>
                </div>
                <div className="rfs-overflow-hidden">
                    <div className="rfs-flex rfs-gap-4 rfs-p-4 rfs-pt-0">
                        {relationNode.searchQuery && (
                            <Button className="rfs-grow" onClick={executeFind}>
                                <Search className="rfs-size-4" /> Find
                            </Button>
                        )}

                        {relationNode.remoteURL && (
                            <a href={relationNode.remoteURL} target="_blank" rel="noopener noreferrer" className="rfs-grow">
                                <Button className="rfs-w-full" variant="secondary">
                                    <ExternalLink className="rfs-size-4" /> Open
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
