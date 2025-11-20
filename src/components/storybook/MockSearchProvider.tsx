import { SearchContext } from "@elastic/react-search-ui"
import { SearchDriver } from "@elastic/search-ui"
import { PropsWithChildren } from "react"

/**
 * Dirty hack to add a non-functional SearchContext to Storybook stories. Only required for making showcases work for GenericResultView and RelationsGraph.
 * Not used for testing, as it does not work at all.
 * @param props
 * @constructor
 */
export function MockSearchProvider(props: PropsWithChildren) {
    const fakeDriver = {
        getState() {},
        getActions() {},
        unsubscribeToStateChanges() {},
        subscribeToStateChanges() {}
    }

    return <SearchContext.Provider value={{ driver: fakeDriver as unknown as SearchDriver }}>{props.children}</SearchContext.Provider>
}
