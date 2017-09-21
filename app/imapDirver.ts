import { NetDriver} from "./ndinterface";
import * as Imap from 'imap'
import { SNode } from "./NetFS";
type cbReslut = Error | null

export class ImapNetDriver implements NetDriver {
    _transmitList: SNode[];
    imap: Imap;
    constructor(private config: Imap.Config, cb: (err: cbReslut) => void) {
        this.imap = new Imap(config);
        this.imap.connect();
        this.imap.once('error', function (err: cbReslut) {
            console.log(err);
        });

        this.imap.once('end', function () {
            console.log('Connection ended');
        });
        this.imap.once('ready', () => {
            this.checkAndformat(null, cb);
        });
    }
    private checkAndformat(err: cbReslut, cb: (err: cbReslut) => void) {
        if (err) {
            console.log(err);
            cb(err);
        }
        else {
            this.imap.getBoxes((err, mailboxs) => {
                if (err) {
                    console.log(err);
                    cb(err)
                }
                else {
                    this._format(mailboxs, cb);
                }
            })
        }
    }
    //完成目录格式初始化
    _format(mailboxs: Imap.MailBoxes, cb: (err: cbReslut) => void): void {
        if (mailboxs.nddb === undefined) {
            this.imap.addBox('nddb', (err: cbReslut) => this.checkAndformat(err, cb))
        } else if (mailboxs.nddb.children === null) {
            this.imap.addBox('nddb/jlog', (err: cbReslut) => this.checkAndformat(err, cb))
        }
        else if (mailboxs.nddb.children.index === undefined)
            this.imap.addBox('nddb/index', (err: cbReslut) => this.checkAndformat(err, cb))
        else {
            cb(null);
        }
    }

    upload(fileName: string): boolean {
        throw new Error("Method not implemented.");
    }
    download(fileName: string): boolean {
        throw new Error("Method not implemented.");
    }
    flush(): boolean {
        throw new Error("Method not implemented.");
    }
    transmitStart(): void {
        throw new Error("Method not implemented.");
    }
    transmitFinish(): void {
        throw new Error("Method not implemented.");
    }



}
