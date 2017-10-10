// 文件描述符
// todo 重新整理文件描述符。存储、查找、索引整合成一个大类，便于整体加载和初始化
import * as path from 'path';

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

export abstract class SNode {
    protected _nodeIndex: number;
    protected _name: string;
    protected _parentIndex: number;
    protected _isLeaf: boolean;
    protected _parent: FoldNode;
    constructor({ _nodeIndex, _name, _parentIndex, _isLeaf,
        _parent }: SaveNode & { _parent: FoldNode }) {
        this._nodeIndex = _nodeIndex;
        this._name = _name;
        this._isLeaf = _isLeaf;
        this._parentIndex = _parentIndex;
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
}
export class FoldNode extends SNode {
    public Child: Map<string, SNode>;
    constructor({
        _nodeIndex = -1,
        _name,
        _parentIndex = -1,
        _parent = null }: SaveNode & { _parent?: FoldNode }) {
        super({ _nodeIndex, _name, _parentIndex, _isLeaf: false, _parent });
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
export class FileNode extends SNode {
    private _fileSize: number;
    private _storeSize: number;
    private _fileIndex: string;
    constructor({
        _nodeIndex = -1,
        _name,
        _parentIndex = -1,
        _fileSize,
        _storeSize = 0,
        _parent = null }: SaveNode & { _parent?: FoldNode }) {
        super({ _nodeIndex, _name, _parentIndex, _isLeaf: true, _parent });
        this._fileSize = _fileSize;
        this._storeSize = _storeSize;
        this._fileIndex = "";
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
