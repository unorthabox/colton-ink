// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://colton.ink",
  output: "static",
  build: {
    // Emit /about/index.html style paths — clean URLs on Cloudflare Pages.
    format: "directory",
  },
  server: {
    // Dev server is previewed from Colton's Mac over the LAN.
    host: true,
    port: 4321,
  },
});
