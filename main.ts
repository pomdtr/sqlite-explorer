import { serveDatabase } from "./server.ts";
import { lastlogin } from "jsr:@pomdtr/lastlogin@0.0.2";

const auth = lastlogin({
  verifyEmail: (email) => email === "achille.lacoin@gmail.com",
});

const handler = serveDatabase({ dbPath: "./chinook.db" });

export default {
  fetch: auth(handler),
};
