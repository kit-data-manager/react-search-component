import type { RelationNode } from "@/lib/RelationNode"
import { FairDOSearchContext } from "@/components/FairDOSearchContext"
import { RelationsGraph } from "@/components/graph/RelationsGraph"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"
import { useCallback, useContext } from "react"

export function RelationsGraphModal({
    isOpen,
    onOpenChange,
    referencedBy,
    references,
    base
}: {
    isOpen: boolean
    onOpenChange: (val: boolean) => void
    referencedBy: RelationNode[]
    references: RelationNode[]
    base: RelationNode
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
            <DialogContent className="rfs-h-max rfs-max-h-[min(100vh,800px)] rfs-min-h-[500px] rfs-min-w-[500px] !rfs-max-w-[min(calc(100vw-40px),1500px)] rfs-p-0">
                <VisuallyHidden.Root>
                    <DialogTitle>
                        Relationship graph between {referencedBy.map((s) => s.label).join(", ")} and {references.map((s) => s.label).join(", ")}
                    </DialogTitle>
                </VisuallyHidden.Root>

                <FairDOSearchContext.Provider
                    value={{
                        searchFor: localSearchFor,
                        searchTerm: searchContext.searchTerm,
                        searchForBackground: searchContext.searchForBackground
                    }}
                >
                    <RelationsGraph referencedBy={referencedBy} references={references} base={base} />
                </FairDOSearchContext.Provider>
            </DialogContent>
        </Dialog>
    )
}
