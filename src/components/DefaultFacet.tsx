import { Checkbox } from "@/components/ui/checkbox.tsx"
import { Label } from "@/components/ui/label.tsx"
import { FacetViewProps } from "@elastic/react-search-ui-views"

export function DefaultFacet(props: FacetViewProps) {
    return (
        <div className="border border-secondary p-4 rounded-lg shadow">
            <div className="mb-2 text-sm font-bold">{props.label}</div>
            {props.options.map((option) => {
                const id = option.value.toString()
                return (
                    <div key={id} className="flex items-center p-1 pb-2 gap-2">
                        <Checkbox
                            id={id}
                            checked={option.selected}
                            onCheckedChange={(v) =>
                                v
                                    ? props.onSelect(option.value.toString())
                                    : props.onRemove(option.value.toString())
                            }
                        />
                        <Label htmlFor={id} className="grow">
                            {option.value.toString()}
                        </Label>
                        <div className="text-xs text-muted-foreground">{option.count}</div>
                    </div>
                )
            })}
        </div>
    )
}
