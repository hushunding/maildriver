// 文件描述符

import * as path from 'path';
let _lastNodeIndex: number = 0;
// 获取最新的节点索引，获取一次即更新一次
export function LastNodeIndex() {
    return _lastNodeIndex++;
}
export function ReInitLastNodeIndex(n: number) {
    _lastNodeIndex = n;
}

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
export interface SaveIndex {
    _fileIndex: string;
    _locjson: string;
}
export abstract class SNode implements SaveNode {
    public static SnodeMap: Map<number, SNode> = null;
    protected _nodeIndex: number;
    protected _name: string;
    protected _parentIndex: number;
    protected _isLeaf: boolean;
    protected _fileSize: number;
    protected _storeSize: number;
    protected _fileIndex: string;
    protected _parent: FoldNode;
    constructor({ _nodeIndex, _name, _parentIndex, _isLeaf, _fileSize, _storeSize, _fileIndex,
        _parent }: SaveNode & { _parent: FoldNode }) {

        this._nodeIndex = _nodeIndex >= 0 ? _nodeIndex : LastNodeIndex();
        this._name = _name;
        this._isLeaf = _isLeaf;
        this._fileSize = _fileSize;
        this._storeSize = _storeSize;
        this._fileIndex = _fileIndex;
        this._parentIndex = _parentIndex;
        if (SNode.SnodeMap === null) {
            SNode.SnodeMap = new Map<number, SNode>();
        }
        SNode.SnodeMap.set(this._nodeIndex, this);
        if (this._parentIndex !== -1) {
            (SNode.SnodeMap.get(this._parentIndex) as FoldNode).AddChild(this);
        }
        if (_parent != null) {
            _parent.AddChild(this);
        }
    }
    public *Walk(): IterableIterator<SNode> {
        yield this;
        if (this.isContain) {
            for (const [k, v] of (this as FoldNode).Child) {
                for (const item of v.Walk()) {
                    yield item;
                }
            }
        }
    }
    public get isContain(): boolean {
        return !this._isLeaf;
    }
    public get isLeaf(): boolean {
        return this._isLeaf;
    }
    public abstract get FileSize(): number;
    public abstract get StoreSize(): number;
    public get Name(): string {
        return this._name;
    }
    public set Parent(p: FoldNode) {
        this._parent = p;
        this._parentIndex = p._nodeIndex;
    }
    public mapNode(nodeIndex: number) {
        return SNode.SnodeMap.get(nodeIndex);
    }

}
export class FoldNode extends SNode {
    public Child: Map<string, SNode>;
    constructor({
        _nodeIndex = -1,
        _name,
        _parentIndex = -1,
        _fileSize = -1,
        _storeSize = -1,
        _fileIndex = "",
        _parent = null }: SaveNode & { _parent?: FoldNode }) {
        super({ _nodeIndex, _name, _parentIndex, _isLeaf: false, _fileSize, _storeSize, _fileIndex, _parent });
        this._isLeaf = false;
        this.Child = new Map<string, SNode>();
    }
    public get FileSize(): number {
        let sum = 0;
        for (const [k, c] of this.Child) {
            sum += c.FileSize;
        }
        return sum;
    }
    public get StoreSize(): number {
        let sum = 0;
        for (const [k, c] of this.Child) {
            sum += c.StoreSize;
        }
        return sum;
    }
    public AddChild(snode: SNode) {
        snode.Parent = this;
        if (this.Child.has(snode.Name)) {
            throw new Error("文件/目录名已存在");
        }
        this.Child.set(snode.Name, snode);
    }
    // public NewChildFile(name: string, fileSize: number,
    //     storeSize: number) {
    //     const snode = new FileNode(name, fileSize, storeSize, this);
    // }
    public FindFold(foldName: string) {
        // foldName = foldName.split(path.posix.sep);
        // let curFold = this;
        // for(let p of foldName.split(path.posix.sep).slice(1))
        // {
        //     curFold = this.
        // }

    }
}
export const SpareRootFold = () => new FoldNode({ _name: "" });
export class FileNode extends SNode {
    constructor({
        _nodeIndex = -1,
        _name,
        _parentIndex = -1,
        _fileSize,
        _storeSize = 0,
        _fileIndex = "",
        _parent = null }: SaveNode & { _parent?: FoldNode }) {
        super({ _nodeIndex, _name, _parentIndex, _isLeaf: true, _fileSize, _storeSize, _fileIndex, _parent });
    }

    public get FileSize(): number {
        return this._fileSize;
    }
    public get StoreSize(): number {
        return this._storeSize;
    }
    public set StoreSize(ss: number) {
        this._storeSize = ss;
    }
    public set FileIndex(i: string) {
        this._fileIndex = i;
    }

}

export class IndexList extends Map<string, string[]> {

}