import { CircleX } from "lucide-react"
import React from "react"

export function ErrorView(props: { className?: string; children?: React.ReactNode; error: string }) {
    if (props.error) {
        return (
            <div className="rfs-flex rfs-flex-col rfs-items-center rfs-p-10">
                <CircleX className="rfs-mb-4 rfs-size-12" />
                <div className="rfs-font-extrabold">An error has occurred</div>
                <div className="rfs-mb-2 rfs-text-sm">FairDO Elastic Search encountered an unknown error. Please try to reload the app.</div>
                <pre className="rfs-bg-secondary rfs-p-1 rfs-text-sm">{props.error}</pre>
            </div>
        )
    }

    return props.children
}
