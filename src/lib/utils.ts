import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function arrayToObjectEntries(array: string[]) {
    const obj: Record<string, Record<never, never>> = {}
    for (const key in array) {
        obj[key] = {}
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
