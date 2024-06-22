// driver.ts
import type { InStatement, ResultSet } from "@libsql/client/web";
import {
  SqliteLikeBaseDriver,
  DatabaseHeader,
  DatabaseResultSet,
  DatabaseRow,
  convertSqliteType,
} from "@libsqlstudio/gui/driver";

export default class SqliteDriver extends SqliteLikeBaseDriver {
  protected authToken = "";

  supportBigInt(): boolean {
    return false;
  }

  async query(stmt: InStatement) {
    const resp = await fetch("/api/execute", {
      method: "POST",
      body: JSON.stringify({ statement: stmt }),
    });

    if (!resp.ok) {
      throw new Error(await resp.text());
    }

    const res = await resp.json();
    return transformRawResult(res);
  }

  async transaction(stmt: InStatement[]) {
    const resp = await fetch("/api/batch", {
      method: "POST",
      body: JSON.stringify({ statements: stmt }),
    });
    if (!resp.ok) {
      throw new Error(await resp.text());
    }

    const res = await resp.json();
    return res.map(transformRawResult);
  }
}

function transformRawResult(raw: ResultSet): DatabaseResultSet {
  const headerSet = new Set();

  const headers: DatabaseHeader[] = raw.columns.map((colName, colIdx) => {
    const colType = raw.columnTypes[colIdx];
    let renameColName = colName;

    for (let i = 0; i < 20; i++) {
      if (!headerSet.has(renameColName)) break;
      renameColName = `__${colName}_${i}`;
    }

    headerSet.add(renameColName);

    return {
      name: renameColName,
      displayName: colName,
      originalType: colType,
      type: convertSqliteType(colType),
    };
  });

  const rows = raw.rows.map((r) =>
    headers.reduce((a, b, idx) => {
      a[b.name] = r[idx];
      return a;
    }, {} as DatabaseRow)
  );

  return {
    rows,
    rowsAffected: raw.rowsAffected,
    headers,
    lastInsertRowid:
      raw.lastInsertRowid === undefined
        ? undefined
        : Number(raw.lastInsertRowid),
  };
}
