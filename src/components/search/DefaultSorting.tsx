import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { SearchContext } from "@elastic/react-search-ui"
import { ArrowUpDown } from "lucide-react"
import { FairDOSearchContext } from "@/components/FairDOSearchContext"
import { SearchState, SortOption } from "@elastic/search-ui"

export function DefaultSorting() {
    const [value, setValue] = useState("")
    const search = useContext(SearchContext)
    const { config } = useContext(FairDOSearchContext)

    const handleChange = useCallback(
        (value: string) => {
            setValue(value)
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

    const makeKey = useCallback((item: SortOption) => {
        return `${item.direction}-${item.field}`
    }, [])

    const defaultSortOption = useMemo(() => {
        return config.sortOptions?.find((elem) => elem.default)
    }, [config.sortOptions])

    // Set default sorting on first load
    useEffect(() => {
        if (defaultSortOption && value === "") {
            const value = makeKey(defaultSortOption)
            setValue(value)
            // Call to setValue does not trigger onValueChange
            handleChange(value)
        }
    }, [defaultSortOption, handleChange, makeKey, value])

    // Update sort dropdown if the sortList changed from the drivers side
    useEffect(() => {
        const handler = ({ sortList }: SearchState) => {
            if (sortList && sortList.length === 1) {
                const sorting = sortList[0]
                const sortingValue = makeKey(sorting)
                setValue(sortingValue)
            }
        }

        search.driver.subscribeToStateChanges(handler)

        return () => search.driver.unsubscribeToStateChanges(handler)
    }, [makeKey, search.driver])

    console.log("haha")

    if (!config.sortOptions || config.sortOptions.length === 0) return null

    return (
        <Select value={value} onValueChange={handleChange}>
            <SelectTrigger className="rfs-max-w-[400px]">
                <div className="rfs-flex rfs-items-center rfs-gap-2">
                    <ArrowUpDown className={"rfs-size-4"} />
                    <SelectValue />
                </div>
            </SelectTrigger>
            <SelectContent>
                {config.sortOptions.map((item) => (
                    <SelectItem className="rfs-flex rfs-items-center" key={makeKey(item)} value={makeKey(item)}>
                        {item.label ?? (item.field + " " + item.direction === "asc" ? " (ascending)" : " (descending)")}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
