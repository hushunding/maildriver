import { EventEmitter } from 'events';
import { SNode, FileNode } from './FsDesc';
import { SaveNode } from './fsDesc/fsSaveNode';

export interface INDupload extends EventEmitter {
    on(event: "start", listener: Function): this;
    on(event: "end", listener: Function): this;
}
export interface INetDiver {
    uploadJFile(file: string): INDupload;
    uploadIndexFile(filePath: string, fileDesc: SaveNode): INDupload;
    on(event: "error", listener: (err: Error) => void): this;
    once(event: "ready", listener: () => void): this;
    account: string;
}
export interface IuploadFileNode {
    node: FileNode;
    state: 'New' | 'Finish' | 'Cancel';
}
