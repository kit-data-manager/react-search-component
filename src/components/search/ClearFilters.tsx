import { Button } from "@/components/ui/button"
import { SearchContext } from "@elastic/react-search-ui"
import { SearchX } from "lucide-react"
import { useContext } from "react"

export function ClearFilters() {
    const { driver } = useContext(SearchContext)

    return (
        <Button
            variant="link"
            className="w-full text-muted-foreground"
            onClick={() => driver.clearFilters()}
        >
            <SearchX className="size-4" /> Clear Filters
        </Button>
    )
}
