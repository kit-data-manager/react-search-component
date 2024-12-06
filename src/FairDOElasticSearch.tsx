import { Layout } from "@elastic/react-search-ui-views"
import {
    ErrorBoundary,
    Facet,
    Paging,
    PagingInfo,
    Results,
    ResultsPerPage,
    SearchProvider,
    Sorting,
    WithSearch,
    SearchBox
} from "@elastic/react-search-ui"
import { Fragment } from "react"
import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector"
import {
    buildAutocompleteQueryConfig,
    buildFacetConfigFromConfig,
    buildSearchOptionsFromConfig,
    getConfig,
    getFacetFields
} from "./config/config-helper.ts"
import "@elastic/react-search-ui-views/lib/styles/styles.css"

const searchOptions = buildSearchOptionsFromConfig()

const connector = new ElasticsearchAPIConnector({
    host: getConfig().host,
    index: searchOptions.index_names.join(",")
})

const config = {
    searchQuery: {
        facets: buildFacetConfigFromConfig(),
        ...buildSearchOptionsFromConfig()
    },
    autocompleteQuery: buildAutocompleteQueryConfig(),
    apiConnector: connector,
    alwaysSearchOnInitialLoad: true
}

export function FairDOElasticSearch() {
    return (
        <SearchProvider config={config}>
            <WithSearch mapContextToProps={({ wasSearched }) => ({ wasSearched })}>
                {({ wasSearched }) => {
                    return (
                        <ErrorBoundary>
                            <Layout
                                header={
                                    <SearchBox
                                        autocompleteMinimumCharacters={3}
                                        autocompleteResults={{
                                            linkTarget: "_blank",
                                            sectionTitle: "Results",
                                            titleField: "title",
                                            urlField: "url",
                                            shouldTrackClickThrough: true
                                        }}
                                        autocompleteSuggestions={true}
                                        debounceLength={0}
                                    />
                                }
                                sideContent={
                                    <div>
                                        {wasSearched && (
                                            <Sorting label={"Sort by"} sortOptions={[]} />
                                        )}
                                        {getFacetFields().map((field) => (
                                            <Facet
                                                key={field.key}
                                                field={field.key}
                                                label={
                                                    field.label
                                                        ? field.label
                                                        : field.key.substring(0, 20)
                                                }
                                            />
                                        ))}
                                    </div>
                                }
                                bodyContent={<Results shouldTrackClickThrough={true} />}
                                bodyHeader={
                                    <Fragment>
                                        {wasSearched && <PagingInfo />}
                                        {wasSearched && <ResultsPerPage />}
                                    </Fragment>
                                }
                                bodyFooter={<Paging />}
                            />
                        </ErrorBoundary>
                    )
                }}
            </WithSearch>
        </SearchProvider>
    )
}
