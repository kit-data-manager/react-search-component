# react-search-component

[![Static Badge](https://img.shields.io/badge/npm-red?logo=npm)](https://www.npmjs.com/package/@kit-data-manager/react-search-component)
[![Node.js CI](https://github.com/kit-data-manager/react-search-component/actions/workflows/build.yml/badge.svg)](https://github.com/kit-data-manager/react-search-component/actions/workflows/build.yml)
![NPM Type Definitions](https://img.shields.io/npm/types/%40kit-data-manager%2Freact-search-component)

All-in-one, highly configurable React component for rendering an elastic search UI based on the provided configuration. Includes
an **interactive graph** of related records and **unique identifier resolving**.

> **Fair Digital Objects**\
> This component includes some useful (optional) features for FAIR DOs

This is an ESM Module intended for use in modern React applications. Make sure your bundler supports importing CSS files in JavaScript/TypeScript. Next.js is supported out of the box.

## Installation

```bash
  npm install @kit-data-manager/react-search-component
```

## Docs

[Visit the Storybook](https://kit-data-manager.github.io/react-search-component/?path=/docs/getting-started--docs) for examples and some documentation. For more documentation, consult the TypeScript typings.

## Quick Start

Refer to the Getting Started Guide in the Storybook

## Customization

### Result View

Most notably, the result view component should be customized. A `GenericResultView` Component is provided that should work
for some scenarious out of the box. Otherwise, you should implement your own Result View in React. For a starting point, feel
free to copy the code of `GenericResultView.ts`, though most of the customization should be thrown out to make it more lightweight.

### Generic Result View

Each field of the generic result view can be mapped to a field in the elastic search index. Additionally, you can specify multiple
tags from multiple different fields in the elastic index. Take a look at the Storybook for an example.

To map (parts of) the result before feeding it to the `GenericResultView`, you can define you own component that itself
uses the `GenericResultView` with modified data:

```typescript jsx
import { useMemo } from "react"
import { GenericResultView, ResultViewProps } from "@kit-data-manager/react-search-component"

export function MyResultView(props: ResultViewProps) {
    const mappedResult = useMemo(() => {
        const copy = structuredClone(props.result)
        copy.someProperty = copy.something + copy.somethingElse
        return copy
    }, [props.result])

    return <GenericResultView result={mappedResult} titleField={"someProperty"} />
}
```

Then simply pass your custom component to the search component.

### Styling

Styling is done using tailwind and css variables. Feel free to override these variables in your own CSS.
More information can be found in the Storybook.

## Contributing

Feedback and issue reports are welcome, simply [create an issue](https://github.com/kit-data-manager/react-search-component/issues/new) here on GitHub.

### Development

Install dependencies with

```bash
    npm install
```

Run development server with

```bash
    npm run storybook:dev
```
