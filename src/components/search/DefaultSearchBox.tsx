import type { InputViewProps } from "@elastic/react-search-ui-views"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { ChevronDown, ExternalLink, SearchIcon } from "lucide-react"

export function DefaultSearchBox(props: InputViewProps) {
    return (
        <div className="relative flex w-full max-w-[1300px] flex-col items-center gap-4 md:flex-row">
            <SearchIcon className="absolute left-4 top-3 size-4 text-muted-foreground md:top-auto" />
            <Input
                {...props.getInputProps()}
                placeholder="Search for something..."
                className="h-11 pl-10"
            />
            <div className="flex w-full items-center md:h-full md:w-auto">
                <Button {...props.getButtonProps()} className="grow rounded-r-none" size="lg">
                    Search
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            size="icon"
                            className="h-full rounded-l-none border-l border-l-background"
                        >
                            <ChevronDown className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <a href="https://metarepo.nffa.eu/start_query" target="_blank">
                            <DropdownMenuItem>
                                <ExternalLink className="size-4" /> Go to SparQL search
                            </DropdownMenuItem>
                        </a>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
