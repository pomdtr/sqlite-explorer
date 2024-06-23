#!/usr/bin/env -S deno run -A
import manifest from "./deno.json" with { type: "json" };
import { serveDatabase } from "./server.ts";
import { Command } from "jsr:@cliffy/command@1.0.0-rc.4";

const command = new Command()
  .name("sqlite-server")
  .version(manifest.version).arguments("<dbPath:string>").description(
    "Start a SQLite server.",
  ).option("-p, --port <port:number>", "The port to listen on.", {
    default: 8080,
  })
  .action(({ port }, dbPath) => {
    Deno.serve({ port }, serveDatabase({ dbPath }));
  });

await command.parse(Deno.args);
