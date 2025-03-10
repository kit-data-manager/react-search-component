import type { SearchConfig } from "@/lib/config/SearchConfig"
import type { SearchContextState } from "@elastic/search-ui"
import type { PropsWithChildren } from "react"
import { ReactSearchComponentContext } from "@/components/ReactSearchComponentContext"
import { SearchConfigBuilder } from "@/lib/config/SearchConfigBuilder"
import { arrayToObjectEntries } from "@/lib/utils"
import { WithSearch } from "@elastic/react-search-ui"
import { useCallback, useMemo } from "react"

/**
 * Extends the elasticsearch SearchContext with additional functionality. This provider automatically
 * detects the SearchContext and uses it. When used outside a SearchContext, this provider silently does nothing.
 * @param props
 * @constructor
 */
export function ReactSearchComponentContextProvider(props: PropsWithChildren & { config: SearchConfig }) {
    const connector = useMemo(() => {
        try {
            return new SearchConfigBuilder(props.config).buildConnector()
        } catch (e) {
            console.error("Failed to build connector in ReactSearchComponentContextProvider", e)
            return undefined
        }
    }, [props.config])

    const searchForBackground = useCallback(
        async (query: string) => {
            if (!connector) return

            // Hacky but works
            return connector.onSearch(
                { searchTerm: query, resultsPerPage: 20 },
                {
                    result_fields: arrayToObjectEntries(props.config.indices[0].resultFields),
                    searchTerm: query,
                    search_fields: arrayToObjectEntries(props.config.indices[0].searchFields),
                    resultsPerPage: 20
                }
            )
        },
        [connector, props.config.indices]
    )

    // Fallback for testing without elastic context
    if (!connector) {
        console.warn(
            "Using fallback context for ReactSearchComponentContextProvider as elastic config is invalid. Elastic-related features will not work."
        )
        return (
            <ReactSearchComponentContext.Provider
                value={{
                    searchTerm: "",
                    searchFor: () => {},
                    searchForBackground: async () => {
                        return undefined
                    },
                    config: props.config
                }}
            >
                {props.children}
            </ReactSearchComponentContext.Provider>
        )
    }

    return (
        <WithSearch
            mapContextToProps={({ searchTerm, setSearchTerm, clearFilters, setSort }: SearchContextState) => ({
                searchTerm,
                setSearchTerm,
                clearFilters,
                setSort
            })}
        >
            {({ searchTerm, setSearchTerm, clearFilters, setSort }: SearchContextState) => {
                return (
                    <ReactSearchComponentContext.Provider
                        value={{
                            searchTerm: searchTerm ?? "",
                            searchFor: (query: string) => {
                                clearFilters()
                                setSearchTerm(query)
                                setSort([{ field: "_score", direction: "desc" }], "desc")
                                window.scrollTo({
                                    top: 0,
                                    left: 0,
                                    behavior: "smooth"
                                })
                            },
                            elasticConnector: connector,
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
