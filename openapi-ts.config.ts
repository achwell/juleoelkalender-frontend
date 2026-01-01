import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
    input: "./openapi.json",
    output: {
        clean: true,
        format: "prettier",
        lint: "eslint",
        path: "./src/types/generated",
    },
    parser: {
        transforms: {
            enums: "root",
        },
    },
    plugins: [
        "zod",
        {
            name: "@hey-api/typescript",
            enums: "typescript",
        },
        {
            enums: {
                case: "SCREAMING_SNAKE_CASE",
                mode: "typescript",
            },
            name: "@hey-api/typescript",
        },
        {
            name: "@hey-api/transformers",
            dates: true,
        },
    ],
    logs: {
        level: "debug",
    },
});
