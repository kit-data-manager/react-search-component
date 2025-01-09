import { CircleX } from "lucide-react"
import React from "react"

export function ErrorView(props: {
    className?: string
    children?: React.ReactNode
    error: string
}) {
    if (props.error) {
        return (
            <div className="flex flex-col items-center p-10">
                <CircleX className="mb-4 size-12" />
                <div className="font-extrabold">An error has occurred</div>
                <div className="mb-2 text-sm">
                    FairDO Elastic Search encountered an unknown error. Please try to reload the
                    app.
                </div>
                <pre className="bg-secondary p-1 text-sm">{props.error}</pre>
            </div>
        )
    }

    return props.children
}
