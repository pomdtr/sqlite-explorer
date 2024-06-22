import {E} from "jsr:@nfnitloop/deno-embedder@1.4.1/embed.ts"

export default E({
  "assets/index-C0_zK9h0.css": () => import("./assets/index-C0_zK9h0.css_.ts"),
  "assets/index-k2UmuoQu.js": () => import("./assets/index-k2UmuoQu.js_.ts"),
  "index.html": () => import("./index.html_.ts"),
  "vite.svg": () => import("./vite.svg_.ts"),
})
