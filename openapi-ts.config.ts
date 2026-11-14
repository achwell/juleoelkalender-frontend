import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "./openapi.json",
  output: {
    clean: true,
    path: "./src/types/generated",
  },
  parser: {
    transforms: {
      enums: "root",
    },
  },
  plugins: [
    {
      name: "zod",
      dates: {
        offset: true,
      },
      $resolvers: {
        string: (ctx) => (ctx.schema.format === "binary" ? ctx.$.call(ctx.$.attr(ctx.$("z"), "file")) : undefined),

        number: (ctx) => {
          if (ctx.schema.type === "integer" && ctx.schema.format === "int32") {
            return ctx.$.call(ctx.$.attr(ctx.$("z"), "int"));
          }
          if (ctx.schema.type === "integer" && ctx.schema.format === "int64") {
            return ctx.$.call(ctx.$.attr(ctx.$("z"), "int"));
          }

          return undefined;
        },
      },
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
