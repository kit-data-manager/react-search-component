export interface RelationNode {
    id: string
    label: string
    tag?: string
    remoteURL?: string
    searchQuery?: string
    highlight?: boolean
}

export class BasicRelationNode implements RelationNode {
    remoteURL?: string
    searchQuery?: string

    constructor(
        public id: string,
        public tag: string = "",
        public label: string = "",
        public highlight: boolean = false
    ) {
        this.label = label ?? ""
        this.remoteURL = `https://hdl.handle.net/${id}`
        this.searchQuery = id
    }
}
