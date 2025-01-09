export interface RelationNode {
    id: string
    label: string
    tag?: string
    remoteURL?: string
    searchQuery?: string
}

export class BasicRelationNode implements RelationNode {
    remoteURL?: string
    searchQuery?: string

    constructor(
        public id: string,
        public tag: string = "",
        public label: string = ""
    ) {
        this.label = label ?? ""
        this.remoteURL = "https://hdl.handle.net/" + id
        this.searchQuery = id
    }
}
