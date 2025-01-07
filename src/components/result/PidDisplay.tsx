import { useCallback, useEffect, useState } from "react"
import { PidResolver, pidResolver } from "@/lib/pidResolver"

/**
 * Resolves a PID and displays the name of the received record
 * @param pid A valid PID
 * @constructor
 */
export function PidDisplay({ pid }: { pid: string }) {
    const [content, setContent] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<unknown>()

    const resolveContent = useCallback(async (pid: string) => {
        if (!PidResolver.isPID(pid)) {
            setContent(pid)
            setIsLoading(false)
        } else {
            try {
                const content = await pidResolver.resolve(pid)
                setContent(content.name)
                setIsLoading(false)
            } catch (e) {
                setError(e)
            }
        }
    }, [])

    useEffect(() => {
        resolveContent(pid).then()
    }, [pid, resolveContent])

    if (error) return <div className="text-red-500">{JSON.stringify(error) || "Unknown error"}</div>

    return <span>{!isLoading && content}</span>
}
