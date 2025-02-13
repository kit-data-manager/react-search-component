import type { FairDOConfig } from "@/config/FairDOConfig"
import type { SearchContextState } from "@elastic/search-ui"
import type { PropsWithChildren } from "react"
import { FairDOSearchContext } from "@/components/FairDOSearchContext"
import { FairDOConfigBuilder } from "@/config/FairDOConfigBuilder"
import { arrayToObjectEntries } from "@/lib/utils"
import { WithSearch } from "@elastic/react-search-ui"
import { useCallback, useMemo } from "react"

/**
 * Extends the elasticsearch SearchContext with additional functionality. This provider automatically
 * detects the SearchContext and uses it. When used outside a SearchContext, this provider silently does nothing.
 * @param props
 * @constructor
 */
export function FairDOSearchProvider(props: PropsWithChildren & { config: FairDOConfig }) {
    const connector = useMemo(() => {
        try {
            return new FairDOConfigBuilder(props.config).buildConnector()
        } catch (e) {
            console.error("Failed to build connector in FairDOSearchProvider", e)
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
        console.warn("Using fallback context for FairDOSearchProvider as elastic config is invalid. Elastic-related features will not work.")
        return (
            <FairDOSearchContext.Provider
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
            </FairDOSearchContext.Provider>
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
                    <FairDOSearchContext.Provider
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
                    </FairDOSearchContext.Provider>
                )
            }}
        </WithSearch>
    )
}
