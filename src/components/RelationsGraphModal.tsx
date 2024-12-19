import { Dialog, DialogContent } from "@/components/ui/dialog.tsx"
import { RelationsGraph } from "@/components/RelationsGraph.tsx"

export function RelationsGraphModal({
    isOpen,
    onOpenChange,
    basePid,
    referencePids
}: {
    isOpen: boolean
    onOpenChange(val: boolean): void
    basePid: string
    referencePids: string[]
}) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className=" p-0 min-w-[500px] max-w-[min(100vw,1000px)] h-max min-h-[500px] max-h-[min(100vh,800px)]">
                <RelationsGraph basePid={basePid} referencedPids={referencePids} />
            </DialogContent>
        </Dialog>
    )
}
