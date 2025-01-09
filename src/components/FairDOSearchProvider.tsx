import { FairDOSearchContext } from "@/components/FairDOSearchContext"
import { PropsWithChildren, useCallback, useMemo } from "react"
import { WithSearch } from "@elastic/react-search-ui"
import { SearchContextState } from "@elastic/search-ui"
import { FairDOConfig } from "@/config/FairDOConfig"
import { FairDOConfigProvider } from "@/config/FairDOConfigProvider"
import { arrayToObjectEntries } from "@/lib/utils"

/**
 * Extends the elasticsearch SearchContext with additional functionality. This provider automatically
 * detects the SearchContext and uses it. When used outside a SearchContext, this provider silently does nothing.
 * @param props
 * @constructor
 */
export function FairDOSearchProvider(props: PropsWithChildren & { config: FairDOConfig }) {
    const connector = useMemo(() => {
        return new FairDOConfigProvider(props.config).buildConnector()
    }, [props.config])

    const searchForBackground = useCallback(
        (query: string) => {
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

    return (
        <WithSearch
            mapContextToProps={({
                searchTerm,
                setSearchTerm,
                clearFilters
            }: SearchContextState) => ({ searchTerm, setSearchTerm, clearFilters })}
        >
            {({ searchTerm, setSearchTerm, clearFilters }: SearchContextState) => {
                return (
                    <FairDOSearchContext.Provider
                        value={{
                            searchTerm: searchTerm ?? "",
                            searchFor: (query: string) => {
                                clearFilters()
                                setSearchTerm(query)
                                window.scrollTo({
                                    top: 0,
                                    left: 0,
                                    behavior: "smooth"
                                })
                            },
                            elasticConnector: connector,
                            searchForBackground
                        }}
                    >
                        {props.children}
                    </FairDOSearchContext.Provider>
                )
            }}
        </WithSearch>
    )
}
