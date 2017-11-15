import { ICmdSvr } from "./cmdsrv/Idefine";
import { Account } from "./account";

export function setup(cmdsrv: ICmdSvr) {
    //
    const cacheRoot = '.caches'
    let account = new Account(cacheRoot);
    cmdsrv.on('account', (cmd, res) => {
        account[cmd.action](cmd)
    })
}