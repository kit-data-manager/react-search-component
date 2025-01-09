import { createStore } from "zustand"

interface ResultCacheEntry {
    name: string
    pid: string
}

interface ResultCacheStore {
    cache: Map<string, ResultCacheEntry>
    get: (key: string) => ResultCacheEntry | undefined
    set: (key: string, value: ResultCacheEntry) => void
}

export const resultCache = createStore<ResultCacheStore>()((set, get) => ({
    cache: new Map(),
    set(key: string, value: ResultCacheEntry) {
        set(({ cache }) => {
            cache.set(key, value)
            return cache
        })
    },
    get(key: string) {
        return get().cache.get(key)
    }
}))
