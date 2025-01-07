import { SearchX } from "lucide-react"
import { Button } from "@/components/ui/button.tsx"
import { useContext } from "react"
import { SearchContext } from "@elastic/react-search-ui"

export function ClearFilters() {
    const { driver } = useContext(SearchContext)

    return (
        <Button
            variant="link"
            className="text-muted-foreground w-full"
            onClick={() => driver.clearFilters()}
        >
            <SearchX className="w-4 h-4" /> Clear Filters
        </Button>
    )
}
