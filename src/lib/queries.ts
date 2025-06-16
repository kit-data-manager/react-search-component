import { SearchConfig } from "@/lib/config/SearchConfig"
import type { estypes } from "@elastic/elasticsearch"
import { SearchConfigBuilder } from "@/lib/config/SearchConfigBuilder"
import { SearchFieldConfiguration } from "@elastic/search-ui"

export async function relatedItemsQuery(
    config: SearchConfig,
    query: { index: string | string[]; term: string; amount: number; searchFields?: string[]; pidField?: string }
) {
    const body: estypes.SearchSearchRequestBody = {
        query: {
            bool: {
                should: [
                    {
                        multi_match: {
                            fields: weighted(query.searchFields ?? [query.pidField ?? "pid"]),
                            operator: "and",
                            query: query.term,
                            type: "best_fields"
                        }
                    },
                    {
                        multi_match: {
                            fields: weighted(query.searchFields ?? [query.pidField ?? "pid"]),
                            query: query.term,
                            type: "cross_fields"
                        }
                    },
                    {
                        multi_match: {
                            fields: weighted(query.searchFields ?? [query.pidField ?? "pid"]),
                            query: query.term,
                            type: "phrase"
                        }
                    },
                    {
                        multi_match: {
                            fields: weighted(query.searchFields ?? [query.pidField ?? "pid"]),
                            query: query.term,
                            type: "phrase_prefix"
                        }
                    }
                ]
            }
        },
        size: query.amount
    }

    const index = Array.isArray(query.index) ? query.index.join(",") : query.index
    const res = await fetch(config.host + "/" + index + "/_search", {
        body: JSON.stringify(body),
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `ApiKey ${config.apiKey}`
        }
    })

    return (await res.json()) as estypes.SearchResponseBody
}

export async function backgroundSearchQuery(config: SearchConfig, query: string) {
    const builtConfig = new SearchConfigBuilder(config)
    const body: estypes.SearchSearchRequestBody = {
        query: {
            bool: {
                should: [
                    {
                        multi_match: {
                            fields: weighted(builtConfig.getSearchOptions().search_fields ?? "undefined"),
                            operator: "and",
                            query: query,
                            type: "best_fields"
                        }
                    },
                    {
                        multi_match: {
                            fields: weighted(builtConfig.getSearchOptions().search_fields ?? "undefined"),
                            query: query,
                            type: "cross_fields"
                        }
                    },
                    {
                        multi_match: {
                            fields: weighted(builtConfig.getSearchOptions().search_fields ?? "undefined"),
                            query: query,
                            type: "phrase"
                        }
                    },
                    {
                        multi_match: {
                            fields: weighted(builtConfig.getSearchOptions().search_fields ?? "undefined"),
                            query: query,
                            type: "phrase_prefix"
                        }
                    }
                ]
            }
        },
        size: 20
    }

    const index = Array.isArray(config.indices) ? config.indices.join(",") : config.indices
    const res = await fetch(config.host + "/" + index + "/_search", {
        body: JSON.stringify(body),
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `ApiKey ${config.apiKey}`
        }
    })

    return (await res.json()) as estypes.SearchResponseBody
}

function weighted(field: string | string[] | Record<string, SearchFieldConfiguration>) {
    if (Array.isArray(field)) {
        return field.map((field) => field + "^1")
    } else if (typeof field === "object") {
        const fields = []
        for (const [name, config] of Object.entries(field)) {
            fields.push(name + "^" + config.weight)
        }
        return fields
    } else {
        return field + "^1"
    }
}
