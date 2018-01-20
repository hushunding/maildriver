import { INetDiver } from "./INetDriver";
import { ICmdChn, IMailAccountCmd, ICmdResp } from "../cmdsrv/ICmdChn";

export class NetDriverPool {

    ndmap = new Map<string, INetDiver>();
    constructor(private cmdChn: ICmdChn) {

    }
    public add(user: string, nd: INetDiver) {
        if (!this.ndmap.has(user)) {
            this.ndmap.set(user, nd);
            nd.retry = 5;
            this.cmdChn.send('LinkInd_connect', { user, retry: nd.retry })
            nd.connect();
            nd.on("error", err => {
                this.cmdChn.send('LinkInd_disconnect', { user, msg: err.message });
                nd.retry--;
                this.cmdChn.send('LinkInd_reconnect', { user, retry: nd.retry })
                nd.connect();
            })
            nd.on('end', () => {
                this.cmdChn.send('LinkInd_disconnect', { user });
                nd.retry = 0;
            })
            nd.once('ready', () => {
                this.cmdChn.send('LinkInd_connected', { user })
            })
        }
    }
    public connect(user: string)
    {

    }
    public del(user: string) {
        if (this.ndmap.has(user)) {
            const nd = this.ndmap.get(user);
            nd.on("error", (err) => null);
            nd.disconnect();

        }
    }
}
export function NDLogandInit(cmd:IMailAccountCmd, resp:ICmdResp)
{

}