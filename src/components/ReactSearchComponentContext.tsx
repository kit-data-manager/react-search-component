"use client"

import { createContext } from "react"
import { SearchConfig } from "@/lib/config/SearchConfig"
import { estypes } from "@elastic/elasticsearch"

/**
 * Extends the elasticsearch SearchContext with additional utilities
 */
export interface ReactSearchComponentContext {
    /**
     * Search for the specified string and scroll to the top of the page. This will change the
     * search term to `query` and clear all filters
     * @param query
     */
    searchFor: (query: string) => void

    /**
     * Will query the elastic backend for the specified search term in the background. The UI is
     * not affected by this.
     * @param query
     * @return May return undefined if the elastic connector is not reachable (`SearchProvider` not mounted)
     */
    searchForBackground: (query: string) => Promise<estypes.SearchHit[] | undefined>

    /**
     * The current search term
     */
    searchTerm: string

    config: SearchConfig
}

/**
 * Extends the elasticsearch SearchContext with additional utilities
 */
export const ReactSearchComponentContext = createContext<ReactSearchComponentContext>({
    searchFor: () => {
        console.error(`ReactSearchComponentContext not mounted, but searchFor was executed`)
    },
    searchTerm: "",
    async searchForBackground(): Promise<estypes.SearchHit[] | undefined> {
        console.error(`ReactSearchComponentContext not mounted, but searchFor was executed`)
        return undefined
    },
    get config(): SearchConfig {
        throw "ReactSearchComponentContext not mounted, but tried to read config"
    }
})
