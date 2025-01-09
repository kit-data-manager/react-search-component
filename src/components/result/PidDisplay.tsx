import { memo, useCallback } from "react"
import { PidResolver, pidResolver } from "@/lib/pidResolver"
import useSWR from "swr"

/**
 * Resolves a PID and displays the name of the received record
 * @param pid A valid PID
 * @constructor
 */
export const PidDisplay = memo(function PidDisplay({ pid }: { pid: string }) {
    const resolveContent = useCallback(async (pid: string) => {
        if (!PidResolver.isPID(pid)) {
            return pid
        } else {
            const content = await pidResolver.resolve(pid)
            return content.name
        }
    }, [])

    const { data, error } = useSWR(pid, resolveContent)

    if (error) return <div className="text-red-500">{JSON.stringify(error) || "Unknown error"}</div>

    return <span>{data ?? ""}</span>
})
