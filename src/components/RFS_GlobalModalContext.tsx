import type { RelationNode } from "@/lib/RelationNode"
import { createContext } from "react"

export const RFS_GlobalModalContext = createContext<{
    openRelationGraph: (base: RelationNode, referenced: RelationNode[]) => void
}>({
    openRelationGraph: (): void => {
        throw "GlobalModalProvider not mounted"
    }
})
