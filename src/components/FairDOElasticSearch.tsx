"use client"

import type { FairDOConfig } from "@/config/FairDOConfig"
import type { SearchContextState } from "@elastic/search-ui"
import { FairDOSearchProvider } from "@/components/FairDOSearchProvider"
import { GlobalModalProvider } from "@/components/GlobalModalProvider"
import { NMRResultView } from "@/components/result/NMRResultView"
import { ClearFilters } from "@/components/search/ClearFilters"
import { DefaultFacet, OptionViewProps } from "@/components/search/DefaultFacet"
import { DefaultSearchBox } from "@/components/search/DefaultSearchBox"
import { ErrorView } from "@/components/search/ErrorView"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FairDOConfigBuilder } from "@/config/FairDOConfigBuilder"
import { ErrorBoundary, Facet, Paging, PagingInfo, Results, ResultsPerPage, SearchBox, SearchProvider, WithSearch } from "@elastic/react-search-ui"
import { Layout, ResultViewProps } from "@elastic/react-search-ui-views"
import { LoaderCircle } from "lucide-react"
import { ComponentType, useMemo } from "react"
import "../index.css"
import "../elastic-ui.css"
import { TooltipProvider } from "./ui/tooltip"

/**
 * All-in-one component for rendering an elastic search UI based on the provided configuration. Includes
 * an interactive graph of related records
 * @constructor
 */
export function FairDOElasticSearch({
    config: rawConfig,
    debug,
    resultView,
    facetOptionView
}: {
    /**
     * Make sure the config is either memoized or constant (defined outside any components)
     */
    config: FairDOConfig
    resultView?: ComponentType<ResultViewProps>
    facetOptionView?: ComponentType<OptionViewProps>
    debug?: boolean
}) {
    const config = useMemo(() => {
        return new FairDOConfigBuilder(rawConfig)
    }, [rawConfig])

    const elasticConfig = useMemo(() => {
        return config.buildElasticSearchConfig()
    }, [config])

    const facetFields = useMemo(() => {
        return config.getFacetFields()
    }, [config])

    const actualResultView = useMemo(() => {
        return resultView ?? ((props: ResultViewProps) => <NMRResultView result={props.result} debug={debug} />)
    }, [debug, resultView])

    return (
        <SearchProvider config={elasticConfig}>
            <FairDOSearchProvider config={rawConfig}>
                <TooltipProvider>
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
                                                    autocompleteSuggestions
                                                    debounceLength={300}
                                                    searchAsYouType
                                                    inputView={DefaultSearchBox}
                                                />
                                            }
                                            sideContent={
                                                <div>
                                                    {facetFields.map((field) => (
                                                        <Facet
                                                            key={field.key}
                                                            field={field.key}
                                                            label={field.label ? field.label : field.key.substring(0, 20)}
                                                            view={(props) => <DefaultFacet {...props} config={config} optionView={facetOptionView} />}
                                                            isFilterable={field.isFilterable}
                                                        />
                                                    ))}
                                                    <ClearFilters />
                                                </div>
                                            }
                                            bodyContent={
                                                <>
                                                    {isLoading && !wasSearched && (
                                                        <div className="rfs-flex rfs-justify-center">
                                                            <LoaderCircle className="size-6 animate-spin" />
                                                        </div>
                                                    )}

                                                    <Results shouldTrackClickThrough resultView={actualResultView} />
                                                </>
                                            }
                                            bodyHeader={
                                                <div className="rfs-mb-4 rfs-flex rfs-w-full rfs-items-center rfs-justify-between">
                                                    {wasSearched && (
                                                        <PagingInfo
                                                            view={(props) => (
                                                                <div>
                                                                    Showing {props.start} -{props.end} out of {props.totalResults}
                                                                </div>
                                                            )}
                                                        />
                                                    )}
                                                    {/*{wasSearched && (
                                                    <Sorting
                                                        sortOptions={[
                                                            {
                                                                name: "Relevance",
                                                                value: "",
                                                                direction: ""
                                                            },
                                                            {
                                                                name: "Title",
                                                                value: "name.keyword",
                                                                direction: "asc"
                                                            },
                                                            {
                                                                name: "Image",
                                                                value: "locationPreview/Sample.keyword",
                                                                direction: "asc"
                                                            }
                                                        ]}
                                                    />
                                                )}*/}
                                                </div>
                                            }
                                            bodyFooter={
                                                <div className="rfs-flex rfs-items-center rfs-flex-col rfs-gap-2 md:rfs-grid rfs-grid-cols-[1fr_auto_1fr] rfs-w-full rfs-p-2">
                                                    <div />
                                                    <Paging />
                                                    {wasSearched && (
                                                        <ResultsPerPage
                                                            options={[20, 50, 100, 250]}
                                                            view={(props) => {
                                                                return (
                                                                    <div className="rfs-flex rfs-h-full rfs-items-center rfs-gap-2 rfs-justify-self-end">
                                                                        <div className="rfs-text-xs rfs-text-muted-foreground">Results per Page</div>
                                                                        <Select
                                                                            value={`${props.value}`}
                                                                            onValueChange={(v) => props.onChange(Number.parseInt(v))}
                                                                        >
                                                                            <SelectTrigger className="rfs-w-[80px]">
                                                                                <SelectValue />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                {props.options?.map((option) => {
                                                                                    return (
                                                                                        <SelectItem value={`${option}`} key={option}>
                                                                                            {option}
                                                                                        </SelectItem>
                                                                                    )
                                                                                })}
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                )
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            }
                                        />
                                    </ErrorBoundary>
                                )
                            }}
                        </WithSearch>
                    </GlobalModalProvider>
                </TooltipProvider>
            </FairDOSearchProvider>
        </SearchProvider>
    )
}
