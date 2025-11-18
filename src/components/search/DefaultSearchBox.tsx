import type { InputViewProps } from "@elastic/react-search-ui-views"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"

export function DefaultSearchBox(props: InputViewProps) {
    return (
        <div className="rfs:relative rfs:flex rfs:w-full rfs:max-w-[1300px] rfs:px-[15px] rfs:md:px-[calc(24px+0.5rem)] rfs:flex-col rfs:items-center rfs:gap-4 rfs:md:flex-row">
            <SearchIcon className="rfs:absolute rfs:left-7 rfs:md:left-12 rfs:top-3.5 rfs:size-4 rfs:text-muted-foreground rfs:md:top-auto" />
            <Input {...props.getInputProps()} placeholder="Search for something..." className="rfs:h-11 rfs:pl-10" />
            <div className="rfs:flex rfs:w-full rfs:items-center rfs:md:h-full rfs:md:w-auto">
                <Button {...props.getButtonProps()} variant="secondary" className="rfs:grow" size="lg">
                    Search
                </Button>
            </div>
        </div>
    )
}
