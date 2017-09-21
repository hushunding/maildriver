
import { ImapNetDriver } from "./imapDirver";

let netdriver = new ImapNetDriver({
    user: 'hushunding@aliyun.com',
    password: 'first_7247',
    host: 'imap.aliyun.com',
    //host: '192.168.151.232',
    port: 993,
    tls: true
},(err)=>{
    console.log("打开成功")
}
)
