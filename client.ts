/* Open in Val Town: https://www.val.town/v/std/sqlite */
import { version } from "./deno.json" with { type: "json" };

export type SqliteOptions = {
  url: string;
};

/**
 * Every Val Town account comes with its own private
 * [SQLite database](https://www.sqlite.org/) that
 * is accessible from any of your vals.
 * ([Docs â†—](https://docs.val.town/std/sqlite))
 */
export class Sqlite {
  constructor(public options: SqliteOptions) {}
  /**
   * Executes a SQLite statement.
   *
   * @param {InStatement} statement - The SQLite statement to execute.
   * @example String query:
   * `sqlite.execute("SELECT 1;")`
   * @example Query with arguments:
   * `sqlite.execute({sql: "SELECT * from books WHERE year > ?;", args: [2020]})`
   */
  async execute(statement: InStatement): Promise<ResultSet> {
    const url = new URL("/api/execute", this.options.url);
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Client-Version": version,
      },
      body: JSON.stringify({ statement }),
    });
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res.json();
  }

  /**
   * Executes a batch of SQLite statements.
   *
   * @param {InStatement[]} statements - An array of SQLite statements to execute.
   * @param {TransactionMode} [mode] - The transaction mode for the batch execution.
   */
  async batch(
    statements: InStatement[],
    mode?: TransactionMode
  ): Promise<ResultSet[]> {
    const url = new URL("/api/batch", this.options.url);
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Client-Version": version,
      },
      body: JSON.stringify({ statements, mode }),
    });
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res.json();
  }
}

// ------------
// Helpers
// ------------

// We patch these types to only support JSON values
export type InValue = null | string | number | boolean;
export type InArgs = Array<InValue> | Record<string, InValue>;
export type InStatement =
  | {
      /**
       * The SQL statement to execute.
       */
      sql: string;

      /**
       * The arguments to bind to the SQL statement.
       */
      args: InArgs;
    }
  | string;
export interface ResultSet {
  /** Names of columns.
   *
   * Names of columns can be defined using the `AS` keyword in SQL:
   *
   * ```sql
   * SELECT author AS author, COUNT(*) AS count FROM books GROUP BY author
   * ```
   */
  columns: Array<string>;

  /** Types of columns.
   *
   * The types are currently shown for types declared in a SQL table. For
   * column types of function calls, for example, an empty string is
   * returned.
   */
  columnTypes: Array<string>;

  /** Rows produced by the statement. */
  rows: Array<Array<unknown>>;

  /** Number of rows that were affected by an UPDATE, INSERT or DELETE operation.
   *
   * This value is not specified for other SQL statements.
   */
  rowsAffected: number;

  /** ROWID of the last inserted row.
   *
   * This value is not specified if the SQL statement was not an INSERT or if the table was not a ROWID
   * table.
   */
  lastInsertRowid: bigint | undefined;
}

export type TransactionMode = "write" | "read" | "deferred";
