import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { resolve } from "node:path";
import type { Plugin } from "vite";
import { configDefaults, defineConfig } from "vitest/config";
import { generateServiceWorker } from "./scripts/generate-service-worker.ts";

function serviceWorkerPlugin(): Plugin {
  let outputDirectory: string;

  return {
    name: "service-worker",
    apply: "build",
    configResolved(config) {
      outputDirectory = resolve(config.root, config.build.outDir);
    },
    async writeBundle() {
      await generateServiceWorker(outputDirectory);
    },
  };
}

export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset({ target: "19" })] }), tailwindcss(), serviceWorkerPlugin()],
  resolve: {
    tsconfigPaths: true,
  },
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
  build: {
    sourcemap: process.env.SOURCE_MAP === "true",
    rolldownOptions: {
      output: {
        codeSplitting: {
          // Keep dependencies used only by lazy routes out of the initial chunks.
          groups: [
            { name: "react", test: /\/node_modules\/(?:react|react-dom|scheduler)\// },
            { name: "redux", test: /\/node_modules\/(?:@reduxjs\/[^/]+|redux|react-redux|redux-persist)\// },
            { name: "auth", test: /\/node_modules\/(?:reactjs-social-login|@react-oauth\/[^/]+|jwt-decode)\// },
            { name: "emotion", test: /\/node_modules\/@emotion\// },
            { name: "i18next", test: /\/node_modules\/(?:i18next(?:-[^/]+)?|react-i18next)\// },
          ].map((group) => ({ ...group, entriesAware: true })),
        },
      },
    },
  },
  test: {
    globals: true,
    environment: "happy-dom",
    exclude: [...configDefaults.exclude, "scripts/**", "e2e/**"],
  },
});
