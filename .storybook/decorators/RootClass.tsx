import { Decorator } from "@storybook/react"

export const withRootClass: Decorator = (Story) => {
    return (
        <div className="rfs-root">
            <Story />
        </div>
    )
}
