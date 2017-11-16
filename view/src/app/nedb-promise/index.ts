import * as Nedb from "nedb";
export class NeDBPromise<T> extends Nedb {

    constructor(pathOrOptions?: string | Nedb.DataStoreOptions) {
        super(pathOrOptions);
    }
    public insertAsync(newDoc: T | T[]): Promise<void> {
        return new Promise((r, j) => {
            this.insert(newDoc, (err) => {
                if (err) {
                    j(err);
                } else {
                    r();
                }
            });
        });
    }
    public findAsync(query: {}): Promise<T[]> {
        return new Promise((r, j) => {
            this.find(query, (err, doc: T[]) => {
                if (err) {
                    j(err);
                } else {
                    r(doc);
                }
            });
        });
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
