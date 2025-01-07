import { PidDisplay } from "@/components/result/PidDisplay.tsx"
import { PidResolver } from "@/lib/pidResolver.ts"

/**
 * @internal For debugging purposes
 * @param data
 * @constructor
 */
export function ObjectRender({ data }: { data: Record<string, unknown> }) {
    if ("raw" in data && typeof data.raw === "string") {
        if (PidResolver.isPID(data.raw)) {
            return <PidDisplay pid={data.raw} />
        } else return <div>{data.raw}</div>
    }

    return (
        <div className="break-words min-w-0">
            {Object.keys(data)
                .filter((k) => !k.startsWith("_"))
                .map((key) => (
                    <div key={key}>
                        <PidDisplay pid={key} />
                        <div className="pl-4">
                            {typeof data[key] === "object" ? (
                                <ObjectRender data={data[key] as Record<string, unknown>} />
                            ) : null}
                        </div>
                    </div>
                ))}
        </div>
    )
}
