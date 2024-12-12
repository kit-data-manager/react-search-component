export function ObjectRender({ data }: { data: Record<string, unknown> }) {
    if ("raw" in data && typeof data.raw === "string") {
        return <div>{data.raw}</div>
    }

    return (
        <div>
            {Object.keys(data)
                .filter((k) => !k.startsWith("_"))
                .map((key) => (
                    <div key={key}>
                        <div>{key}</div>
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
