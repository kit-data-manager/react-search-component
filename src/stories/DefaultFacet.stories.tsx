import type { Meta, StoryObj } from "@storybook/react"

import { DefaultFacet } from "@/components/search/DefaultFacet"
import { SearchConfigBuilder } from "@/lib/config/SearchConfigBuilder"
import { TooltipProvider } from "@/components/ui/tooltip"
import type { SearchConfig } from "@/lib/config/SearchConfig"
import { PidNameDisplay } from "@/components/result"
import { prettyPrintURL } from "@/lib/utils"

const meta = {
    component: DefaultFacet
} satisfies Meta<typeof DefaultFacet>

export default meta

const demoConfig: SearchConfig = {
    debug: false,
    alwaysSearchOnInitialLoad: true,
    // host: "https://matwerk.datamanager.kit.edu/search-proxy/api/v1",
    host: "",
    apiKey: "",
    indices: [
        {
            name: "fdo-prod",
            facets: [
                { label: "My Facet", key: "facet1" },
                { label: "Pretty URLs", key: "facet2", singleValueMapper: (v) => prettyPrintURL(v + "") },
                { label: "With Pid Resolver", key: "facet3", singleValueMapper: (v) => <PidNameDisplay pid={v + ""} /> },
                { label: "Fully Custom", key: "facet4", singleValueMapper: (v) => <div className="rfs-bg-green-500 rfs-p-2">{v}</div> }
            ],
            resultFields: [], // Leave empty to get all fields
            searchFields: []
        }
    ]
}

type Story = StoryObj<typeof meta>

export const Default: Story = {
    decorators: [
        (Story) => (
            <TooltipProvider>
                <div className="rfs-max-w-60">
                    <Story />
                </div>
            </TooltipProvider>
        )
    ],
    args: {
        label: "My Facet",
        onMoreClick: () => {},
        onRemove: () => {},
        onChange: () => {},
        onSelect: () => {},
        options: [
            { count: 10, value: "First entry" },
            { count: 20, value: "Second entry" },
            { count: 30, value: "Third entry" },
            { count: 42, value: "Fourth entry" }
        ],
        showMore: false,
        values: [],
        showSearch: false,
        onSearch: () => {},
        searchPlaceholder: "",
        config: new SearchConfigBuilder(demoConfig)
    }
}

export const PrettyURL: Story = {
    decorators: [
        (Story) => (
            <TooltipProvider>
                <div className="rfs-max-w-60">
                    <Story />
                </div>
            </TooltipProvider>
        )
    ],
    args: {
        label: "Pretty URLs",
        onMoreClick: () => {},
        onRemove: () => {},
        onChange: () => {},
        onSelect: () => {},
        options: [
            { count: 10, value: "https://kit.edu/test" },
            { count: 20, value: "https://www.example.org/" }
        ],
        showMore: false,
        values: [],
        showSearch: false,
        onSearch: () => {},
        searchPlaceholder: "",
        config: new SearchConfigBuilder(demoConfig)
    }
}

export const WithPidResolver: Story = {
    decorators: [
        (Story) => (
            <TooltipProvider>
                <div className="rfs-max-w-60">
                    <Story />
                </div>
            </TooltipProvider>
        )
    ],
    args: {
        label: "With Pid Resolver",
        onMoreClick: () => {},
        onRemove: () => {},
        onChange: () => {},
        onSelect: () => {},
        options: [
            { count: 10, value: "21.T11148/010acb220a9c2c8c0ee6" },
            { count: 20, value: "21.T11148/ca9fd0b2414177b79ac2" }
        ],
        showMore: false,
        values: [],
        showSearch: false,
        onSearch: () => {},
        searchPlaceholder: "",
        config: new SearchConfigBuilder(demoConfig)
    }
}

export const FullyCustom: Story = {
    decorators: [
        (Story) => (
            <TooltipProvider>
                <div className="rfs-max-w-60">
                    <Story />
                </div>
            </TooltipProvider>
        )
    ],
    args: {
        label: "Fully Custom",
        onMoreClick: () => {},
        onRemove: () => {},
        onChange: () => {},
        onSelect: () => {},
        options: [
            { count: 10, value: "Value A" },
            { count: 20, value: "Value B" }
        ],
        showMore: false,
        values: [],
        showSearch: false,
        onSearch: () => {},
        searchPlaceholder: "",
        config: new SearchConfigBuilder(demoConfig)
    }
}
