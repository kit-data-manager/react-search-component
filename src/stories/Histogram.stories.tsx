import type { Meta, StoryObj } from "@storybook/react"

import { Histogram } from "@/components/Histogram"

const meta = {
    component: Histogram
} satisfies Meta<typeof Histogram>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
