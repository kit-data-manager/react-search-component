import config from "../config/config.json"
import moment from "moment"

/**
 * This file abstracts most logic around the configuration of the Reference UI.
 *
 * Configuration is an important part of the "reusability" and "generic-ness" of
 * the Reference UI, but if you are using this app as a starting point for own
 * project, everything related to configuration can largely be thrown away. To
 * that end, this file attempts to contain most of that logic to one place.
 */

export function getConfig() {
    return config
}

function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

export function getFacetFields() {
    let facets = []
    let uniqueKeys = []
    for (const index of config.indices) {
        for (const facet of index.facets) {
            //check for potential duplicates
            if (!uniqueKeys.includes(facet.key)) {
                facets.push(facet)
                uniqueKeys.push(facet.key)
            }
        }
    }

    return facets
}

export function getSortFields() {
    return getConfig().sortFields || []
}

export function buildSearchOptionsFromConfig() {
    const config = getConfig()
    let index_names = []
    let allSearchFields = {}
    let allResultFields = {}

    for (const index of config.indices) {
        //store index name
        index_names.push(index.name)

        //obtain search fields
        allSearchFields = (index["searchFields"] || []).reduce(
            //accumulate from config.searchFields
            (acc, n) => {
                //initialize accumulator if acc is not available, yet
                acc = acc || {}
                //set n-element (n is resultFieldKey) in acc
                acc[n] = {}
                //return current acc to next iteration
                return acc
            },
            //set initial value to already collected fields
            allSearchFields
        )

        //build result fields for current index
        allResultFields = (index["resultFields"] || []).reduce(
            //accumulate from index.resultFields
            (acc, n) => {
                //initialize accumulator if acc is not available, yet
                acc = acc || {}
                //set n-element (n is resultFieldKey) in acc to result object to obtain raw value
                acc[n] = {
                    raw: {}
                    /*snippet: {
              size: 100,
              fallback: true
            }*/
                }
                //return current acc to next iteration
                return acc
            },
            //set initial value to already collected fields
            allResultFields
        )
    }

    const searchOptions = {}
    searchOptions.index_names = index_names
    searchOptions.search_fields = allSearchFields
    searchOptions.result_fields = allResultFields

    return searchOptions
}

export function buildFacetConfigFromConfig() {
    const config = getConfig()
    let allFacets = {}
    for (const index of config.indices) {
        allFacets = (index.facets || []).reduce((acc, n) => {
            acc = acc || {}
            if (n.hasOwnProperty("type") && n.type === "numeric") {
                buildNumericRangeFacetFromConfig(n, acc)
            } else if (n.hasOwnProperty("type") && n.type.startsWith("date_")) {
                buildDateRangeFacetFromConfig(n, acc)
            } else {
                //no specific range facet, use default arguments
                acc[n.key] = {
                    type: "value",
                    size: 100
                }
            }
            return acc
        }, allFacets)
    }

    return allFacets
}

function buildNumericRangeFacetFromConfig(facetConfig, accumulator) {
    let ranges = facetConfig.ranges
    //ranges are an array which each element in the format <X or X-Y or >Y
    let facetRanges = ranges.reduce((acc, n) => {
        acc = acc || []
        if (n.startsWith("<")) {
            let toValue = n.replace("<", "")
            acc.push({
                to: parseStringValueToNumber(toValue),
                name: n
            })
        } else if (n.startsWith(">")) {
            let fromValue = n.replace(">", "")
            acc.push({
                from: parseStringValueToNumber(fromValue),
                name: n
            })
        } else {
            let fromToValue = n.split("-")
            acc.push({
                from: parseStringValueToNumber(fromToValue[0]),
                to: parseStringValueToNumber(fromToValue[1]),
                name: n
            })
        }
        return acc
    }, undefined)

    accumulator[facetConfig.key] = {
        type: "range",
        ranges: facetRanges
    }
}

function parseStringValueToNumber(value) {
    if (value.includes(".")) {
        return parseFloat(value)
    }
    return parseInt(value)
}

function buildDateRangeFacetFromConfig(facetConfig, accumulator) {
    let ranges = []
    if (facetConfig["type"] === "date_year") {
        ranges = [
            {
                from: moment().format("yyyy"),
                name: "This Year"
            },
            {
                from: moment().subtract(2, "years").format("yyyy"),
                to: moment().subtract(1, "years").format("yyyy"),
                name: "Last Year"
            },
            {
                from: moment().subtract(3, "years").format("yyyy"),
                to: moment().subtract(2, "years").format("yyyy"),
                name: "2 years ago"
            },
            {
                to: moment().subtract(3, "years").format("yyyy"),
                name: "Older"
            }
        ]
    } else if (facetConfig["type"] === "date_time") {
        ranges = [
            {
                from: moment()
                    .month("January")
                    .date(1)
                    .hour(0)
                    .minute(0)
                    .second(0)
                    .format("YYYY-MM-DDTHH:mm:ss"),
                to: moment()
                    .month("December")
                    .date(31)
                    .hour(23)
                    .minute(59)
                    .second(59)
                    .format("YYYY-MM-DDTHH:mm:ss"),
                name: "This Year"
            },
            {
                from: moment()
                    .subtract(1, "years")
                    .month("January")
                    .date(1)
                    .hour(0)
                    .minute(0)
                    .second(0)
                    .format("YYYY-MM-DDTHH:mm:ss"),
                to: moment()
                    .subtract(1, "years")
                    .month("December")
                    .date(31)
                    .hour(23)
                    .minute(59)
                    .second(59)
                    .format("YYYY-MM-DDTHH:mm:ss"),
                name: "Last Year"
            },
            {
                from: moment()
                    .subtract(2, "years")
                    .month("January")
                    .date(1)
                    .hour(0)
                    .minute(0)
                    .second(0)
                    .format("YYYY-MM-DDTHH:mm:ss"),
                to: moment()
                    .subtract(2, "years")
                    .month("December")
                    .date(31)
                    .hour(23)
                    .minute(59)
                    .second(59)
                    .format("YYYY-MM-DDTHH:mm:ss"),
                name: "2 years ago"
            },
            {
                to: moment()
                    .subtract(3, "years")
                    .month("December")
                    .date(31)
                    .hour(23)
                    .minute(59)
                    .second(59)
                    .format("YYYY-MM-DDTHH:mm:ss"),
                name: "Older"
            }
        ]
    }

    accumulator[facetConfig.key] = {
        type: "range",
        ranges: ranges
    }
}

export function buildSortOptionsFromConfig() {
    const config = getConfig()
    return [
        {
            name: "Relevance",
            value: "",
            direction: ""
        },
        ...(config.sortFields || []).reduce((acc, sortField) => {
            acc.push({
                name: `${capitalizeFirstLetter(sortField)} ASC`,
                value: sortField,
                direction: "asc"
            })
            acc.push({
                name: `${capitalizeFirstLetter(sortField)} DESC`,
                value: sortField,
                direction: "desc"
            })
            return acc
        }, [])
    ]
}

export function buildAutocompleteQueryConfig() {
    const querySuggestFields = getConfig().querySuggestFields
    if (
        !querySuggestFields ||
        !Array.isArray(querySuggestFields) ||
        querySuggestFields.length === 0
    ) {
        return {}
    }

    return {
        suggestions: {
            types: {
                documents: {
                    fields: getConfig().querySuggestFields
                }
            }
        }
    }
}
