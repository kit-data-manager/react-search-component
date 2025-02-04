import { PidResolver, pidResolver } from "@/lib/pidResolver"
import { memo, useCallback } from "react"
import { tempResolver } from "@/lib/TempResolver"
import useSWRImmutable from "swr/immutable"

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
            return tempResolver.resolvePurl(pid)
        } else if (pid.startsWith("https://spdx.org")) {
            return tempResolver.resolveSpdx(pid)
        } else {
            return pid
        }
    }, [])

    const { data, error } = useSWRImmutable(pid, resolveContent)

    return <span>{error ? pid : (data ?? "")}</span>
})
