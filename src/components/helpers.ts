import { RelationNode } from "@/components/RelationsGraph.tsx"

export function basicRelationNode(pid: string, label?: string): RelationNode {
    return {
        id: pid,
        label: label ?? "",
        remoteURL: "https://hdl.handle.net/" + pid,
        searchQuery: pid
    }
}
