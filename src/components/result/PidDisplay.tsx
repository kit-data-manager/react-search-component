import { PidResolver, pidResolver } from "@/lib/pidResolver"
import { memo, useCallback } from "react"
import useSWR from "swr"
import { ontobeeResolver } from "@/lib/OntobeeResolver"

/**
 * Resolves a PID and displays the name of the received record
 * @param pid A valid PID
 * @constructor
 */
export const PidDisplay = memo(function PidDisplay({ pid }: { pid: string }) {
    const resolveContent = useCallback(async (pid: string) => {
        if (PidResolver.isPID(pid)) {
            const content = await pidResolver.resolve(pid)
            return content.name
        } else if (pid.startsWith("http://purl.obolibrary.org")) {
            return ontobeeResolver.parse(pid)
        } else {
            return pid
        }
    }, [])

    const { data, error } = useSWR(pid, resolveContent)

    if (error) {
        return <div className="text-red-500">{JSON.stringify(error) || "Unknown error"}</div>
    }

    return <span>{data ?? ""}</span>
})
