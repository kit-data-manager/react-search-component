import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function arrayToObjectEntries(array: (string | { field: string })[]) {
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

export function tryURLPrettyPrint(url: string) {
    if (URL.canParse(url)) {
        const parsed = new URL(url)
        const path = parsed.pathname
        return parsed.hostname.replace("www.", "") + (path === "/" ? "" : path)
    } else return url
}
