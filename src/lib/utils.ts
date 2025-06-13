import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function fieldOptionsToObject(array: (string | { field: string })[]) {
    const obj: Record<string, Record<string, unknown>> = {}
    for (const key of array) {
        if (typeof key === "string") {
            obj[key] = {}
        } else {
            obj[key.field] = key
        }
    }
    return obj
}

export function fieldOptionsToArray(array: (string | { field: string })[]) {
    const arr = []
    for (const key of array) {
        if (typeof key === "string") {
            arr.push(key)
        } else {
            arr.push(key.field)
        }
    }
    return arr
}

export function prettyPrintURL(url: string) {
    if (URL.canParse(url)) {
        const parsed = new URL(url)
        const path = parsed.pathname
        return parsed.hostname.replace("www.", "") + (path === "/" ? "" : path)
    } else return url
}

export function autoUnwrap<E>(item?: E | { raw?: E | undefined }) {
    if (item === undefined || item === null) {
        return undefined
    } else if (typeof item === "object") {
        if ("raw" in item) {
            return item.raw
        } else return JSON.stringify(item)
    } else return item
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

export function parseStringValueToNumber(value: string) {
    if (value.includes(".")) {
        return Number.parseFloat(value)
    }
    return Number.parseInt(value)
}

export function injectMeta(obj: { [key: string]: unknown }, index: string) {
    obj._meta = {
        rawHit: {
            _index: index
        }
    }
}
