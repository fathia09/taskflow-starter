import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // Configuration générale
  {
    files: ["**/*.js"],
    plugins: {
      js,
    },
    extends: ["js/recommended"],
  },

  // Node.js : server.js
  {
    files: ["server.js"],
    languageOptions: {
      globals: globals.node,
      sourceType: "commonjs",
    },
  },

  // Navigateur : public/app.js
  {
    files: ["public/**/*.js"],
    languageOptions: {
      globals: globals.browser,
      advanceStatus: "readonly",
      deleteTask: "readonly",
    },
  },

  // Configuration ESLint
  {
    files: ["eslint.config.mjs"],
    languageOptions: {
      globals: globals.node,
      sourceType: "module",
    },
  },
]);