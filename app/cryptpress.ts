//加密解密
import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import * as iconv from 'iconv-lite';
import * as crypto from 'crypto';

function getFileHash(filePath: string) {
    const hash = crypto.createHash('sha1');
    fs.createReadStream(filePath).pipe(hash);
    return hash.digest('hex');

}
export async function zipfiles(fileList: Map<string, string>, outDir: string) {
    for (const [k, v] of fileList) {
        await ((key, fileList) => {
            const { res, fileIndex } = zipFile(k, outDir);
            if (res) {
                fileList.set(k, fileIndex);
            }
        })(k, fileList);
    }
}
export function zipFile(fileName: string, outDir: string, fileIndex: string = null) {
    let res = false;
    let storeSize = 0;
    try {
        if (fileIndex === null) {
            fileIndex = getFileHash(fileName);
        }
        const tgtfileName = `${outDir}\\${fileIndex}`;
        if (!fs.existsSync(tgtfileName)) {
            const out: Buffer = execSync(['7za.exe', 'a', '-t7z', `${tgtfileName}\\_.7z`, `"${fileName}"`, '-pfirst_7247 -v5m -mhe'].join(" "));
            console.log(iconv.decode(out, 'gbk'));
        }
        res = true;
        storeSize = calc7zSize(tgtfileName);
        return { res, fileIndex, storeSize };
    } catch (error) {
        console.log(iconv.decode(error.stderr, 'gbk'));
        fileIndex = null;
        return { res, fileIndex, storeSize };
    }
}
function calc7zSize(tgtdir: string) {
    let sum = 0;
    for (const file of fs.readdirSync(tgtdir)) {
        sum += fs.statSync(path.join(tgtdir, file)).size;
    }
    return sum;
}

// let root = 'D:\\Utility\\ap\\'
// const fl = new Map<string, string>()
// for (let f of fs.readdirSync(root)) {
//     fl.set(`${root}${f}`, "");
// }
// zipfiles(fl, 'tgt').then(() => {
//     console.log(fl)
// })