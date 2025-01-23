import type { InputViewProps } from "@elastic/react-search-ui-views"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { ChevronDown, ExternalLink, SearchIcon } from "lucide-react"

export function DefaultSearchBox(props: InputViewProps) {
    return (
        <div className="rfs-relative rfs-flex rfs-w-full rfs-max-w-[1300px] rfs-px-[15px] md:rfs-px-[calc(24px+0.5rem)] rfs-flex-col rfs-items-center rfs-gap-4 md:rfs-flex-row">
            <SearchIcon className="rfs-absolute rfs-left-12 rfs-top-3 rfs-size-4 rfs-text-muted-foreground md:rfs-top-auto" />
            <Input {...props.getInputProps()} placeholder="Search for something..." className="rfs-h-11 rfs-pl-10" />
            <div className="rfs-flex rfs-w-full rfs-items-center md:rfs-h-full md:rfs-w-auto">
                <Button {...props.getButtonProps()} className="rfs-grow rfs-rounded-r-none" size="lg">
                    Search
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="icon" className="rfs-h-full rfs-rounded-l-none rfs-border-l rfs-border-l-background">
                            <ChevronDown className="rfs-size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <a href="https://metarepo.nffa.eu/start_query" target="_blank">
                            <DropdownMenuItem>
                                <ExternalLink className="rfs-size-4" /> Go to SparQL search
                            </DropdownMenuItem>
                        </a>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
