import { FairDOSearchContext } from "@/components/FairDOSearchContext"
import { RelationsGraph } from "@/components/graph/RelationsGraph"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"
import { ComponentType, useCallback, useContext } from "react"
import { ResultViewProps } from "@elastic/react-search-ui-views"
import { GraphNode } from "@/components/graph/GraphNode"
import { RelationsGraphOptions } from "@/components/graph/RelationsGraphOptions"

export function RelationsGraphModal({
    isOpen,
    onOpenChange,
    nodes,
    resultView,
    options
}: {
    isOpen: boolean
    onOpenChange: (val: boolean) => void
    nodes: GraphNode[]
    options?: RelationsGraphOptions
    resultView: ComponentType<ResultViewProps>
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
            <DialogContent className="rfs-h-max rfs-max-h-[min(100vh,800px)] rfs-min-h-[500px] rfs-min-w-[500px] !rfs-max-w-[min(calc(100vw-40px),1500px)] !rfs-p-0">
                <VisuallyHidden.Root>
                    <DialogTitle>Relationship graph</DialogTitle>
                </VisuallyHidden.Root>

                <FairDOSearchContext.Provider
                    value={{
                        searchFor: localSearchFor,
                        searchTerm: searchContext.searchTerm,
                        searchForBackground: searchContext.searchForBackground,
                        elasticConnector: searchContext.elasticConnector,
                        config: searchContext.config
                    }}
                >
                    <RelationsGraph nodes={nodes} resultView={resultView} options={options} />
                </FairDOSearchContext.Provider>
            </DialogContent>
        </Dialog>
    )
}
