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
