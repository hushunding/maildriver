export interface IQueryCmd {
    _nodeIndex: number;
    sort: string; order: string;
    isForce: boolean;
}
export interface IMailAccountCmd {
    user: string;
    password: string;
    host:string;
    port?:number;
    tls?:boolean;
}

export interface ICmdChn {
    on(event: 'fileList', listener: (cmd: IQueryCmd, res: ICmdResp) => void): this;
    on(event: 'accountTest', listener: (cmd: IMailAccountCmd, res: ICmdResp) => void): this;
    send(cmd: string, arg: any): void;
    start(): void;
}
export interface ICmdResp {
    send(arg: ICmdReslut): void;
}

export interface ICmdReslut {
    res: 'success' | 'failed'
    code: string;
}