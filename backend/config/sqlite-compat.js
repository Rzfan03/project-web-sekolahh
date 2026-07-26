import initSqlJs from "sql.js";
import fs from "fs";
import path from "path";

let SQL;
const dbInstances = new Map();

const OPEN_READWRITE = 1;
const OPEN_CREATE = 2;

class Database {
  constructor(filename, mode, callback) {
    if (typeof mode === "function") {
      callback = mode;
      mode = OPEN_READWRITE | OPEN_CREATE;
    }
    this.filename = filename;
    this.uuid = filename;

    (async () => {
      try {
        if (!SQL) {
          SQL = await initSqlJs();
        }

        if (dbInstances.has(filename)) {
          this._db = dbInstances.get(filename);
        } else {
          if (filename && filename !== ":memory:" && fs.existsSync(filename)) {
            const buffer = fs.readFileSync(filename);
            this._db = new SQL.Database(buffer);
          } else {
            this._db = new SQL.Database();
          }
          dbInstances.set(filename, this._db);
        }
        callback(null);
      } catch (err) {
        callback(err);
      }
    })();
  }

  serialize(callback) {
    return callback();
  }

  run(sql, params, callback) {
    if (typeof params === "function") {
      callback = params;
      params = [];
    }
    const noop = () => {};
    const cb = callback || noop;
    try {
      this._db.run(sql, params || []);
      this._save();
      const rowid = this._db.exec("SELECT last_insert_rowid()");
      const lastID = rowid.length > 0 ? rowid[0].values[0][0] : 0;
      const changes = this._db.getRowsModified() || 0;
      const stmt = { lastID: lastID || 0, changes, constructor: { name: "Statement" } };
      cb.call(stmt, null, stmt);
    } catch (err) {
      cb(err);
    }
  }

  all(sql, params, callback) {
    if (typeof params === "function") {
      callback = params;
      params = [];
    }
    const noop = () => {};
    const cb = callback || noop;
    try {
      const results = this._db.exec(sql, params || []);
      let rows;
      if (results.length === 0) {
        rows = [];
      } else {
        const columns = results[0].columns;
        rows = results[0].values.map((vals) => {
          const row = {};
          columns.forEach((col, i) => {
            row[col] = vals[i];
          });
          return row;
        });
      }
      const stmt = { constructor: { name: "Statement" } };
      cb.call(stmt, null, rows);
    } catch (err) {
      cb(err);
    }
  }

  close(callback) {
    const noop = () => {};
    const cb = callback || noop;
    this._save();
    cb(null);
  }

  _save() {
    if (this.filename && this.filename !== ":memory:") {
      try {
        const data = this._db.export();
        const dir = path.dirname(this.filename);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(this.filename, Buffer.from(data));
      } catch (err) {
        console.error("Gagal simpan database:", err.message);
      }
    }
  }
}

export default {
  Database,
  OPEN_READWRITE,
  OPEN_CREATE,
};
