import type { Preview } from "@storybook/react"
import { withThemeByClassName } from "@storybook/addon-themes"

import "../src/index.css"

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i
            }
        },
        docs: {
            toc: true
        }
    },

    decorators: [
        withThemeByClassName({
            themes: {
                // nameOfTheme: 'classNameForTheme',
                light: "",
                dark: "dark"
            },
            defaultTheme: "light"
        })
    ]
}

export default preview
