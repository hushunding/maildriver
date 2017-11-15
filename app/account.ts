import { NeDBPromise } from "./nedb-promise";
import { ICmdReslut } from "./cmdsrv/Idefine";

export interface IuserInfo { username: string; password: string; }
export class Account {
    // [key: string]:  Promise<ICmdReslut>
    private adb: NeDBPromise<IuserInfo>;
    constructor(cacheroot: string) {
        this.adb = new NeDBPromise<IuserInfo>({ filename: `${cacheroot}/account.nedb`, autoload: true })
    }

    async verify({ username, password }: IuserInfo) {
        let finduser = await this.adb.findAsync({username})
    }
    add({ username, password }: IuserInfo): ICmdReslut {

    }
    modify({ username, password }: IuserInfo): ICmdReslut {

    }
    del({ username, password }: IuserInfo): ICmdReslut {

    }
}
