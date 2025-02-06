import type { Meta, StoryObj } from "@storybook/react"

import { DefaultFacet } from "@/components/search/DefaultFacet"
import { FairDOConfigBuilder } from "@/config/FairDOConfigBuilder"
import { TooltipProvider } from "@/components/ui/tooltip"
import { GlobalModalProvider } from "@/components/GlobalModalProvider"
import { GenericResultView } from "@/components/result"
import type { FairDOConfig } from "@/config/FairDOConfig"

const meta = {
    component: DefaultFacet
} satisfies Meta<typeof DefaultFacet>

export default meta

const demoConfig: FairDOConfig = {
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
                { label: "Pretty URLs", key: "facet2", prettyPrintURLs: true },
                { label: "With Pid Resolver", key: "facet3", usePidResolver: true }
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
                <GlobalModalProvider resultView={GenericResultView}>
                    <div className="rfs-max-w-60">
                        <Story />
                    </div>
                </GlobalModalProvider>
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
        config: new FairDOConfigBuilder(demoConfig)
    }
}

export const PrettyURL: Story = {
    decorators: [
        (Story) => (
            <TooltipProvider>
                <GlobalModalProvider resultView={GenericResultView}>
                    <div className="rfs-max-w-60">
                        <Story />
                    </div>
                </GlobalModalProvider>
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
        config: new FairDOConfigBuilder(demoConfig)
    }
}

export const WithPidResolver: Story = {
    decorators: [
        (Story) => (
            <TooltipProvider>
                <GlobalModalProvider resultView={GenericResultView}>
                    <div className="rfs-max-w-60">
                        <Story />
                    </div>
                </GlobalModalProvider>
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
        config: new FairDOConfigBuilder(demoConfig)
    }
}
