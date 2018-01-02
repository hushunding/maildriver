import { ICmdChn } from "./cmdsrv/ICmdChn";


export function setup(cmdchn: ICmdChn) {
    //
    const cacheRoot = '.caches'
    cmdchn.on('accountTest', IMAPCheck)
}

