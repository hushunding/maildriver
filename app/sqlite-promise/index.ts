import * as sqlite3 from 'sqlite3';
import * as util from 'util';

export class StatementPromise {
    public run: (arg1: any) => Promise<void>;
    constructor(private _smt: sqlite3.Statement) {
        this.run = util.promisify(this._run);
    }
    public finalize(): void {
        this._smt.finalize();
    }
    private _run(params: any, callback?: (err: NodeJS.ErrnoException) => void): void {
        this._smt.run(params, callback);
    }
}
export class DatabasePromise {
    public all: (arg1: string) => Promise<any[]>;
    public run: (arg1: string) => Promise<void>;
    private _db: sqlite3.Database;

    constructor(filename: string) {
        this._db = new sqlite3.Database(filename);
        this.run = util.promisify(this._run);
        this.all = util.promisify(this._all);
    }

    private _run(sql: string, callback?: (err: NodeJS.ErrnoException) => void): void {
        this._db.run(sql, callback);
    }
    private _all(sql: string, callback?: (err: NodeJS.ErrnoException, rows: any[]) => void): void {
        this._db.all(sql, callback);
    }
    public prepare(sql: string): StatementPromise {
        return new StatementPromise(this._db.prepare(sql));
    }

}
