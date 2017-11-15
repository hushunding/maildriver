import { NeDBPromise } from './nedb-promise';

export class UploadFileList {
    private _db: NeDBPromise<{}>;
    constructor(dataFilePath: string) {
        this._db = new NeDBPromise({ filename: dataFilePath, autoload: true });
        this._db.ensureIndex({ fieldName: 'fullname', unique: true });
    }
    public New() {

    }
}
