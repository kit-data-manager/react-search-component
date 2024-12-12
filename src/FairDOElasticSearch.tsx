import { Layout } from "@elastic/react-search-ui-views"
import {
    ErrorBoundary,
    Facet,
    Paging,
    PagingInfo,
    Results,
    ResultsPerPage,
    SearchProvider,
    WithSearch,
    SearchBox
} from "@elastic/react-search-ui"
import { useMemo } from "react"
import { FairDOConfigProvider } from "./config/FairDOConfigProvider.ts"
import "./elastic-ui.css"
import { DefaultSearchBox } from "@/components/DefaultSearchBox.tsx"
import { DefaultFacet } from "@/components/DefaultFacet.tsx"
import { ClearFilters } from "@/components/ClearFilters.tsx"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select.tsx"
import { NMRResultView } from "@/components/NMRResultView.tsx"

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
                                        inputView={DefaultSearchBox}
                                    />
                                }
                                sideContent={
                                    <div>
                                        {facetFields.map((field) => (
                                            <Facet
                                                key={field.key}
                                                field={field.key}
                                                label={
                                                    field.label
                                                        ? field.label
                                                        : field.key.substring(0, 20)
                                                }
                                                view={DefaultFacet}
                                                isFilterable={field.isFilterable}
                                            />
                                        ))}
                                        <ClearFilters />
                                    </div>
                                }
                                bodyContent={
                                    <Results
                                        shouldTrackClickThrough={true}
                                        resultView={(props) => (
                                            <>
                                                <NMRResultView result={props.result} />
                                            </>
                                        )}
                                    />
                                }
                                bodyHeader={
                                    <div className="mb-4 flex justify-between w-full items-center">
                                        {wasSearched && (
                                            <PagingInfo
                                                view={(props) => (
                                                    <div>
                                                        Showing {props.start} - {props.end} out of{" "}
                                                        {props.totalResults}
                                                        {props.searchTerm &&
                                                            ` - Searching for "${props.searchTerm}"`}
                                                    </div>
                                                )}
                                            />
                                        )}
                                        {wasSearched && (
                                            <ResultsPerPage
                                                view={(props) => {
                                                    return (
                                                        <div className="flex items-center gap-2 h-full">
                                                            <div>Results per Page</div>
                                                            <Select
                                                                value={props.value + ""}
                                                                onValueChange={(v) =>
                                                                    props.onChange(parseInt(v))
                                                                }
                                                            >
                                                                <SelectTrigger className="w-[80px]">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {props.options?.map(
                                                                        (option) => {
                                                                            return (
                                                                                <SelectItem
                                                                                    value={
                                                                                        option + ""
                                                                                    }
                                                                                    key={option}
                                                                                >
                                                                                    {option}
                                                                                </SelectItem>
                                                                            )
                                                                        }
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    )
                                                }}
                                            />
                                        )}
                                    </div>
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
