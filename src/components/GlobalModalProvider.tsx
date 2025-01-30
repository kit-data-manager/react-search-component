"use client"

import type { ComponentType, PropsWithChildren } from "react"
import { RelationsGraphModal } from "@/components/graph/RelationsGraphModal"
import { ReactFlowProvider } from "@xyflow/react"
import { useCallback, useState } from "react"
import { RFS_GlobalModalContext } from "./RFS_GlobalModalContext"
import { ResultViewProps } from "@elastic/react-search-ui-views"

export function GlobalModalProvider(props: PropsWithChildren<{ resultView: ComponentType<ResultViewProps> }>) {
    const [relationGraphState, setRelationGraphState] = useState<{
        source: string[]
        target: string[]
        base: string
        isOpen: boolean
    }>({
        source: [],
        target: [],
        base: "",
        isOpen: false
    })

    const openRelationGraph = useCallback((source: string[], base: string, target: string[]) => {
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
                    resultView={props.resultView}
                />

                {props.children}
            </ReactFlowProvider>
        </RFS_GlobalModalContext.Provider>
    )
}
