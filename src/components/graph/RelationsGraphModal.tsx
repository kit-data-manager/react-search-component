import { FairDOSearchContext } from "@/components/FairDOSearchContext"
import { RelationsGraph } from "@/components/graph/RelationsGraph"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"
import { ComponentType, useCallback, useContext } from "react"
import { ResultViewProps } from "@elastic/react-search-ui-views"
import { GraphNode } from "@/components/graph/GraphNode"
import { RelationsGraphOptions } from "@/components/graph/RelationsGraphOptions"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function RelationsGraphModal({
    isOpen,
    onOpenChange,
    nodes,
    resultView,
    options,
    dark
}: {
    isOpen: boolean
    onOpenChange: (val: boolean) => void
    nodes: GraphNode[]
    options?: RelationsGraphOptions
    resultView: ComponentType<ResultViewProps>
    dark?: boolean
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
            <DialogContent className="rfs-h-[calc(100vh-40px)] rfs-max-w-none rfs-w-[calc(100vw-40px)] !rfs-p-0" hideCloseButton>
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
                    <RelationsGraph nodes={nodes} resultView={resultView} options={options} dark={dark} />
                </FairDOSearchContext.Provider>

                <div className="rfs-absolute rfs-right-4 rfs-top-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        <X className="rfs-size-4" /> Close <span className="rfs-font-mono rfs-text-muted-foreground rfs-ml-2">Esc</span>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
