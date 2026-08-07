import js from "@eslint/js"
import globals from "globals"
import eslintReact from "@eslint-react/eslint-plugin"
import tseslint from "typescript-eslint"
import eslintStorybook from "eslint-plugin-storybook"

export default tseslint.config(
    { ignores: ["dist", "storybook-static"] },
    {
        extends: [js.configs.recommended, tseslint.configs.recommended, eslintReact.configs["recommended-typescript"]],
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser
        },
        rules: {
            "no-unused-vars": ["off"],
            "@typescript-eslint/no-unused-vars": ["warn"]
        }
    },
    {
        extends: [eslintStorybook.configs["flat/recommended"]],
        files: ["src/stories/**/*.{ts,tsx}"],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser
        }
    }
)
