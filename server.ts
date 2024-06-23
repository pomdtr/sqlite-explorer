import * as libsql from "npm:@libsql/client@0.6.2/sqlite3";
import { Hono } from "jsr:@hono/hono@4.4.7";
import dir from "./dist/dir.ts";
import { serveStatic } from "jsr:@nfnitloop/deno-embedder@1.4.1/helpers/hono";
import { isAbsolute, join } from "jsr:@std/path@0.225.2";

export type SqliteOptions = { dbPath?: string };

type ServeHandler = (req: Request) => Response | Promise<Response>;
export function serveDatabase(options: SqliteOptions): ServeHandler {
  if (!options.dbPath) {
    throw new Error("Missing dbPath");
  }

  let dbPath = options.dbPath;
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

  app.use("*", serveStatic({ root: dir }));

  return app.fetch;
}
