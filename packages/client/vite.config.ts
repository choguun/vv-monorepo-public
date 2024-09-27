/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from "fs";
import path from "path";

import react from "@vitejs/plugin-react";
import { defineConfig, Plugin, ConfigEnv, loadEnv } from "vite";

const particleWasmPlugin: Plugin | undefined = {
  name: "particle-wasm",
  apply: (_, env: ConfigEnv) => {
    return env.mode === "development";
  },
  buildStart: () => {
    const copiedPath = path.join(
      __dirname,
      "node_modules/@particle-network/thresh-sig/wasm/thresh_sig_wasm_bg.wasm"
    );
    const dir = path.join(__dirname, "node_modules/.vite/wasm");
    const resultPath = path.join(dir, "thresh_sig_wasm_bg.wasm");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.copyFileSync(copiedPath, resultPath);
  },
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    define: {
      "process.env": env,
    },
    server: {
      port: 3002,
      host: "0.0.0.0",
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
        stream: "stream-browserify",
        util: "util",
      },
    },
    clearScreen: false,
    plugins: [react(), particleWasmPlugin],
  };
});
