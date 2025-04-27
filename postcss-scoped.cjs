/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = (opts = {}) => ({
    postcssPlugin: "postcss-scoped",
    Once(root) {
        root.walkRules((rule) => {
            if (rule.selector === "*, ::before, ::after") {
                rule.selectors = rule.selectors.map((s) => (s === "*" ? "*:where(.rfs-root,.rfs-root *)" : ":where(.rfs-root,.rfs-root *)" + s))
            }

            if (rule.selector === "::backdrop") {
                rule.selectors = rule.selectors.map((s) => ":where(.rfs-root,.rfs-root *)" + s)
            }
        })
    }
})

module.exports.postcss = true
