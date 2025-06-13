import { Decorator } from "@storybook/react-vite"

export const withRootClass: Decorator = (Story) => {
    return (
        <div className="rfs-root">
            <Story />
        </div>
    )
}
