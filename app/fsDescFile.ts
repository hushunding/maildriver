import * as fs from 'fs';
import * as zlib from 'zlib';
import { SNode, FileNode, IndexList, FoldNode, ReInitLastNodeIndex, SaveNode, SaveIndex } from './FsDesc';
import * as util from 'util';
import { NeDBPromise } from './nedb-promise';

class DBSaveNode {
    public _nodeIndex: number;
    public _name: string;
    public _parentIndex: number;
    public nodeType: string;
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
        _fileIndex = "" }: SaveNode = { _name: "" }) {
        this._nodeIndex = _nodeIndex;
        this._name = _name;
        this._parentIndex = _parentIndex;
        this.nodeType = _isLeaf ? 'File' : 'Fold';
        this._fileSize = _fileSize;
        this._storeSize = _storeSize;
        this._fileIndex = _fileIndex;
    }
}

class DBSaveIndex {
    public _fileIndex: string;
    public _locjson: string;
    constructor({ _fileIndex, _locjson }: SaveIndex = { _fileIndex: "", _locjson: "" }) {
        this._fileIndex = _fileIndex;
        this._locjson = _locjson;
    }
}

// 初始化文件树和文件索引列表
export class FsDescFile {
    private nedb: { nodelist: NeDBPromise<DBSaveNode>; indexList: NeDBPromise<DBSaveIndex> };
    private promisify: (fn: (sql: string, cb: (err: Error, result: any) => void) => void) => (sql: string) => Promise<{}>;

    public async InitFsDescFromnedb(dbPath: string) {
        // 建立表
        this.nedb = {
            nodelist: new NeDBPromise({ filename: `${dbPath}_DBSaveNode`, autoload: true }),
            indexList: new NeDBPromise({ filename: `${dbPath}_DBSaveIndex`, autoload: true }),
        };
        this.nedb.nodelist.ensureIndex({ fieldName: '_nodeIndex', unique: true });
        this.nedb.indexList.ensureIndex({ fieldName: '_fileIndex', unique: true });

        const rows = await this.nedb.nodelist.findandSortAsync({}, { _nodeIndex: 1 });
        const nodeTree = this.InitNodeTree(rows);
        const indexrows = await this.nedb.indexList.findAsync({});
        const indexlist = this.InitIndexList(indexrows);
        return { nodeTree, indexlist };
    }
    // 根据模板类创建
    private getCreateStr(classType: any, mainkey: string = "") {
        const keyvalList = new Array<string>();
        const obj = new classType();
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const element = obj[key];
                keyvalList.push(`${key} ${typeof element} ${key === mainkey ? "PRIMARY KEY" : ""}`);
            }
        }
        return `CREATE TABLE IF NOT EXISTS ${classType.name} (${keyvalList.join(',')})`;
    }
    private InitNodeTree(rows: DBSaveNode[]) {
        let rootNode = null;
        let maxindex = 0;
        for (const row of rows) {
            let node;
            if (row.nodeType === 'Fold') {
                node = new FoldNode(row);
            } else {
                node = new FileNode(row);
            }
            maxindex = row._nodeIndex > maxindex ? row._nodeIndex : maxindex;
            if (row._parentIndex === -1) {
                if (rootNode === null) {
                    rootNode = node;
                } else {
                    throw new Error("多root");
                }
            }
        }
        ReInitLastNodeIndex(maxindex + 1);
        return rootNode;
    }

    private InitIndexList(rows: DBSaveIndex[]) {
        const indexlist = new IndexList();
        for (const row of rows) {
            indexlist.set(row._fileIndex, JSON.parse(row._locjson));
        }
        return indexlist;
    }
    private TransTreetoList(snode: SNode, snodeList: SNode[]) {
        snodeList.push(snode);
        if (snode.isContain) {
            for (const [k, v] of (snode as FoldNode).Child) {
                this.TransTreetoList(v, snodeList);
            }
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
}
