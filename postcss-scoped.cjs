/**
 * PostCSS plugin for rewriting some selectors in tailwindcss to prevent overspill of tailwind variables into the
 * surrounding application. There are more isolation mechanics in tailwind.config.js
 */

/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = (opts = {}) => ({
    postcssPlugin: "postcss-scoped",
    Once(root) {
        root.walkRules((rule) => {
            // Rewrite global variable declaration to be only present on elements inside .rfs-root
            if (rule.selector === "*, ::before, ::after") {
                rule.selectors = rule.selectors.map((s) => (s === "*" ? "*:where(.rfs-root,.rfs-root *)" : ":where(.rfs-root,.rfs-root *)" + s))
            }

            // Rewrite backdrop variable declaration to be only present on backdrops inside .rfs-root
            if (rule.selector === "::backdrop") {
                rule.selectors = rule.selectors.map((s) => ":where(.rfs-root,.rfs-root *)" + s)
            }
        })
    }
})

module.exports.postcss = true
