import * as fs from "fs";
import * as path from "path";
import { SNode, FoldNode, FileNode, IndexList, SpareRootFold } from "./FsDesc";
import { FsDescFile } from "./fsDescFile";
import { IuploadFileNode, INetDiver } from "./INetDriver";
import { zipFile } from "./cryptpress";
import * as util from "util";

export class NDFsLocal {
    public readonly cachesRoot = ".caches";
    public readonly uploadcaches = path.join(this.cachesRoot, "upload");
    public readonly downloadcaches = path.join(this.cachesRoot, "download");
    public readonly nodefile = false ? ":memory:" : path.join(this.cachesRoot, "fnode.db");
    public upLoadFileList: Map<string, IuploadFileNode>;
    private _fileTree: FoldNode;
    private _indexList: IndexList;
    public fdf: FsDescFile;
    // 已一会话为限吧。当达到会话列表终点时，就立即上传。同样满5M也上传。
    constructor(private netdirver: INetDiver) {
        this.upLoadFileList = new Map<string, IuploadFileNode>();
        this.fdf = this._fileTree = this._indexList = null;
        this.fdf = new FsDescFile();
        this._fileTree = SpareRootFold();
    }
    public async Init() {
        for (const d of [this.cachesRoot, this.uploadcaches, this.downloadcaches]) {
            if (!fs.existsSync(d)) { await util.promisify(fs.mkdir)(d); }
        }
        const { nodeTree, indexlist } = await this.fdf.InitFsDescFromnedb(this.nodefile);
        if (nodeTree !== null) {
            this._fileTree = nodeTree as FoldNode;
        } else {
            await this.fdf.InsertNodeTreeNE(this._fileTree);
        }
        this._indexList = indexlist;
    }

    // 获取上传文件列表并生产节点树
    public async _GetNodeTree(PathName: string, parentNode: FoldNode = null) {
        const state = fs.lstatSync(PathName);
        if (state.isDirectory()) {
            const uploadNode = new FoldNode({ _name: path.basename(PathName), _parent: parentNode });
            const fl = await util.promisify(fs.readdir)(PathName);
            for (const f of fl) {
                await this._GetNodeTree(path.join(PathName, f), uploadNode);
            }
            return uploadNode;
        } else {
            const uploadNode = new FileNode({
                _name: path.basename(PathName),
                _fileSize: state.size, _parent: parentNode,
            });
            this.upLoadFileList.set(PathName, { node: uploadNode, state: "New" });
            return uploadNode;
        }
    }
    // 将节点树更新到本地存储
    public FixNodeTree() {

    }

    public async upload(remoteparents: string | FoldNode, PathName: string) {
        let rpN: FoldNode;
        if (remoteparents instanceof FoldNode) {
            rpN = remoteparents;
        } else {
            throw new Error("未实现");
        }
        const fn = await this._GetNodeTree(PathName, rpN);
        await this.fdf.InsertNodeTreeNE(fn);

    }
    private _handleuploadFile() {
        for (const [lfp, ufn] of this.upLoadFileList) {
            if (ufn.state === "New") {
                // 先压缩文件
                this.indexFile(lfp, ufn);
                // this.netdirver.uploadIndexFile();
            }
        }
    }
    private async indexFile(lfp: string, ufn: IuploadFileNode) {
        const { res, fileIndex, storeSize } = await zipFile(lfp, this.uploadcaches);
        ufn.node.FileIndex = fileIndex;
        ufn.node.StoreSize = storeSize;
        // 生产索引
    }
    download(fileName: string): boolean;
    flush(): boolean;
    transmitStart(): void;
    transmitFinish(): void;
}


//test
if (true) {
    const nd = new NDFsLocal(null);
    nd.Init().then(() => {
        return nd.upload(nd._fileTree, "E:\\_4_work_study\\_6_信号资料\\7_Standards\\CTCS")
    }).catch((err) => {
        console.log(err);
    });
}

