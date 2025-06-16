import type { Preview } from "@storybook/react-vite"
import { withThemeByClassName } from "@storybook/addon-themes"

import "../src/index.css"
import { withRootClass } from "./decorators/RootClass"

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
        }),
        withRootClass
    ]
}

export default preview
