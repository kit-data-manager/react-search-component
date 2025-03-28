import type { StorybookConfig } from "@storybook/react-vite"

const config: StorybookConfig = {
    stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)", "../src/**/*.mdx"],
    addons: ["@storybook/addon-essentials", "@storybook/addon-interactions", "@storybook/addon-themes", "@storybook/addon-docs"],
    framework: {
        name: "@storybook/react-vite",
        options: {}
    },
    staticDirs: [{ from: "../public", to: "/" }]
}
export default config
