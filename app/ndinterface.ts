import * as fs from 'fs';
import * as path from 'path';
import { SNode, FoldNode, FileNode, IndexList, SpareRootFold } from './FsDesc';
import { FsDescFile } from './fsDescFile';

export interface IuploadFileNode {
    index: string;
    node: SNode;
    state: 'New' | 'Finish' | 'Cancel';
}
export class NetDriver {
    public readonly cachesRoot = '.caches';
    public readonly uploadcaches = path.join(this.cachesRoot, 'upload');
    public readonly downloadcaches = path.join(this.cachesRoot, 'download');
    public readonly nodefile = path.join(this.cachesRoot, 'fnode.db');
    public upLoadFileList: Map<string, IuploadFileNode>;
    private _fileTree: FoldNode;
    private _indexList: IndexList;
    public fdf: FsDescFile;

    constructor(cb: () => void) {
        this.upLoadFileList = new Map<string, IuploadFileNode>();
        this.fdf = this._fileTree = this._indexList = null;
        for (const d of [this.cachesRoot, this.uploadcaches, this.downloadcaches]) {
            if (!fs.existsSync(d)) { fs.mkdirSync(d); }
        }
        this.fdf = new FsDescFile();
        this._fileTree = SpareRootFold();
        this.fdf.InitFsDescFromdb(this.nodefile, (nodeTree: SNode, indexlist: IndexList) => {
            if (nodeTree !== null) {
                this._fileTree = nodeTree as FoldNode;
            }
            this._indexList = indexlist;
            console.log(this);
            cb();
        });
    }

    // 获取上传文件列表并生产节点树
    public _GetNodeTree(PathName: string, parentNode: FoldNode = null): SNode {
        const state = fs.lstatSync(PathName);
        if (state.isDirectory()) {
            const uploadNode = new FoldNode({ _name: path.basename(PathName), _parent: parentNode });
            for (const f of fs.readdirSync(PathName)) {
                this._GetNodeTree(path.join(PathName, f), uploadNode);
            }
            return uploadNode;
        } else {
            const uploadNode = new FileNode({
                _name: path.basename(PathName),
                _fileSize: state.size, _parent: parentNode,
            });
            this.upLoadFileList.set(PathName, { index: "", node: uploadNode, state: 'New' });
            return uploadNode;
        }
        
    }
    // 将节点树更新到本地存储
    public FixNodeTree() {

    }

    public upload(remoteparents: string, PathName: string): void {
        let pNode = null;
        (async (PathName: string, parentNode: FoldNode) => { await this._GetNodeTree(PathName, parentNode); })(PathName, pNode).then();
    }
    download(fileName: string): boolean;
    flush(): boolean;
    transmitStart(): void;
    transmitFinish(): void;
}


//test
if (true) {
    let nd = new NetDriver(() => {
        let fn = nd._GetNodeTree('E:\\work\\_6_信号资料\\7_Standards\\CTCS');
        nd._fileTree.AddChild(fn);
        nd.fdf.InsertNodeTree(nd._fileTree);
        let i = 0;
    });
}

