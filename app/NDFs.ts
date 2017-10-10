import * as fs from "fs";
import * as path from "path";
import { SNode, FoldNode, FileNode, FsDesc } from "./FsDesc";
import { IuploadFileNode, INetDiver } from "./INetDriver";
import { zipFile } from "./cryptpress";
import * as util from "util";

export class NDFsLocal {
    public nodefile: string;
    public downloadcaches: string;
    public uploadcaches: string;
    public cachesRoot = ".caches";
    public upLoadFileList: Map<string, IuploadFileNode>;
    public fsdec: FsDesc;
    // 已一会话为限吧。当达到会话列表终点时，就立即上传。同样满5M也上传。
    constructor(private netdirver: INetDiver) {
        this.upLoadFileList = new Map<string, IuploadFileNode>();
        this.fsdec = new FsDesc();
    }
    public async Init() {
        this.cachesRoot = path.join(this.cachesRoot, this.netdirver.account);
        this.uploadcaches = path.join(this.cachesRoot, "upload");
        this.downloadcaches = path.join(this.cachesRoot, "download");
        this.nodefile = false ? ":memory:" : path.join(this.cachesRoot, "fnode.db");
        for (const d of [this.cachesRoot, this.uploadcaches, this.downloadcaches]) {
            if (!fs.existsSync(d)) { await util.promisify(fs.mkdir)(d); }
        }
        await this.fsdec.Init(this.nodefile);
    }

    // 获取上传文件列表并生产节点树
    public async _GetNodeTree(PathName: string, parentNode: FoldNode = null) {
        const state = fs.lstatSync(PathName);
        if (state.isDirectory()) {
            const uploadNode = this.fsdec.NewFold({ _name: path.basename(PathName), _parent: parentNode });
            const fl = await util.promisify(fs.readdir)(PathName);
            for (const f of fl) {
                await this._GetNodeTree(path.join(PathName, f), uploadNode);
            }
            return uploadNode;
        } else {
            const uploadNode = this.fsdec.NewFile({
                _name: path.basename(PathName),
                _fileSize: state.size, _parent: parentNode,
            });
            this.upLoadFileList.set(PathName, { node: uploadNode, state: "New" });
            return uploadNode;
        }
    }

    public async upload(remoteparents: string | FoldNode, PathName: string) {
        let rpN: FoldNode;
        if (typeof remoteparents === "string") {
            throw new Error("未实现");
        } else {
            rpN = remoteparents;
        }
        const fn = await this._GetNodeTree(PathName, rpN);
        await this.fsdec.InsertNodeTreeNE(fn);

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
(async (ctl) => {
    if (ctl) {
        const nd = new NDFsLocal({ account: 'test' });
        await nd.Init();
        const root = await nd.fsdec.GetNode(-1);
        nd.upload(root, "E:\\work\\_6_信号资料\\7_Standards\\CTCS");
    }
})(true).catch((err) => {
    console.log(err);
});

