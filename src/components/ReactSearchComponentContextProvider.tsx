import type { SearchConfig } from "@/lib/config/SearchConfig"
import type { SearchContextState } from "@elastic/search-ui"
import type { PropsWithChildren } from "react"
import { ReactSearchComponentContext } from "@/components/ReactSearchComponentContext"
import { WithSearch } from "@elastic/react-search-ui"
import { useCallback } from "react"
import { backgroundSearchQuery } from "@/lib/queries"

/**
 * Extends the elasticsearch SearchContext with additional functionality. This provider automatically
 * detects the SearchContext and uses it. When used outside a SearchContext, this provider silently does nothing.
 * @param props
 * @constructor
 */
export function ReactSearchComponentContextProvider(props: PropsWithChildren & { config: SearchConfig }) {
    const searchForBackground = useCallback(
        async (query: string) => {
            console.log("Background query")
            const res = await backgroundSearchQuery(props.config, query)

            return res.hits.hits
        },
        [props.config]
    )

    return (
        <WithSearch
            mapContextToProps={({ searchTerm, setSearchTerm, clearFilters, setSort }: SearchContextState) => ({
                searchTerm,
                setSearchTerm,
                clearFilters,
                setSort
            })}
        >
            {({ searchTerm, setSearchTerm, clearFilters, setSort }) => {
                return (
                    <ReactSearchComponentContext.Provider
                        value={{
                            searchTerm: searchTerm ?? "",
                            searchFor: (query: string) => {
                                if (clearFilters) clearFilters()
                                if (setSearchTerm) setSearchTerm(query)
                                if (setSort) setSort([{ field: "_score", direction: "desc" }], "desc")
                                window.scrollTo({
                                    top: 0,
                                    left: 0,
                                    behavior: "smooth"
                                })
                            },
                            searchForBackground,
                            config: props.config
                        }}
                    >
                        {props.children}
                    </ReactSearchComponentContext.Provider>
                )
            }}
        </WithSearch>
    )
}
