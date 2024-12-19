import { PropsWithChildren, useCallback, useState } from "react"
import { RelationsGraphModal } from "@/components/RelationsGraphModal.tsx"
import { GlobalModalContext } from "./GlobalModalContext.tsx"
import { ReactFlowProvider } from "@xyflow/react"

export function GlobalModalProvider(props: PropsWithChildren) {
    const [relationGraphState, setRelationGraphState] = useState<{
        basePid: string
        referencedPids: string[]
        isOpen: boolean
    }>({
        basePid: "",
        referencedPids: [],
        isOpen: false
    })

    const openRelationGraph = useCallback((basePid: string, referencedPids: string[]) => {
        setRelationGraphState({
            basePid,
            referencedPids,
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
                    basePid={relationGraphState.basePid}
                    referencePids={relationGraphState.referencedPids}
                />

                {props.children}
            </ReactFlowProvider>
        </GlobalModalContext.Provider>
    )
}
