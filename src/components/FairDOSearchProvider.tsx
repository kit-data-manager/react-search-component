import { FairDOSearchContext } from "@/components/FairDOSearchContext"
import { PropsWithChildren, useCallback, useContext } from "react"
import { SearchContext } from "@elastic/react-search-ui"

/**
 * Extends the elasticsearch SearchContext with additional functionality. This provider automatically
 * detects the SearchContext and uses it. When used outside a SearchContext, this provider silently does nothing.
 * @param props
 * @constructor
 */
export function FairDOSearchProvider(props: PropsWithChildren) {
    const s = useContext(SearchContext)

    const searchFor = useCallback(
        (query: string) => {
            if (!s) {
                console.warn("SearchContext not mounted in FairDOSearchProvider")
                return
            }
            s.driver.clearFilters()
            s.driver.setSearchTerm(query)
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth"
            })
        },
        [s]
    )

    return (
        <FairDOSearchContext.Provider
            value={{ searchTerm: s?.driver.searchQuery.searchTerm ?? "", searchFor }}
        >
            {props.children}
        </FairDOSearchContext.Provider>
    )
}
