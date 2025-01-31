import { useEffect, useMemo } from "react"
import useSWRImmutable from "swr/immutable"

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
        if (error) console.log(error)
    }, [error])

    if (familyName && givenName) return givenName + " " + familyName
    return null
}
