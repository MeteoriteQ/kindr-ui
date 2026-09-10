import { defineConfig, loadEnv } from "vite";
import { readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const target = env.SPRING_BOOT_URL || "http://127.0.0.1:8080";
  const proxy = {
    "/api": { target, changeOrigin: true },
    "/uploads": { target, changeOrigin: true },
  };
  return {
  cacheDir: ".vite-cache",
  optimizeDeps: {
    noDiscovery: true,
    include: ["react", "react-dom", "react-dom/client"],
    esbuildOptions: {
      plugins: [{
        name: "resolve-dependencies-with-node",
        setup(build) {
          // Node resolves dependencies reliably in restricted Windows environments.
          build.onResolve({ filter: /.*/ }, (args) => {
            if (args.namespace !== "node-dependency" && !args.path.includes("node_modules") && !args.importer.includes("node_modules")) return;
            const require = createRequire(args.importer && args.importer !== "<stdin>" ? args.importer : resolve("package.json"));
            return { path: require.resolve(args.path), namespace: "node-dependency" };
          });
          build.onLoad({ filter: /.*/, namespace: "node-dependency" }, (args) => ({
            contents: readFileSync(args.path, "utf8"), loader: "js",
          }));
        },
      }],
    },
  },
  server: {
    host: true,
    port: 5173, proxy,

  },
  preview: { proxy },
  build: {
    target: "esnext",
    rollupOptions: {
      input: Object.fromEntries(
        readdirSync(".")
          .filter((n) => n.endsWith(".html"))
          .map((n) => [n.slice(0, -5), resolve(n)]),
      ),
    },
  },
}; });
