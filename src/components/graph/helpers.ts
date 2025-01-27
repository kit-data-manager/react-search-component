import type { RelationNode } from "@/lib/RelationNode"

export function buildGraphForReferences(source: RelationNode[], _referenced: RelationNode[]) {
    const referenced = _referenced.filter((pid) => !source.find((e) => e.id === pid.id))
    const yStartSource = -((source.length - 1) * 100) / 2
    const yStartReferenced = -((referenced.length - 1) * 100) / 2
    const nodes: { id: string; type: string; position: { x: number; y: number }; data: Record<string, unknown> }[] = []
    const edges: { id: string; source: string; target: string }[] = []

    for (let i = 0; i < source.length; i++) {
        nodes.push({
            id: source[i].id,
            type: "plain",
            position: { x: 0, y: yStartSource + i * 100 },
            data: { ...source[i] }
        })
    }

    for (let i = 0; i < referenced.length; i++) {
        nodes.push({
            id: referenced[i].id,
            type: "plain",
            position: { x: 1000, y: yStartReferenced + i * 100 },
            data: { ...referenced[i] }
        })
    }

    for (let x = 0; x < source.length; x++) {
        for (let y = 0; y < referenced.length; y++) {
            edges.push({
                id: `e-${source[x].id}-${referenced[y].id}`,
                source: source[x].id,
                target: referenced[y].id
            })
        }
    }

    return { initialNodes: nodes, initialEdges: edges }
}
