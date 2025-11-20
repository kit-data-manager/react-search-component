import { useEffect, useMemo } from "react"
import useSWRImmutable from "swr/immutable"
import { Skeleton } from "@/components/ui/skeleton"

async function orcidFetch(orcid: string) {
    const req = await fetch(`https://pub.orcid.org/v3.0/${orcid}`, {
        headers: {
            Accept: "application/json"
        }
    })
    return req.json()
}

export function OrcidDisplay({ orcid }: { orcid: string }) {
    const formattedOrcid = useMemo(() => {
        if (orcid.startsWith("https://orcid.org/")) return orcid.replace("https://orcid.org/", "")
        return orcid
    }, [orcid])

    const { data, error } = useSWRImmutable(formattedOrcid, orcidFetch)

    const familyName = useMemo(() => {
        if (!data) return null
        return data["person"]["name"]["family-name"]["value"]
    }, [data])

    const givenName = useMemo(() => {
        if (!data) return null
        return data["person"]["name"]["given-names"]["value"]
    }, [data])

    useEffect(() => {
        if (error) console.warn(`OrcidDisplay failed to resolve ${orcid}`, error)
    }, [error, orcid])

    if (familyName && givenName) return givenName + " " + familyName
    if (error) return orcid
    return <Skeleton className="rfs:h-4 rfs:w-14 rfs:bg-muted-foreground/10" />
}
