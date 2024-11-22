import eslintPluginPrettier from "eslint-plugin-prettier";

export default [
    {
        files: ["src/**/*.{js,jsx,ts,tsx}"], // Target files in the src folder
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: "module",
            globals: {
                browser: true, // For browser environment
                node: true,    // For Node.js environment
                es2021: true,  // ES2021 features
            },
        },
        plugins: {
            prettier: eslintPluginPrettier,
        },
        rules: {
            "prettier/prettier": "error", // Prettier formatting issues are treated as errors
            "no-unused-vars": "warn",    // Warn for unused variables
            "no-console": "off",         // Allow console.log statements
        },
    },
];
