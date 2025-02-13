"use client"

import type { FairDOConfig } from "@/config/FairDOConfig"
import type { SearchContextState } from "@elastic/search-ui"
import { FairDOSearchProvider } from "@/components/FairDOSearchProvider"
import { GlobalModalProvider } from "@/components/GlobalModalProvider"
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
import { useAutoDarkMode } from "@/components/utils"
import { PlaceholderResultView } from "@/components/result/PlaceholderResultView"
import { DefaultSorting } from "@/components/search/DefaultSorting"

/**
 * All-in-one component for rendering an elastic search UI based on the provided configuration. Includes
 * an interactive graph of related records. Pass in a config object ({@link FairDOConfig}) to configure the search.
 *
 * #### ⚠️ Warning
 *
 * Make sure your configuration is memoized or defined outside any components
 *
 *
 * #### 🖌️ Customization
 * You can customize the default behaviour by overriding the default result view (resultView) or the views of the facet
 * options (facetOptionView)
 */
export function FairDOElasticSearch({
    config: rawConfig,
    resultView,
    facetOptionView,
    dark
}: {
    /**
     * Make sure the config is either memoized or constant (defined outside any components)
     */
    config: FairDOConfig
    resultView: ComponentType<ResultViewProps>
    facetOptionView?: ComponentType<OptionViewProps>

    /**
     * Set to true to enable dark mode. Alternatively, set class="dark" on your html or body element
     */
    dark?: boolean
}) {
    useAutoDarkMode(dark)

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
        return resultView ?? ((props: ResultViewProps) => <PlaceholderResultView {...props} />)
    }, [resultView])

    return (
        <SearchProvider config={elasticConfig}>
            <FairDOSearchProvider config={rawConfig}>
                <TooltipProvider>
                    <GlobalModalProvider resultView={actualResultView}>
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
                                                            filterType={field.filterType}
                                                        />
                                                    ))}
                                                    <ClearFilters />
                                                </div>
                                            }
                                            bodyContent={
                                                <>
                                                    {isLoading && !wasSearched && (
                                                        <div className="rfs-flex rfs-justify-center">
                                                            <LoaderCircle className="rfs-size-6 rfs-animate-spin" />
                                                        </div>
                                                    )}

                                                    <Results shouldTrackClickThrough resultView={actualResultView} />
                                                </>
                                            }
                                            bodyHeader={
                                                <div className="rfs-flex rfs-w-full rfs-items-center rfs-justify-between rfs-p-2">
                                                    {wasSearched && (
                                                        <PagingInfo
                                                            view={(props) => (
                                                                <div>
                                                                    Showing {props.start} -{props.end} out of {props.totalResults}
                                                                </div>
                                                            )}
                                                        />
                                                    )}
                                                    {wasSearched && <DefaultSorting />}
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
