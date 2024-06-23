import { serveDatabase } from "./server.ts";

export default {
  fetch: serveDatabase({
    dbPath: "chinook.db",
  }),
};
