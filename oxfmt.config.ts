import { defineConfig } from "oxfmt";

export default defineConfig({
  printWidth: 120,
  ignorePatterns: [".husky/**", "dist/**", "node_modules/**", "public/**"],
});
