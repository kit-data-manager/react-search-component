"use client"

import type { ComponentType, PropsWithChildren } from "react"
import { RelationsGraphModal } from "@/components/graph/RelationsGraphModal"
import { ReactFlowProvider } from "@xyflow/react"
import { useCallback, useState } from "react"
import { RFS_GlobalModalContext } from "./RFS_GlobalModalContext"
import { ResultViewProps } from "@elastic/react-search-ui-views"
import { GraphNode } from "@/components/graph/GraphNode"
import { RelationsGraphOptions } from "@/components/graph/RelationsGraphOptions"

export function GlobalModalProvider(props: PropsWithChildren<{ resultView: ComponentType<ResultViewProps> }>) {
    const [relationGraphState, setRelationGraphState] = useState<{
        nodes: GraphNode[]
        options: RelationsGraphOptions
        isOpen: boolean
    }>({
        nodes: [],
        options: {},
        isOpen: false
    })

    const openRelationGraph = useCallback((nodes: GraphNode[], options?: RelationsGraphOptions) => {
        setRelationGraphState({
            nodes,
            isOpen: true,
            options: options ?? {}
        })
    }, [])

    const onRelationGraphOpenChange = useCallback((isOpen: boolean) => {
        setRelationGraphState((prev) => ({ ...prev, isOpen }))
    }, [])

    return (
        <RFS_GlobalModalContext.Provider value={{ openRelationGraph }}>
            <ReactFlowProvider>
                <RelationsGraphModal
                    nodes={relationGraphState.nodes}
                    isOpen={relationGraphState.isOpen}
                    onOpenChange={onRelationGraphOpenChange}
                    resultView={props.resultView}
                    options={relationGraphState.options}
                />

                {props.children}
            </ReactFlowProvider>
        </RFS_GlobalModalContext.Provider>
    )
}
