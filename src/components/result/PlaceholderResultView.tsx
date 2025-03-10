import { ResultViewProps } from "@elastic/react-search-ui-views"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ObjectRender } from "@/components/result/ObjectRender"

export function PlaceholderResultView(props: ResultViewProps) {
    return (
        <div className="rfs-border rfs-p-4 rfs-mb-2 rfs-rounded-lg rfs-space-y-2">
            <div>
                No result view has been specified. Please specify <code>resultView</code> or <code>resultViewPerIndex</code> on the{" "}
                <code>ReactSearchComponent</code> component
            </div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="secondary" size="sm">
                        Show raw result
                    </Button>
                </DialogTrigger>
                <DialogContent className="rfs-max-h-full rfs-max-w-[1000px] rfs-overflow-y-auto">
                    <ObjectRender data={props.result} />
                </DialogContent>
            </Dialog>
        </div>
    )
}
