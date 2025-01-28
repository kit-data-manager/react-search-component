"use client"

import type { RelationNode } from "@/lib/RelationNode"
import type { PropsWithChildren } from "react"
import { RelationsGraphModal } from "@/components/graph/RelationsGraphModal"
import { ReactFlowProvider } from "@xyflow/react"
import { useCallback, useState } from "react"
import { RFS_GlobalModalContext } from "./RFS_GlobalModalContext"

export function GlobalModalProvider(props: PropsWithChildren) {
    const [relationGraphState, setRelationGraphState] = useState<{
        source: RelationNode[]
        target: RelationNode[]
        base: RelationNode
        isOpen: boolean
    }>({
        source: [],
        target: [],
        base: { id: "", label: "" },
        isOpen: false
    })

    const openRelationGraph = useCallback((source: RelationNode[], base: RelationNode, target: RelationNode[]) => {
        setRelationGraphState({
            source,
            base,
            target,
            isOpen: true
        })
    }, [])

    const onRelationGraphOpenChange = useCallback((isOpen: boolean) => {
        setRelationGraphState((prev) => ({ ...prev, isOpen }))
    }, [])

    return (
        <RFS_GlobalModalContext.Provider value={{ openRelationGraph }}>
            <ReactFlowProvider>
                <RelationsGraphModal
                    isOpen={relationGraphState.isOpen}
                    onOpenChange={onRelationGraphOpenChange}
                    referencedBy={relationGraphState.source}
                    references={relationGraphState.target}
                    base={relationGraphState.base}
                />

                {props.children}
            </ReactFlowProvider>
        </RFS_GlobalModalContext.Provider>
    )
}
