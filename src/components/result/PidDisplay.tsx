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
        // Hardcoded for NEP deployment, should be removed in the future if possible!
        if (pid === "21.T11981/935ad20c-e8f7-485d-8987-b4f22431ff4b") {
            return "chemotion-repository.net"
        } else if (pid === "21.T11981/352621cf-b0c6-4105-89a4-324f16cf7776") {
            return "nmrxiv.org"
        }

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
