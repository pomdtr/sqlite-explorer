import * as libsql from "npm:@libsql/client@0.6.2/sqlite3";
import { Hono } from "jsr:@hono/hono@4.4.7";
import { serveDir } from "./dist/dir.ts";
import { isAbsolute, join } from "jsr:@std/path@0.225.2";

export type SqliteParams = {
  /**
   * The path to the SQLite database file.
   */
  dbPath: string;
};

type ServeHandler = (req: Request) => Response | Promise<Response>;

/**
 * Serves a SQLite database over HTTP.
 * Also includes a powerful web interface for executing SQL queries.
 *
 * @param {SqliteParams} params - The parameters for the SQLite server.
 */
export function serveDatabase(
  params: SqliteParams,
): ServeHandler {
  return (req: Request) => {
    if (!params.dbPath) {
      throw new Error("Missing dbPath");
    }

    let dbPath = params.dbPath;
    if (!isAbsolute(dbPath)) {
      dbPath = join(Deno.cwd(), dbPath);
    }

    const client = libsql.createClient({
      url: `file://${dbPath}`,
    });

    const app = new Hono();

    app.post("/api/execute", async (c) => {
      const { statement } = await c.req.json();
      const res = await client.execute(statement);
      return c.json(res);
    });

    app.post("/api/batch", async (c) => {
      const { statements, mode } = await c.req.json();
      if (!statements) {
        return new Response("No statements", { status: 400 });
      }

      const res = client.batch(statements, mode);
      return new Response(JSON.stringify(res));
    });

    app.get("*", (c) => {
      return serveDir(c.req.raw);
    });

    return app.fetch(req);
  };
}
