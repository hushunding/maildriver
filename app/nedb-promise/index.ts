import * as Nedb from "nedb";
import * as util from 'util';
export class NeDBPromise<T> extends Nedb {
    public insertAsync: (arg1: T | T[]) => Promise<void>;
    public findAsync: (query: {}) => Promise<T[]>;
    constructor(pathOrOptions?: string | Nedb.DataStoreOptions) {
        super(pathOrOptions);
        this.findAsync = util.promisify<{}, T[]>(this.find);
        this.insertAsync = util.promisify<T | T[]>(this.insert);
    }
    public findandSortAsync(query: {}, stort: {}): Promise<T[]> {
        return new Promise((r, j) => {
            this.find(query).sort(stort).exec((err, doc: T[]) => {
                if (err) {
                    j(err);
                } else {
                    r(doc);
                }
            });
        });
    }
}
