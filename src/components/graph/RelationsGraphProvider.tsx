"use client"

import { ComponentType, PropsWithChildren, useCallback, useState } from "react"
import { RelationsGraphModal } from "@/components/graph/RelationsGraphModal"
import { NodeTypes, ReactFlowProvider } from "@xyflow/react"
import { RelationsGraphContext } from "./RelationsGraphContext"
import { ResultViewProps } from "@elastic/react-search-ui-views"
import { GraphNode } from "@/components/graph/GraphNode"
import { RelationsGraphOptions } from "@/components/graph/RelationsGraphOptions"

export function RelationsGraphProvider(
    props: PropsWithChildren<{ resultView: ComponentType<ResultViewProps>; dark?: boolean; nodeTypes?: NodeTypes }>
) {
    const [state, setState] = useState<{
        nodes: GraphNode[]
        options: RelationsGraphOptions
        isOpen: boolean
    }>({
        nodes: [],
        options: {},
        isOpen: false
    })

    const openRelationsGraph = useCallback((nodes: GraphNode[], options?: RelationsGraphOptions) => {
        setState({
            nodes,
            isOpen: true,
            options: options ?? {}
        })
    }, [])

    const openOrAddToRelationsGraph = useCallback((nodes: GraphNode[], options?: RelationsGraphOptions) => {
        setState((prev) => ({
            nodes: prev.nodes
                .concat(nodes)
                .reduce<GraphNode[]>((acc, node) => (acc.find((inner) => inner.id === node.id) ? acc : acc.concat(node)), []),
            isOpen: true,
            options: options ?? prev.options ?? {}
        }))
    }, [])

    const onRelationsGraphOpenChange = useCallback((isOpen: boolean) => {
        setState((prev) => ({ ...prev, isOpen }))
    }, [])

    const closeRelationsGraph = useCallback(() => {
        onRelationsGraphOpenChange(false)
    }, [onRelationsGraphOpenChange])

    return (
        <RelationsGraphContext.Provider value={{ openRelationsGraph, closeRelationsGraph, openOrAddToRelationsGraph }}>
            <ReactFlowProvider>
                <RelationsGraphModal
                    nodes={state.nodes}
                    isOpen={state.isOpen}
                    onOpenChange={onRelationsGraphOpenChange}
                    resultView={props.resultView}
                    options={state.options}
                    dark={props.dark}
                    nodeTypes={props.nodeTypes}
                />

                {props.children}
            </ReactFlowProvider>
        </RelationsGraphContext.Provider>
    )
}
