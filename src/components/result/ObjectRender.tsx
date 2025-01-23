import { PidDisplay } from "@/components/result/PidDisplay"
import { PidResolver } from "@/lib/pidResolver"

/**
 * @internal
 * @param data
 * @constructor
 */
export function ObjectRender({ data }: { data: Record<string, unknown> }) {
    if ("raw" in data && typeof data.raw === "string") {
        if (PidResolver.isPID(data.raw)) {
            return <PidDisplay pid={data.raw} />
        } else {
            return <div>{data.raw}</div>
        }
    }

    return (
        <div className="rfs-min-w-0 rfs-break-words">
            {Object.keys(data)
                .filter((k) => !k.startsWith("_"))
                .map((key) => (
                    <div key={key}>
                        <div>{key}</div>
                        <div className="rfs-pl-4">
                            {typeof data[key] === "object" ? <ObjectRender data={data[key] as Record<string, unknown>} /> : null}
                        </div>
                    </div>
                ))}
        </div>
    )
}
