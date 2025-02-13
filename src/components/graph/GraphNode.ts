export interface GraphNode {
    type: string
    id: string
    in: string[]
    out: string[]
    data?: Record<string, unknown>
}
