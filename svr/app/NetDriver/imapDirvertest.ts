
import { ImapNetDriver } from "./imapDirver";
import * as MailComposer from "../maillib/mail-composer";
import * as MimeNode from "../maillib/mime-node";
import * as fs from 'fs';
let message = {
    // Comma separated lsit of recipients 收件人用逗号间隔
    to: '12xxxx101@qq.com',

    // Subject of the message 信息主题
    subject: 'Nodemailer is unicode friendly',

    // plaintext body
    text: 'Hello to myself~',


    // An array of attachments 附件
    attachments: [
        // String attachment
        {
            filename: 'notes.txt',
            content: 'Some notes about this e-mail',
            contentType: 'text/plain' // optional,would be detected from the filename 可选的，会检测文件名
        },
        // Binary Buffer attchment
        {
            filename: 'image.png',
            content: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD/' +
                '//+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4U' +
                'g9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC', 'base64'),
            cid: '00001'  // should be as unique as possible 尽可能唯一
        },
        // File Stream attachment
        {
            filename: 'nyan cat.gif',
            path: 'package.json',
            cid: '00002'  // should be as unique as possible 尽可能唯一
        }
    ],

};

// application/x-7z-compressed
const netdriver = new ImapNetDriver({
    user: 'hushunding@aliyun.com',
    password: 'first_7247',
    // host: 'imap.aliyun.com',
    host: '192.168.151.232',
    port: 143,
    tls: false,
});
netdriver.on("error", (err: Error) => {
    console.log(err);
});
netdriver.once("ready", () => {
    console.log("已连接");
    netdriver.imap.openBox("INBOX", (err)=>{
        const mc = new MailComposer(message);
        let msg = mc.compile() as MimeNode;
        msg.build((n,buf) => {
            netdriver.imap.append(buf, (err) => { 
                console.log(err) })
        })
    })
    
});


