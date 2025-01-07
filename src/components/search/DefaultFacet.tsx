import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { FacetViewProps } from "@elastic/react-search-ui-views"
import { Button } from "@/components/ui/button"
import { PlusIcon, Search } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { useEffect, useMemo, useState } from "react"
import { FairDOConfigProvider } from "@/config/FairDOConfigProvider"

export function DefaultFacet(props: FacetViewProps & { config: FairDOConfigProvider }) {
    const [search, setSearch] = useState("")

    useEffect(() => {
        props.onSearch(search)
    }, [props, search])

    const selfConfig = useMemo(() => {
        return props.config.getFacetFields().find((f) => f.label === props.label)
    }, [props.config, props.label])

    const OptionsTextDisplay = useMemo(() => {
        return selfConfig?.optionsTextDisplay ?? ((props: { text: string }) => props.text)
    }, [selfConfig?.optionsTextDisplay])

    return (
        <div className="p-4 rounded-lg">
            <div className="flex justify-between items-center min-h-[40px]">
                <div className="text-sm font-bold">{props.label}</div>
                {props.showSearch && (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant={search ? "default" : "ghost"} size="icon">
                                <Search className="w-4 h-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <Label>Filter durchsuchen...</Label>
                            <Input value={search} onChange={(e) => setSearch(e.target.value)} />
                        </PopoverContent>
                    </Popover>
                )}
            </div>

            {props.options.map((option) => {
                const id = option.value.toString()
                return (
                    <div
                        key={id}
                        className="flex items-center p-1 pb-2 gap-2 max-w-full break-words"
                    >
                        <Checkbox
                            id={id}
                            checked={option.selected}
                            onCheckedChange={(v) =>
                                v
                                    ? props.onSelect(option.value.toString())
                                    : props.onRemove(option.value.toString())
                            }
                        />
                        <Label htmlFor={id} className="grow break-words min-w-0">
                            {option.value.toString() ? (
                                <OptionsTextDisplay text={option.value.toString()} />
                            ) : (
                                <span className="text-muted-foreground">None</span>
                            )}
                        </Label>
                        <div className="text-xs text-muted-foreground">{option.count}</div>
                    </div>
                )
            })}

            {props.showMore ? (
                <Button className="p-1" onClick={props.onMoreClick} size={"sm"} variant="link">
                    <PlusIcon className="w-4 h-4" /> Show more
                </Button>
            ) : null}
        </div>
    )
}
