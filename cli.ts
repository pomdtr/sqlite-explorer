#!/usr/bin/env -S deno run -A
import manifest from "./deno.json" with { type: "json" };
import { createFetchHandler } from "./server.ts";
import { parseArgs } from "jsr:@std/cli@0.224.1/parse-args";
import { basename } from "jsr:@std/path@0.225.2";

const executable = import.meta.filename ? basename(import.meta.filename) : "sqlite-explorer";
const usage = `
Usage: ${executable} [options] <dbPath>

Options:
  -p <port>   Port to listen on (default: 8080)
  -v          Print version
  -h          Print help
`.trim()


const { _: args, ...flags } = parseArgs(Deno.args, {
  string: ["p"],
  boolean: ["v", "h"]
});

if (flags.h) {
  console.log(usage);
  Deno.exit()
}

if (flags.v) {
  console.log(manifest.version)
  Deno.exit()
}

if (args.length !== 1) {
  console.error("db path is required");
  Deno.exit(1);
}

if (typeof args[0] !== "string") {
  console.error("Invalid db path");
  Deno.exit(1);
}

const handler = createFetchHandler({
  dbPath: args[0],
});

const port = parseInt(flags.p || "8080");

Deno.serve({ port }, handler.fetch);
