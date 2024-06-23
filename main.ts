import { serveDatabase } from "./server.ts";
import { lastlogin } from "jsr:@pomdtr/lastlogin@0.0.2";

const auth = lastlogin({
  verifyEmail: (email) => email === "achille.lacoin@gmail.com",
});

export default {
  fetch: auth(serveDatabase({ dbPath: "./chinook.db" })),
};
