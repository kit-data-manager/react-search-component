import { InputViewProps } from "@elastic/react-search-ui-views"
import { ChevronDown, ExternalLink, SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input.tsx"
import { Button } from "@/components/ui/button.tsx"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx"

export function DefaultSearchBox(props: InputViewProps) {
    return (
        <div className="flex w-full items-center">
            <SearchIcon className="w-4 h-4 absolute left-4 text-muted-foreground" />
            <Input
                {...props.getInputProps()}
                placeholder="Search for something..."
                className="pl-10 mr-4 h-11"
            />
            <Button {...props.getButtonProps()} className="rounded-r-none" size="lg">
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
    )
}
