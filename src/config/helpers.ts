export function parseStringValueToNumber(value: string) {
    if (value.includes(".")) {
        return parseFloat(value)
    }
    return parseInt(value)
}
