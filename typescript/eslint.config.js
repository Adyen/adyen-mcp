import globals from "globals";
import tseslint from "typescript-eslint";
import prettierRecommended from "eslint-config-prettier";

export default tseslint.config(
    {
        languageOptions: {
            globals: globals.node,
        },
        ignores: ["dist", "node_modules"],
    },
    ...tseslint.configs.recommended,
    prettierRecommended,
    {
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    "argsIgnorePattern": "^_",
                    "varsIgnorePattern": "^_",
                    "caughtErrorsIgnorePattern": "^_",
                }
            ]
        },
    },
);