import type { RelationNode } from "@/lib/RelationNode"
import { FairDOSearchContext } from "@/components/FairDOSearchContext"
import { RelationsGraph } from "@/components/graph/RelationsGraph"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"
import { useCallback, useContext } from "react"

export function RelationsGraphModal({
    isOpen,
    onOpenChange,
    base,
    referenced
}: {
    isOpen: boolean
    onOpenChange: (val: boolean) => void
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
            <DialogContent className=" h-max max-h-[min(100vh,800px)] min-h-[500px] min-w-[500px] max-w-[min(calc(100vw-40px),1500px)] p-0">
                <VisuallyHidden.Root>
                    <DialogTitle>
                        FDOs related to
                        {base.label}
                    </DialogTitle>
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
