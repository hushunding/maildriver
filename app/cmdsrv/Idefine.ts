export interface IQueryCmd {
    _nodeIndex: number;
    sort: string; order: string;
    isForce: boolean;
}
export interface IAccountCmd {
    action: 'verify' | 'add' | 'modify' | 'del'
    username: string;
    password: string;
}

export interface ICmdSvr extends ICmdSend {
    on(event: 'fileList', listener: (cmd: IQueryCmd, res: ICmdSend) => void): this;
    on(event: 'account', listener: (cmd: IAccountCmd, res: ICmdSend) => void): this;
    start(): void;
}
export interface ICmdSend {
    send(cmd: string, arg: any): void;
}

export interface ICmdReslut {
    res: 'success' | 'failed'
    code: string;
}