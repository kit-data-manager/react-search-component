import { PropsWithChildren, useCallback, useState } from "react"
import { RelationsGraphModal } from "@/components/graph/RelationsGraphModal.tsx"
import { GlobalModalContext } from "./GlobalModalContext.tsx"
import { ReactFlowProvider } from "@xyflow/react"
import { RelationNode } from "@/components/graph/RelationsGraph.tsx"

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
            base: base,
            referenced: referenced,
            isOpen: true
        })
    }, [])

    const onRelationGraphOpenChange = useCallback((isOpen: boolean) => {
        setRelationGraphState((prev) => ({ ...prev, isOpen }))
    }, [])

    return (
        <GlobalModalContext.Provider value={{ openRelationGraph }}>
            <ReactFlowProvider>
                <RelationsGraphModal
                    isOpen={relationGraphState.isOpen}
                    onOpenChange={onRelationGraphOpenChange}
                    base={relationGraphState.base}
                    referenced={relationGraphState.referenced}
                />

                {props.children}
            </ReactFlowProvider>
        </GlobalModalContext.Provider>
    )
}
