import { FairDOSearchContext } from "@/components/FairDOSearchContext"
import { PropsWithChildren } from "react"
import { WithSearch } from "@elastic/react-search-ui"
import { SearchContextState } from "@elastic/search-ui"

/**
 * Extends the elasticsearch SearchContext with additional functionality. This provider automatically
 * detects the SearchContext and uses it. When used outside a SearchContext, this provider silently does nothing.
 * @param props
 * @constructor
 */
export function FairDOSearchProvider(props: PropsWithChildren) {
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
                            }
                        }}
                    >
                        {props.children}
                    </FairDOSearchContext.Provider>
                )
            }}
        </WithSearch>
    )
}
