import { createContext } from "react"

export const RFS_GlobalModalContext = createContext<{
    openRelationGraph: (source: string[], base: string, target: string[]) => void
}>({
    openRelationGraph: (): void => {
        throw "GlobalModalProvider not mounted"
    }
})
