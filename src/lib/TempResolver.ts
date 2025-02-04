import { z } from "zod"

/**
 * !TODO Replace with resolver from pid-component
 */

const TS4TIBResponse = z.object({
    response: z.object({
        docs: z.object({ label: z.string(), iri: z.string() }).array()
    })
})

export class TempResolver {
    async resolvePurl(url: string) {
        try {
            const result = await fetch(`https://service.tib.eu/ts4tib/api/select?q=${url}`)
            const data = await result.json()
            const parsed = TS4TIBResponse.parse(data)
            const entry = parsed.response.docs.find((entry) => entry.iri === url)
            if (entry) return entry.label
            else {
                console.log("Found no matching entry", parsed.response.docs)
                return url
            }
        } catch (e) {
            console.error(e)
            return url
        }
    }

    async resolveSpdx(url: string) {
        try {
            const result = await fetch(url)
            const data = await result.json()
            console.log(data)
        } catch (e) {
            console.error(e)
            return url
        }
    }
}

export const tempResolver = new TempResolver()
