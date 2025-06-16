import type { StorybookConfig } from "@storybook/react-vite"

const config: StorybookConfig = {
    stories: ["../src/stories/ReactSearchComponent.stories.tsx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)", "../src/**/*.mdx"],
    addons: ["@storybook/addon-themes", "@storybook/addon-docs"],
    framework: {
        name: "@storybook/react-vite",
        options: {}
    },
    staticDirs: [{ from: "../public", to: "/" }]
}
export default config
