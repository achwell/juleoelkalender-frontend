import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
        { ignores: ["build", "dist"] },
        {
            extends: [
                js.configs.recommended,
                ...tseslint.configs.recommendedTypeChecked,
                {
                    languageOptions: {
                        parserOptions: {
                            projectService: true,
                            tsconfigRootDir: import.meta.dirname,
                        },
                    },
                },
            ],
            files: ["**/*.{ts,tsx}"],
            languageOptions: {
                ecmaVersion: 2020,
                globals: globals.browser,
            },
            plugins: {
                "react-hooks": reactHooks,
                "react-refresh": reactRefresh,
            },
            rules: {
                ...reactHooks.configs.recommended.rules,
                "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
                "@typescript-eslint/no-namespace": "off",
                "@typescript-eslint/no-misused-promises": [
                    "error",
                    {
                        "checksVoidReturn": {
                            "arguments": false,
                            "attributes": false
                        }
                    }
                ],
                "@typescript-eslint/no-floating-promises": [
                    "error",
                    {
                        "checksVoidReturn": {
                            "arguments": false,
                            "attributes": false
                        }
                    }
                ],
            },
        }
);
