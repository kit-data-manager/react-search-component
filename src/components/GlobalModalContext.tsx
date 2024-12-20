import { createContext } from "react"
import { RelationNode } from "@/components/RelationsGraph.tsx"

export const GlobalModalContext = createContext<{
    openRelationGraph(base: RelationNode, referenced: RelationNode[]): void
}>({
    openRelationGraph: (): void => {
        throw "GlobalModalProvider not mounted"
    }
})
