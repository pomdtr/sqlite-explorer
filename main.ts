import { createFetchHandler } from "./server.ts";

export default createFetchHandler({
  dbPath: "chinook.db",
});
