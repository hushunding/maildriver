import { ICmdReslut, IMailAccountCmd, ICmdResp } from "../cmdsrv/ICmdChn";
import * as IMAP from 'imap';

export function IMAPCheck(mailAccount: IMailAccountCmd, resp: ICmdResp) {
    var imap = new IMAP(mailAccount);

    imap.once('ready', () => {
        imap.openBox('INBOX', true, (error, mailbox) => {
            if (error) {
                resp.send({
                    res: 'failed',
                    code: error.message
                })
            }
            else {
                resp.send({
                    res: 'success',
                    code: ''
                })
            }
        });
    })
    imap.on('error', (err: Error) => {
        resp.send({
            res: 'failed',
            code: err.message
        })
    })
    imap.connect();

}

if (require.main == module) {
    //testing code
    IMAPCheck({
        user: 'hushunding@aliyun.com',
        password: 'first_7247',
        host: 'imap.aliyun.com',
        //port: 143,
        tls: true,
    }, {
            send(relt: ICmdReslut) {
                console.log(relt)
            }
        })
}