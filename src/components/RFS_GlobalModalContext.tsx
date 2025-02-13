import { createContext } from "react"
import { GraphNode } from "@/components/graph/GraphNode"
import { RelationsGraphOptions } from "@/components/graph/RelationsGraphOptions"

export const RFS_GlobalModalContext = createContext<{
    openRelationGraph: (nodes: GraphNode[], options?: RelationsGraphOptions) => void
}>({
    openRelationGraph: (): void => {
        throw "GlobalModalProvider not mounted"
    }
})
