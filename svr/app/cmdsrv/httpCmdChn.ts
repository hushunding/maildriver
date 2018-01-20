import * as http from 'http';
import * as url from 'url';
import * as EventEmitter from 'events';
import { ICmdResp, ICmdChn } from './ICmdChn';

export class HttpCmdResp implements ICmdResp {
    constructor(private res: http.ServerResponse) {

    }
    send(arg: any): void {
        this.res.write(JSON.stringify({ cmd: 'resp', arg }));
        this.res.end();
    }

}
export class HttpCmdChn extends EventEmitter implements ICmdChn {
    private _cmdbuf: Array<{ cmd: string, arg: any }>;
    public send(cmd: string, arg: any): void {
        this._cmdbuf.push({ cmd, arg });
        //throw new Error("Method not implemented.");
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

            if (req.method !== 'POST' || (req.url !== '/csapi' && req.url !== '/hb')) {
                res.end('HTTP/1.1 400 Bad Request\r\n\r\n');
            }
            req.on('data', (chunk) => {
                jsonData += chunk;
            });
            req.on('end', () => {
                const reqObj = JSON.parse(jsonData);
                if (reqObj.cmd === 'hb') {
                    res.write(JSON.stringify(this._cmdbuf));
                    this._cmdbuf = [{cmd:'idle', arg:''}];
                    res.end();
                } else {
                    this.emit(reqObj.cmd, reqObj.arg, new HttpCmdResp(res));
                }
            });
        });
        this.server.on('clientError', (err, cs) => {
            cs.end('HTTP/1.1 400 Bad Request\r\n\r\n');
        });
    }
}
