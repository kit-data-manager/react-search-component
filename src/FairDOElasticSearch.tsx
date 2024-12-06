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
import { Fragment, useMemo } from "react"
import { FairDOConfigProvider } from "./config/FairDOConfigProvider.ts"
import "@elastic/react-search-ui-views/lib/styles/styles.css"

export function FairDOElasticSearch({ config }: { config: FairDOConfigProvider }) {
    const elasticConfig = useMemo(() => {
        return config.buildElasticSearchConfig()
    }, [config])

    const facetFields = useMemo(() => {
        return config.getFacetFields()
    }, [config])

    return (
        <SearchProvider config={elasticConfig}>
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
                                        {facetFields.map((field) => (
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
