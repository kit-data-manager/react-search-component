import type { StorybookConfig } from "@storybook/react-vite"

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: ["@storybook/addon-essentials", "@chromatic-com/storybook", "@storybook/addon-interactions", "@storybook/addon-themes"],
    framework: {
        name: "@storybook/react-vite",
        options: {}
    },
    staticDirs: [{ from: "../public", to: "/" }]
}
export default config
