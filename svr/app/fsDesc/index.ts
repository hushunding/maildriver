import * as fs from 'fs';
import * as zlib from 'zlib';
import { SNode, FileNode, FoldNode} from './fsNode';
import * as util from 'util';
import { NeDBPromise } from '../nedb-promise';
import { SaveNode } from './fsSaveNode';

class DBSaveNode {
    public _nodeIndex: number;
    public _name: string;
    public _parentIndex: number;
    public _isLeaf: boolean;
    public _fileSize: number;
    public _storeSize: number;
    public _fileIndex: string;
    [index: string]: any;
    constructor({
        _nodeIndex = -1,
        _name,
        _parentIndex = -1,
        _isLeaf = false,
        _fileSize = -1,
        _storeSize = -1,
        _fileIndex = "",
     }: SaveNode = { _name: "" }) {
        this._nodeIndex = _nodeIndex;
        this._name = _name;
        this._parentIndex = _parentIndex;
        this._isLeaf = _isLeaf;
        this._fileSize = _fileSize;
        this._storeSize = _storeSize;
        this._fileIndex = _fileIndex;
    }
}

class DBSaveIndex {
    public _fileIndex: string;
    public _fileloc: string[];
    constructor({ _fileIndex, _fileloc } = { _fileIndex: "", _fileloc: new Array<string>() }) {
        this._fileIndex = _fileIndex;
        this._fileloc = _fileloc;
    }
}

// 初始化文件树和文件索引列表
export class FsDesc {
    private nedb: { nodelist: NeDBPromise<DBSaveNode>; indexList: NeDBPromise<DBSaveIndex> };
    private _lastNodeIndex: number = 0;
    // 获取最新的节点索引，获取一次即更新一次
    private LastNodeIndex() {
        return ++this._lastNodeIndex;
    }

    public async Init(dbPath: string) {
        // 建立表
        this.nedb = {
            nodelist: new NeDBPromise({ filename: `${dbPath}_DBSaveNode`, autoload: true }),
            indexList: new NeDBPromise({ filename: `${dbPath}_DBSaveIndex`, autoload: true }),
        };
        this.nedb.nodelist.ensureIndex({ fieldName: '_nodeIndex', unique: true });
        this.nedb.indexList.ensureIndex({ fieldName: '_fileIndex', unique: true });

        const rows = await this.nedb.nodelist.findandSortAsync({}, { _nodeIndex: 1 });
        this.InitNodeTree(rows);
    }

    private async InitNodeTree(rows: DBSaveNode[]) {
        if (rows != null && rows.length > 0) {
            let maxindex = -1;
            for (const row of rows) {
                maxindex = row._nodeIndex > maxindex ? row._nodeIndex : maxindex;
            }
            this._lastNodeIndex = maxindex;
        } else {
            this._lastNodeIndex = -1;
            this.InsertNodeTreeNE(this.SpareRootFold());
        }
    }

    public async InsertNodeTreeNE(snode: SNode) {
        const starttime = Date.now();
        // console.log(starttime)
        const nodelist = new Array<DBSaveNode>();
        for (const item of snode.Walk()) {
            nodelist.push(new DBSaveNode(item));
        }
        await this.nedb.nodelist.insertAsync(nodelist);
        console.log(Date.now() - starttime);
    }
    public NewFold({
        _nodeIndex = -1,
        _name,
        _parentIndex = -1,
        _parent = null }: SaveNode & { _parent?: FoldNode }) {
        return new FoldNode({ _nodeIndex: this.LastNodeIndex(), _name, _parentIndex, _parent });
    }
    public NewFile({
        _nodeIndex = -1,
        _name,
        _parentIndex = -1,
        _fileSize,
        _parent = null }: SaveNode & { _parent?: FoldNode }) {
        return new FileNode({ _nodeIndex: this.LastNodeIndex(), _name, _parentIndex, _fileSize, _parent });
    }
    public async GetNode(id: number) {
        // todo
        return this.ToSpecNode((await this.nedb.nodelist.findAsync({ _nodeIndex: id }))[0]);
    }
    private SpareRootFold() {
        return new FoldNode({ _name: "" });
    }
    private ToSpecNode(snode: DBSaveNode) {
        if (snode._isLeaf) {
            return new FileNode(snode);
        } else {
            return new FoldNode(snode);
        }
    }
}

export * from './FsNode';
