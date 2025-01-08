import { InputViewProps } from "@elastic/react-search-ui-views"
import { ChevronDown, ExternalLink, SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

export function DefaultSearchBox(props: InputViewProps) {
    return (
        <div className="relative flex w-full items-center md:flex-row flex-col gap-4 max-w-[1300px]">
            <SearchIcon className="w-4 h-4 absolute left-4 md:top-auto top-3 text-muted-foreground" />
            <Input
                {...props.getInputProps()}
                placeholder="Search for something..."
                className="pl-10 h-11"
            />
            <div className="flex items-center md:h-full w-full md:w-auto">
                <Button {...props.getButtonProps()} className="rounded-r-none grow" size="lg">
                    Search
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            size="icon"
                            className="rounded-l-none h-full border-l-background border-l"
                        >
                            <ChevronDown className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <a href="https://metarepo.nffa.eu/start_query" target="_blank">
                            <DropdownMenuItem>
                                <ExternalLink className="w-4 h-4" /> Go to SparQL search
                            </DropdownMenuItem>
                        </a>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
