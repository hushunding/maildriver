// tslint:disable-next-line:interface-name
export interface SaveNode {
    _nodeIndex?: number;
    _name: string;
    _parentIndex?: number;
    _isLeaf?: boolean;
    _fileSize?: number;
    _storeSize?: number;
    _fileIndex?: string;
}

// tslint:disable-next-line:interface-name
export interface SaveNodeApi {
    items: SaveNode[];
    total_count: number;
}
