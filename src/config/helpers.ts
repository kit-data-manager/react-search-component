export function parseStringValueToNumber(value: string) {
    if (value.includes(".")) {
        return Number.parseFloat(value)
    }
    return Number.parseInt(value)
}
