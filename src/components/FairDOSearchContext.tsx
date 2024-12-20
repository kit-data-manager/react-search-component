import { createContext } from "react"

export interface FairDOSearchContext {
    searchFor(query: string): void
    searchTerm: string
}

export const FairDOSearchContext = createContext<FairDOSearchContext>({
    searchFor: () => {
        console.error(`FairDOSearchContext not mounted, but searchFor was executed`)
    },
    searchTerm: ""
})
