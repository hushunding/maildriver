let fs = require('fs');
let path = require('path')
const svrCodepath = 'svr'
let linkFiles = [`${__dirname}/svr/app/cmdsrv/ICmdChn.ts`, `${__dirname}\\svr\\app\\fsDesc\\fsSaveNode.ts`].map(fp => fp.split(/[\/\\]/).join(path.sep))
for (const orgf of linkFiles) {
    const tgt = path.join(__dirname, 'view', 'src', 'share', path.basename(orgf));
    console.log(`link ${tgt} => ${orgf}`)
    if(!fs.existsSync(tgt))
    {
        fs.symlinkSync(orgf, tgt );
    }
    
    
}