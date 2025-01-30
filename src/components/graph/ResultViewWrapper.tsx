import { Handle, NodeProps, Position } from "@xyflow/react"
import { ComponentType, useCallback, useContext, useMemo } from "react"
import { ResultViewProps } from "@elastic/react-search-ui-views"
import { FairDOSearchContext } from "@/components/FairDOSearchContext"
import { Button } from "@/components/ui/button"
import { SearchIcon } from "lucide-react"

export function ResultViewWrapper({ resultView: ResultView, data, id }: NodeProps & { resultView: ComponentType<ResultViewProps> }) {
    const dataEmpty = useMemo(() => {
        return Object.keys(data).length === 0
    }, [data])

    const { searchFor } = useContext(FairDOSearchContext)

    const searchForThis = useCallback(() => {
        searchFor(id)
    }, [id, searchFor])

    return (
        <div className="rfs-w-[800px] -rfs-m-2">
            <Handle type="target" position={Position.Left} />
            {dataEmpty ? (
                <div className="rfs-m-2 rfs-p-4 rfs-rounded-lg rfs-bg-background rfs-border rfs-flex rfs-justify-between rfs-items-center">
                    <div>
                        <div>{id}</div>
                        <div className="rfs-text-muted-foreground">Not found in cache, try searching for it</div>
                    </div>
                    <Button onClick={searchForThis}>
                        <SearchIcon className={"rfs-size-4 rfs-mr-1"} /> Search
                    </Button>
                </div>
            ) : (
                <ResultView result={data} onClickLink={() => {}} />
            )}
            <Handle type="source" position={Position.Right} />
        </div>
    )
}
