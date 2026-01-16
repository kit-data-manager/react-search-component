const PostCSSPrefixWrap = require("postcss-prefixwrap")

/**
 * Wrap the entire generate tailwind css file (index.css) in .rfs-root to prevent style conflicts with other tailwind styles
 * This would otherwise be problematic when embedding this component in a page that also uses tailwind with a different theme
 */

module.exports = {
    plugins: [PostCSSPrefixWrap(".rfs-root", { ignoredSelectors: [".dark", ":root:where(*)"] })]
}
