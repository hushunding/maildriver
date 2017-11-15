import * as Imap from 'imap';
import { EventEmitter } from 'events';
import { INetDiver, INDupload } from './INetDriver';

// tslint:disable-next-line:no-var-requires

type cbReslut = Error | null;


export class ImapNetDriver extends EventEmitter implements INetDiver {
    uploadJFile(jfile: string): INDupload {
        throw new Error("Method not implemented.");
    }
    uploadIndexFile(jfile: string): INDupload {
        throw new Error("Method not implemented.");
    }
    private imap: Imap;
    constructor(private config: Imap.Config) {
        super();
        this.imap = new Imap(config);
        this.imap.connect();
        this.imap.once('error', (err: cbReslut) => {
            this.emit('error', err);
        });

        this.imap.once('end', () => {
            console.log('Connection ended');
        });
        this.imap.once('ready', () => {
            this.checkAndformat(null);
        });
    }
    private checkAndformat(err: cbReslut) {
        if (err) {
            this.emit('error', err);
        } else {
            this.imap.getBoxes((err, mailboxs) => {
                if (err) {
                    this.emit('error', err);
                } else {
                    this._format(mailboxs);
                }
            });
        }
    }
    // 完成目录格式初始化
    private _format(mailboxs: Imap.MailBoxes): void {
        if (mailboxs.nddb === undefined) {
            this.imap.addBox('nddb', (err: cbReslut) => this.checkAndformat(err));
        } else if (mailboxs.nddb.children === null) {
            this.imap.addBox('nddb/jlog', (err: cbReslut) => this.checkAndformat(err));
        } else if (mailboxs.nddb.children.index === undefined) {
            this.imap.addBox('nddb/index', (err: cbReslut) => this.checkAndformat(err));
        } else {
            this.emit('ready');
        }
    }

    private uploadFile(box: string, fileName: string): INDupload {
        let ee = new EventEmitter();
        return ee;
    }
    private download(fileName: string): boolean {
        //this.imap.fetch()
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
