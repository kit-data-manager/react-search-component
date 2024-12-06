import { InputViewProps } from "@elastic/react-search-ui-views"
import { ChevronDown, SearchIcon, SlidersHorizontal } from "lucide-react"
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
            <Input {...props.getInputProps()} className="pl-10 rounded-r-none border-r-0 h-11" />
            <Button {...props.getButtonProps()} className="rounded-none" size="lg">
                Search
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="icon" className="rounded-l-none h-full">
                        <ChevronDown className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>
                        <SlidersHorizontal className="w-4 h-4" /> Manuelle Suche mit SparQL
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
