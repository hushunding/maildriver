import * as http from 'http';
import * as url from 'url';
import * as EventEmitter from 'events';

export interface IQueryCmd {
    _nodeIndex: number;
    sort: string; order: string;
    isForce: boolean;
}

export interface ICmdSvr extends ICmdSend {
    on(event: '/fileList', listener: (query: IQueryCmd, res: ICmdSend) => void): this;
    start(): void;
}
export interface ICmdSend {
    send(cmd: string, arg: any): void;
}

export class HttpCmdSend implements ICmdSend {
    constructor(private res: http.ServerResponse) {

    }
    public send(cmd: string, arg: any): void {
        this.res.end(JSON.stringify({ cmd, arg }));
    }
}
export class HttpCmdSvr extends EventEmitter implements ICmdSvr {
    private _cmdbuf: Array<{ cmd: string, arg: any }>;
    public send(cmd: string, arg: any): void {
        this._cmdbuf.push({ cmd, arg });
        throw new Error("Method not implemented.");
    }
    public start(): void {
        this.server.listen(10800);
    }
    private server: http.Server;
    constructor() {
        super();
        this._cmdbuf = [];
        this.server = http.createServer((req, res) => {
            let jsonData = "";
            if (req.method !== 'POST' || req.url !== '/csapi') {
                res.end('HTTP/1.1 400 Bad Request\r\n\r\n');
            }
            req.on('data', (chunk) => {
                jsonData += chunk;
            });
            req.on('end', () => {
                const reqObj = JSON.parse(jsonData);
                if (reqObj.cmd) {
                    res.write(this._cmdbuf);
                    this._cmdbuf = [];
                } else {
                    this.emit(reqObj.cmd, reqObj.arg, new HttpCmdSend(res));
                }
            });
        });
        this.server.on('clientError', (err, cs) => {
            cs.end('HTTP/1.1 400 Bad Request\r\n\r\n');
        });
    }
}

const cmdsrv = new HttpCmdSvr();
cmdsrv.on('fileList', (query: IQueryCmd, res: ICmdSend) => {

});
cmdsrv.start();
