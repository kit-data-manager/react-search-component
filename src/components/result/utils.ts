export function autoUnwrap<E>(item?: E | { raw?: E }) {
    if (!item) {
        return undefined
    } else if (typeof item === "string") {
        return item
    } else if (typeof item === "object" && "raw" in item) {
        return item.raw
    } else {
        return JSON.stringify(item)
    }
}

export function autoUnwrapArray<E>(item?: E[] | { raw?: E[] }) {
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

export function toArray<E>(element: E | E[]) {
    if (Array.isArray(element)) return element
    else return [element]
}
