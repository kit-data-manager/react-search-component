import { createContext } from "react"

/**
 * Extends the elasticsearch SearchContext with additional utilities
 */
export interface FairDOSearchContext {
    /**
     * Search for the specified string and scroll to the top of the page
     * @param query
     */
    searchFor(query: string): void

    /**
     * The current search term
     */
    searchTerm: string
}

/**
 * Extends the elasticsearch SearchContext with additional utilities
 */
export const FairDOSearchContext = createContext<FairDOSearchContext>({
    searchFor: () => {
        console.error(`FairDOSearchContext not mounted, but searchFor was executed`)
    },
    searchTerm: ""
})
