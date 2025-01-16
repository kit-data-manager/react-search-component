import type { FairDOConfigBuilder } from "@/config/FairDOConfigBuilder"
import type { FacetViewProps } from "@elastic/react-search-ui-views"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { PlusIcon, Search } from "lucide-react"
import { ComponentType, useEffect, useMemo, useRef, useState } from "react"
import { DefaultFacetOption } from "@/components/search/DefaultFacetOption"
import type { FacetValue } from "@elastic/search-ui"
import type { FairDOFacetConfig } from "@/config/FairDOConfig"

export interface OptionViewProps {
    option: FacetValue
    facetConfig: FairDOFacetConfig
    onSelect(v: string): void
    onRemove(v: string): void
}

export function DefaultFacet(props: FacetViewProps & { config: FairDOConfigBuilder; optionView?: ComponentType<OptionViewProps> }) {
    const [search, setSearch] = useState("")

    const selfConfig = useMemo(() => {
        return props.config.getFacetFields().find((f) => f.label === props.label)!
    }, [props.config, props.label])

    const onSearchDebounced = useRef(props.onSearch)
    useEffect(() => {
        onSearchDebounced.current = props.onSearch
    }, [props.onSearch])

    useEffect(() => {
        onSearchDebounced.current(search)
    }, [search])

    const ActualOptionView = useMemo(() => {
        return props.optionView ?? DefaultFacetOption
    }, [props.optionView])

    return (
        <div className="rounded-lg p-4">
            <div className="flex min-h-[40px] items-center justify-between">
                <div className="text-sm font-bold">{props.label}</div>
                {props.showSearch && (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant={search ? "default" : "ghost"} size="icon">
                                <Search className="size-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <Label>Filter durchsuchen...</Label>
                            <Input value={search} onChange={(e) => setSearch(e.target.value)} />
                        </PopoverContent>
                    </Popover>
                )}
            </div>

            {props.options.map((option) => (
                <ActualOptionView
                    key={option.value.toString()}
                    option={option}
                    facetConfig={selfConfig}
                    onSelect={props.onSelect}
                    onRemove={props.onRemove}
                />
            ))}

            {props.showMore ? (
                <Button className="p-1" onClick={props.onMoreClick} size="sm" variant="link">
                    <PlusIcon className="size-4" /> Show more
                </Button>
            ) : null}
        </div>
    )
}
