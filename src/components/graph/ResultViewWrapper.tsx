import { Handle, NodeProps, Position } from "@xyflow/react"
import { ComponentType, useMemo } from "react"
import { ResultViewProps } from "@elastic/react-search-ui-views"

export function ResultViewWrapper({ resultView: ResultView, data, id }: NodeProps & { resultView: ComponentType<ResultViewProps> }) {
    const dataEmpty = useMemo(() => {
        return Object.keys(data).length === 0
    }, [data])

    return (
        <div className="rfs-w-[800px] -rfs-m-2">
            <Handle type="target" position={Position.Left} />
            {dataEmpty ? (
                <div className="rfs-m-2 rfs-p-4 rfs-rounded-lg rfs-bg-background rfs-border">{id}</div>
            ) : (
                <ResultView result={data} onClickLink={() => {}} />
            )}
            <Handle type="source" position={Position.Right} />
        </div>
    )
}
