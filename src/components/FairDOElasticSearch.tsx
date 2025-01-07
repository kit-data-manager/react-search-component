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
import { FairDOConfigProvider } from "@/config/FairDOConfigProvider"
import "../elastic-ui.css"
import { DefaultSearchBox } from "@/components/search/DefaultSearchBox"
import { DefaultFacet } from "@/components/search/DefaultFacet"
import { ClearFilters } from "@/components/search/ClearFilters"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { NMRResultView } from "@/components/result/NMRResultView"
import { ErrorView } from "@/components/search/ErrorView"
import { GlobalModalProvider } from "@/components/GlobalModalProvider"
import { SearchContextState } from "@elastic/search-ui"
import { LoaderCircle } from "lucide-react"
import { FairDOConfig } from "@/config/FairDOConfig"
import { FairDOSearchProvider } from "@/components/FairDOSearchProvider"

/**
 * All-in-one component for rendering an elastic search UI based on the provided configuration. Includes
 * an interactive graph of related records
 * @constructor
 */
export function FairDOElasticSearch({
    config: rawConfig,
    debug
}: {
    /**
     * Make sure the config is either memoized or constant (defined outside any components)
     */
    config: FairDOConfig
    debug?: boolean
}) {
    const config = useMemo(() => {
        return new FairDOConfigProvider(rawConfig)
    }, [rawConfig])

    const elasticConfig = useMemo(() => {
        return config.buildElasticSearchConfig()
    }, [config])

    const facetFields = useMemo(() => {
        return config.getFacetFields()
    }, [config])

    return (
        <SearchProvider config={elasticConfig}>
            <FairDOSearchProvider>
                <GlobalModalProvider>
                    <WithSearch
                        mapContextToProps={({ wasSearched, isLoading }: SearchContextState) => ({
                            wasSearched,
                            isLoading
                        })}
                    >
                        {({ wasSearched, isLoading }: SearchContextState) => {
                            return (
                                <ErrorBoundary view={ErrorView}>
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
                                                        view={(props) => (
                                                            <DefaultFacet
                                                                {...props}
                                                                config={config}
                                                            />
                                                        )}
                                                        isFilterable={field.isFilterable}
                                                    />
                                                ))}
                                                <ClearFilters />
                                            </div>
                                        }
                                        bodyContent={
                                            <>
                                                {isLoading && !wasSearched && (
                                                    <div className="flex justify-center">
                                                        <LoaderCircle className="w-6 h-6 animate-spin" />
                                                    </div>
                                                )}

                                                <Results
                                                    shouldTrackClickThrough={true}
                                                    resultView={(props) => (
                                                        <>
                                                            <NMRResultView
                                                                result={props.result}
                                                                debug={debug}
                                                            />
                                                        </>
                                                    )}
                                                />
                                            </>
                                        }
                                        bodyHeader={
                                            <div className="mb-4 flex justify-between w-full items-center">
                                                {wasSearched && (
                                                    <PagingInfo
                                                        view={(props) => (
                                                            <div>
                                                                Showing {props.start} - {props.end}{" "}
                                                                out of {props.totalResults}
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
                                                                            props.onChange(
                                                                                parseInt(v)
                                                                            )
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
                                                                                                option +
                                                                                                ""
                                                                                            }
                                                                                            key={
                                                                                                option
                                                                                            }
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
                </GlobalModalProvider>
            </FairDOSearchProvider>
        </SearchProvider>
    )
}
