// eslint.config.mjs
/**
 * @file eslint.config.mjs
 * @description SSoT para la configuración de ESLint v9+ (Flat Config).
 * @version 2.3.0 (CJS Environment Override)
 * @author L.I.A. Legacy
 */
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";
import prettierConfig from "eslint-config-prettier";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";

/** @type {import('eslint').Linter.FlatConfig[]} */
const config = tseslint.config(
  {
    ignores: ["**/.next/**", "**/node_modules/**", "public/vendor/**/*.js"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "jsx-a11y": jsxA11yPlugin,
    },
    rules: jsxA11yPlugin.configs.recommended.rules,
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      ...reactHooksPlugin.configs.recommended.rules,
    },
  },
  // --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA] ---
  // Se añade un objeto de configuración específico para archivos CommonJS.
  {
    files: ["**/*.cjs"],
    languageOptions: {
      globals: {
        module: "readonly",
        require: "readonly",
        __dirname: "readonly",
        process: "readonly",
      },
    },
  },
  // --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA] ---
  prettierConfig
);

export default config;
