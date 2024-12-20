import { RelationNode } from "@/components/RelationsGraph.tsx"

export function basicRelationNode(pid: string): RelationNode {
    return {
        id: pid,
        label: "",
        remoteURL: "https://hdl.handle.net/" + pid,
        searchQuery: pid
    }
}
