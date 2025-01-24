export function autoUnwrap(item?: string | { raw?: string }) {
    if (!item) {
        return undefined
    } else if (typeof item === "string") {
        return item
    } else if (typeof item === "object" && "raw" in item && typeof item.raw === "string") {
        return item.raw
    } else {
        return JSON.stringify(item)
    }
}

export function autoUnwrapArray(item?: string[] | { raw?: string[] }) {
    if (!item) {
        return []
    }
    if (Array.isArray(item)) {
        return item
    } else if (typeof item === "object" && "raw" in item && Array.isArray(item.raw)) {
        return item.raw
    } else {
        return [JSON.stringify(item)]
    }
}
