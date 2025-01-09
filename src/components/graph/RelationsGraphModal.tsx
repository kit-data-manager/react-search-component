import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { RelationsGraph } from "@/components/graph/RelationsGraph"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"
import { RelationNode } from "@/lib/RelationNode"
import { useCallback, useContext } from "react"
import { FairDOSearchContext } from "@/components/FairDOSearchContext"

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
    const searchContext = useContext(FairDOSearchContext)

    const localSearchFor = useCallback(
        (query: string) => {
            onOpenChange(false)
            searchContext.searchFor(query)
        },
        [onOpenChange, searchContext]
    )

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className=" p-0 min-w-[500px] max-w-[min(calc(100vw-40px),1500px)] h-max min-h-[500px] max-h-[min(100vh,800px)]">
                <VisuallyHidden.Root>
                    <DialogTitle>FDOs related to {base.label}</DialogTitle>
                </VisuallyHidden.Root>

                <FairDOSearchContext.Provider
                    value={{
                        searchFor: localSearchFor,
                        searchTerm: searchContext.searchTerm,
                        searchForBackground: searchContext.searchForBackground
                    }}
                >
                    <RelationsGraph base={base} referenced={referenced} />
                </FairDOSearchContext.Provider>
            </DialogContent>
        </Dialog>
    )
}
