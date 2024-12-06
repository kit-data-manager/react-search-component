export function ObjectRender({ data }: { data: Record<string, unknown> }) {
    return (
        <div>
            {Object.keys(data)
                .filter((k) => !k.startsWith("_"))
                .map((key) => (
                    <>
                        <div key={key}>{key}</div>
                        <div className="pl-4">
                            {typeof data[key] === "object" ? (
                                <ObjectRender data={data[key] as Record<string, unknown>} />
                            ) : null}
                        </div>
                    </>
                ))}
        </div>
    )
}
