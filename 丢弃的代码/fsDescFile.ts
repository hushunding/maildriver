import * as fs from 'fs';
import * as zlib from 'zlib';
import { SNode, FileNode, IndexList, FoldNode, ReInitLastNodeIndex, SaveNode, SaveIndex } from './FsDesc';
import * as util from 'util';
// import { DatabasePromise } from './sqlite-promise';
// import * as  Nedb from 'nedb';
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
/* type cbType<resT> = (err: Error, result: resT) => void;
// type asyncFunc0<resT> = (cb: cbType<resT>) => void;
// type asyncFunc1<arg1T, resT> = (arg1: arg1T, cb: cbType<resT>) => void;
// type asyncFunc2<arg1T, arg2T, resT> = (arg1: arg1T, arg2: arg1T, cb: cbType<resT>) => void;
// export declare function methodPromisify<resT, thisT>(fn: asyncFunc0<resT>, thisArg: thisT): () => Promise<resT>;
// export declare function methodPromisify<arg1T, resT, thisT>(fn: asyncFunc1<arg1T, resT>, thisArg: thisT): (arg1: arg1T) => Promise<resT>;

// export function methodPromisify(fn: Function, thisArg) {
//     function PromiseFunc() {
//         const args = new Array();
//         for (let index = 0; index < fn.length; index++) {
//             args.push(arguments[index]);
//         }
//         return new Promise((r, j) => {
//             const cb = (err, result) => {
//                 if (err) {
//                     j(err);
//                 } else {
//                     r(result);
//                 }
//             };
//             args.push(cb);
//             fn.apply(thisArg, args);
//         });
//     };
//     return PromiseFunc;
}*/ 
// 初始化文件树和文件索引列表
export class FsDescFile {
    private nedb: { nodelist: NeDBPromise<DBSaveNode>; indexList: NeDBPromise<DBSaveIndex> };
    private promisify: (fn: (sql: string, cb: (err: Error, result: any) => void) => void) => (sql: string) => Promise<{}>;

    // private db: DatabasePromise;
    // public async InitFsDescFromdb(dbPath: string) {
    //     // 建立表
    //     this.db = new DatabasePromise(dbPath);
    //     await this.db.run(this.getCreateStr(DBSaveNode, '_nodeIndex'));
    //     const rows = await this.db.all('Select * from DBSaveNode') as DBSaveNode[];
    //     const nodeTree = this.InitNodeTree(rows);
    //     await this.db.run(this.getCreateStr(DBSaveIndex, '_fileIndex'));
    //     const indexrows = await this.db.all('Select * from DBSaveIndex') as DBSaveIndex[];
    //     const indexlist = this.InitIndexList(indexrows);
    //     return { nodeTree, indexlist };
    // }
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
    // public async InsertNodeTree(snode: SNode) {
    //     const starttime = Date.now();
    //     // console.log(starttime)
    //     const nodelist = new Array<SNode>();
    //     this.TransTreetoList(snode, nodelist);
    //     const keylist = Object.keys(new DBSaveNode());
    //     const vallist = keylist.map((key) => `?`);
    //     const smt = this.db.prepare(`INSERT INTO DBSaveNode (${keylist.join(',')}) VALUES (${vallist.join(',')})`);
    //     // this.db._db.serialize(() => {
    //     //     for (const n of nodelist) {
    //     //         const sn = new DBSaveNode(n);
    //     //         // const vallist = keylist.map((key) => `${sn[key]}`);
    //     //         // console.log(vallist);
    //     //         // smt._smt.run(vallist, (err) => {
    //     //         //     console.log(Date.now() - starttime);
    //     //         // });
    //     //         const vallist = keylist.map((key) => typeof sn[key] === 'string' ? `"${sn[key]}"` : sn[key].toString());
    //     //         this.db._db.run(`INSERT INTO DBSaveNode (${keylist.join(',')}) VALUES (${vallist.join(',')})`, (err: Error) => {
    //     //             if (err) { console.log(err); throw err; }
    //     //             console.log(Date.now() - starttime);
    //     //         });
    //     //     }
    //     // });
    //     // console.log(Date.now() - starttime);

    //     const smtrunGen = function* () {
    //         for (const n of nodelist) {
    //             const sn = new DBSaveNode(n);
    //             // const vallist = keylist.map((key) => typeof sn[key] === 'string' ? `"${sn[key]}"` : sn[key].toString());
    //             const vallist = keylist.map((key) => `${sn[key]}`);
    //             yield smt.run(vallist);
    //             // this.db.run(`INSERT INTO DBSaveNode (${keylist.join(',')}) VALUES (${vallist.join(',')})`, (err: Error) => {
    //             //     if (err) { console.log(err); throw err; }
    //             // });
    //         }
    //     };
    //     await Promise.all(smtrunGen());
    //     smt.finalize();
    //     console.log(Date.now() - starttime);
    // }
}

// //节点文件
// export class NodeFile {
//     index: number;
//     SaveNodeList: SaveNode[];
//     public static SaveSync(node: SNode, filePath: string) {
//         let nf = new NodeFile();
//         nf.SplitSaveNodeList(node);
//         fs.writeFileSync(filePath, zlib.gzipSync(JSON.stringify(nf.SaveNodeList)));
//     }
//     constructor() {
//         this.SaveNodeList = new Array<SaveNode>();
//         this.index = 0
//     }
//     private SplitSaveNodeList(node: SNode, parentsIndex = -1) {
//         let saveNode = new SaveNode(node, parentsIndex, this.index);
//         this.SaveNodeList.push(saveNode)
//         if (node.isContaint) {
//             let currIndex = this.index;
//             for (let [k, v] of (node as FoldNode).Child) {
//                 this.index++
//                 this.SplitSaveNodeList(v, currIndex);
//             }
//         }
//     }
//     public static LoadSync(filePath: string): SNode {
//         return NodeFile.readSaveNode(filePath);
//     }
//     private static readSaveNode(filePath: string) {
//         let saveNodeList = JSON.parse(zlib.unzipSync(fs.readFileSync(filePath)).toString()) as SaveNode[]
//         let snodeList = new Array<SNode>();
//         let rootNode = null;
//         for (let saveNode of saveNodeList) {
//             let node;
//             if (!saveNode.node._isLeaf) {
//                 node = new FoldNode(saveNode.node.name)
//             }
//             else {
//                 node = new FileNode(saveNode.node.name, saveNode.node.FileSize, saveNode.node.StoreSize)
//                 node.FileIndex = (saveNode.node as FileNode).FileIndex
//             }
//             snodeList.push(node)
//             if (saveNode.parentsIndex === -1) {
//                 if (rootNode === null) {
//                     rootNode = node;
//                 }
//                 else {
//                     throw "多root"
//                 }
//             }
//             else {
//                 (snodeList[saveNode.parentsIndex] as FoldNode).AddChild(node);
//             }
//         }
//         return rootNode;
//     }
// }
