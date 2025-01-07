import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog.tsx"
import { RelationNode, RelationsGraph } from "@/components/graph/RelationsGraph.tsx"
import { FairDOSearchContext } from "@/components/FairDOSearchContext.tsx"
import { useCallback, useContext } from "react"
import { SearchContext } from "@elastic/react-search-ui"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"

export function RelationsGraphModal({
    isOpen,
    onOpenChange,
    base,
    referenced
}: {
    isOpen: boolean
    onOpenChange(val: boolean): void
    base: RelationNode
    referenced: RelationNode[]
}) {
    const searchApi = useContext(SearchContext)

    const searchFor = useCallback(
        (query: string) => {
            onOpenChange(false)
            searchApi.driver.clearFilters()
            searchApi.driver.setSearchTerm(query)
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
        },
        [onOpenChange, searchApi.driver]
    )

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className=" p-0 min-w-[500px] max-w-[min(100vw,1000px)] h-max min-h-[500px] max-h-[min(100vh,800px)]">
                <VisuallyHidden.Root>
                    <DialogTitle>FDOs related to {base.label}</DialogTitle>
                </VisuallyHidden.Root>

                <FairDOSearchContext.Provider value={{ searchFor, searchTerm: "" }}>
                    <RelationsGraph base={base} referenced={referenced} />
                </FairDOSearchContext.Provider>
            </DialogContent>
        </Dialog>
    )
}
