import type { PIDData } from "@/lib/PIDDataType"
import { PIDDataSchema } from "@/lib/PIDDataType"

export class PidResolver {
    private readonly resolverUrl = "https://hdl.handle.net/"
    private cache: Map<string, PIDData | Promise<PIDData>> = new Map()

    async resolve(pid: string) {
        if (!PidResolver.isPID(pid)) {
            throw `Tried to resolve something that is not a pid ${pid}`
        }

        if (this.cache.has(pid)) {
            return this.cache.get(pid)!
        } else {
            const pidResolvePromise = new Promise<PIDData>((resolve, reject) => {
                this.resolveFromRemote(pid)
                    .then((resolved) => {
                        if (resolved) {
                            this.cache.set(pid, resolved)
                            resolve(resolved)
                        } else {
                            reject()
                        }
                    })
                    .catch(reject)
            })
            this.cache.set(pid, pidResolvePromise)
            return pidResolvePromise
        }
    }

    static isPID(text: string): boolean {
        return new RegExp("^([0-9A-Z])+.([0-9A-Z])+/([!-~])+$", "i").test(text)
    }

    private async resolveFromRemote(pid: string) {
        try {
            const request = await fetch(this.resolverUrl + pid)
            if (request.ok) {
                const data = await request.json()
                try {
                    return PIDDataSchema.parse(data)
                } catch (e) {
                    console.error(`Failed to parse response for resolve request of pid ${pid}`, e)
                    throw undefined
                }
            }
        } catch (e) {
            console.error(`Network request failed for parsing pid ${pid}`, e)
            throw undefined
        }
    }
}

export const pidResolver = new PidResolver()
