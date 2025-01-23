"use client"

import type { RelationNode } from "@/lib/RelationNode"
import type { PropsWithChildren } from "react"
import { RelationsGraphModal } from "@/components/graph/RelationsGraphModal"
import { ReactFlowProvider } from "@xyflow/react"
import { useCallback, useState } from "react"
import { RFS_GlobalModalContext } from "./RFS_GlobalModalContext"

export function GlobalModalProvider(props: PropsWithChildren) {
    const [relationGraphState, setRelationGraphState] = useState<{
        base: RelationNode
        referenced: RelationNode[]
        isOpen: boolean
    }>({
        base: { id: "", label: "" },
        referenced: [],
        isOpen: false
    })

    const openRelationGraph = useCallback((base: RelationNode, referenced: RelationNode[]) => {
        setRelationGraphState({
            base,
            referenced,
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
                    base={relationGraphState.base}
                    referenced={relationGraphState.referenced}
                />

                {props.children}
            </ReactFlowProvider>
        </RFS_GlobalModalContext.Provider>
    )
}
