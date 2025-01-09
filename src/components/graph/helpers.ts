import type { RelationNode } from "@/lib/RelationNode"

export function buildGraphForReferences(base: RelationNode, _referenced: RelationNode[]) {
    const referenced = _referenced.filter((pid) => pid !== base)
    const yStart = -((referenced.length - 1) * 100) / 2
    const nodes = [{ id: base.id, type: "plain", position: { x: 0, y: 0 }, data: { ...base } }]
    const edges: { id: string; source: string; target: string }[] = []

    for (let i = 0; i < referenced.length; i++) {
        nodes.push({
            id: referenced[i].id,
            type: "plain",
            position: { x: 1000, y: yStart + i * 100 },
            data: { ...referenced[i] }
        })
        edges.push({
            id: `e-${base.id}-${referenced[i].id}`,
            source: base.id,
            target: referenced[i].id
        })
    }

    return { initialNodes: nodes, initialEdges: edges }
}
