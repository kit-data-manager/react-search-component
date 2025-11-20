import { ReactSearchComponentContext } from "@/components/ReactSearchComponentContext"
import { RelationsGraph } from "@/components/graph/RelationsGraph"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"
import { ComponentType, useCallback, useContext } from "react"
import { ResultViewProps } from "@elastic/react-search-ui-views"
import { GraphNode } from "@/components/graph/GraphNode"
import { RelationsGraphOptions } from "@/components/graph/RelationsGraphOptions"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { NodeTypes } from "@xyflow/react"

export function RelationsGraphModal({
    isOpen,
    onOpenChange,
    nodes,
    resultView,
    options,
    dark,
    nodeTypes
}: {
    isOpen: boolean
    onOpenChange: (val: boolean) => void
    nodes: GraphNode[]
    options?: RelationsGraphOptions
    resultView: ComponentType<ResultViewProps>
    dark?: boolean
    nodeTypes?: NodeTypes
}) {
    const searchContext = useContext(ReactSearchComponentContext)

    const localSearchFor = useCallback(
        (query: string) => {
            onOpenChange(false)
            searchContext.searchFor(query)
        },
        [onOpenChange, searchContext]
    )

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="rfs:h-[calc(100vh-40px)] rfs:max-w-none rfs:w-[calc(100vw-40px)]! rfs:p-0!" hideCloseButton>
                <VisuallyHidden.Root>
                    <DialogTitle>Relationship graph</DialogTitle>
                </VisuallyHidden.Root>

                <ReactSearchComponentContext.Provider
                    value={{
                        searchFor: localSearchFor,
                        searchTerm: searchContext.searchTerm,
                        searchForBackground: searchContext.searchForBackground,
                        config: searchContext.config
                    }}
                >
                    <RelationsGraph nodes={nodes} resultView={resultView} options={options} dark={dark} nodeTypes={nodeTypes} />
                </ReactSearchComponentContext.Provider>

                <div className="rfs:absolute rfs:right-4 rfs:top-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        <X className="rfs:size-4" /> Close <span className="rfs:font-mono rfs:text-muted-foreground rfs:ml-2">Esc</span>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
