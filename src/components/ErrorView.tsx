import React from "react"
import { CircleX } from "lucide-react"

export function ErrorView(props: {
    className?: string
    children?: React.ReactNode
    error: string
}) {
    if (props.error)
        return (
            <div className="flex flex-col items-center p-10">
                <CircleX className="w-12 h-12 mb-4" />
                <div className="font-extrabold">An error has occurred</div>
                <div className="text-sm mb-2">
                    FairDO Elastic Search encountered an unknown error. Please try to reload the
                    app.
                </div>
                <pre className="text-sm bg-secondary p-1">{props.error}</pre>
            </div>
        )

    return props.children
}
