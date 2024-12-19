import { createContext } from "react"

export const GlobalModalContext = createContext<{
    // eslint-disable-next-line no-unused-vars
    openRelationGraph(basePid: string, referencedPids: string[]): void
}>({
    openRelationGraph: (): void => {
        throw "GlobalModalProvider not mounted"
    }
})
