let fs = require('fs');
let path = require('path')
const svrCodepath = 'svr'
let linkFiles = [`${__dirname}/svr/app/cmdsrv/ICmdChn.ts`].map(fp => fp.split(/[\/\\]/).join(path.sep))
for (const orgf of linkFiles) {
    const tgt = path.join(__dirname, 'view', 'src', 'share', path.basename(orgf));
    console.log(`link ${tgt} => ${orgf}`)
    fs.symlinkSync(orgf, tgt );
    
}