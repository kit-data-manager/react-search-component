import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCallback, useContext } from "react"
import { SearchContext } from "@elastic/react-search-ui"
import { ArrowUpDown } from "lucide-react"
import { FairDOSearchContext } from "@/components/FairDOSearchContext"

export function DefaultSorting() {
    const search = useContext(SearchContext)
    const { config } = useContext(FairDOSearchContext)

    const handleChange = useCallback(
        (value: string) => {
            if (value.startsWith("-")) {
                const field = value.replace("-", "")
                search.driver.setSort([{ field, direction: "" }], "")
            } else if (value.startsWith("asc-")) {
                const field = value.replace("asc-", "")
                search.driver.setSort([{ field, direction: "asc" }], "asc")
            } else {
                const field = value.replace("desc-", "")
                search.driver.setSort([{ field, direction: "desc" }], "desc")
            }
        },
        [search]
    )

    if (!config.sortOptions || config.sortOptions.length === 0) return null

    return (
        <Select onValueChange={handleChange}>
            <SelectTrigger className="rfs-max-w-[400px]">
                <div className="rfs-flex rfs-items-center rfs-gap-2">
                    <ArrowUpDown className={"rfs-size-4"} />
                    <SelectValue />
                </div>
            </SelectTrigger>
            <SelectContent>
                {config.sortOptions.map((item) => (
                    <SelectItem
                        className="rfs-flex rfs-items-center"
                        key={`${item.direction}-${item.field}`}
                        value={`${item.direction}-${item.field}`}
                    >
                        {item.label ?? (item.field + " " + item.direction === "asc" ? " (ascending)" : " (descending)")}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
