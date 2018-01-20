import { ICmdChn } from "./cmdsrv/ICmdChn";
import { IMAPCheck } from "./NetDriver/imapCheck";
import { NetDriverPool } from "./NetDriver/netDriverMain";



export function setup(cmdchn: ICmdChn) {
    //
    const cacheRoot = '.caches'
    const ndpool = new NetDriverPool(cmdchn);
    cmdchn.on('accountTest', IMAPCheck)
    cmdchn.on('LogandInit',NDLogandInit)
}

