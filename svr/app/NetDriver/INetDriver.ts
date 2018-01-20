import { EventEmitter } from 'events';
import { SaveNode } from '../FsDesc/fsSaveNode';

export interface INDupload extends EventEmitter {
    on(event: "start", listener: Function): this;
    on(event: "end", listener: Function): this;
}
export interface INetDiver {
    uploadJFile(file: string): INDupload;
    uploadIndexFile(filePath: string, fileDesc: SaveNode): INDupload;
    on(event: "error", listener: (err: Error) => void): this;
    on(event: "end", listener: () => void): this;
    once(event: "ready", listener: () => void): this;

    connect():void;
    disconnect():void;
    retry:number;
}
