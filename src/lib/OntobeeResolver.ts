import { ParsingClient } from "sparql-http-client"

export class OntobeeResolver {
    private client: ParsingClient

    constructor() {
        this.client = new ParsingClient({ endpointUrl: "https://sparql.hegroup.org/sparql", fetch: (a, b) => fetch(a, { ...b, mode: "no-cors" }) })
    }

    async parse(url: string) {
        try {
            const result = await this.client.query.select(`
            DEFINE sql:describe-mode "CBD"
            DESCRIBE <${url}>
            FROM <http://purl.obolibrary.org/obo/merged/CHMO>
        `)

            console.log(result)
        } catch (e) {
            console.error(e)
        }
    }
}

export const ontobeeResolver = new OntobeeResolver()
