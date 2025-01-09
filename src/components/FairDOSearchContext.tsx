"use client"

import type { ResponseState } from "@elastic/search-ui"
import type ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector"
import { createContext } from "react"

/**
 * Extends the elasticsearch SearchContext with additional utilities
 */
export interface FairDOSearchContext {
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
    searchForBackground: (query: string) => Promise<ResponseState | undefined>

    /**
     * The current search term
     */
    searchTerm: string

    elasticConnector?: ElasticsearchAPIConnector
}

/**
 * Extends the elasticsearch SearchContext with additional utilities
 */
export const FairDOSearchContext = createContext<FairDOSearchContext>({
    searchFor: () => {
        console.error(`FairDOSearchContext not mounted, but searchFor was executed`)
    },
    searchTerm: "",
    get elasticConnector() {
        return undefined
    },
    async searchForBackground(): Promise<ResponseState | undefined> {
        console.error(`FairDOSearchContext not mounted, but searchFor was executed`)
        return undefined
    }
})
