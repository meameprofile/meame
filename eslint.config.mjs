// RUTA: eslint.config.mjs
/**
 * @file eslint.config.mjs
 * @description SSoT para la configuración de ESLint v9+ (Flat Config).
 * @version 3.0.0 (Modern Flat Config Syntax)
 * @author RaZ Podestá - MetaShark Tech
 */
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";
import prettierConfig from "eslint-config-prettier";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default tseslint.config(
  // Pilar 1: Ignorancia Soberana
  // Ignora directorios a nivel global para todos los plugins.
  {
    ignores: [
      "**/.next/**",
      "**/node_modules/**",
      "public/vendor/**/*.js",
      "supabase/", // Frontera de Dominio: ESLint ignora el dominio de Deno.
    ],
  },

  // Pilar 2: Reglas Base Recomendadas
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  // Pilar 3: Configuración Específica para JSX/TSX (React)
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "jsx-a11y": jsxA11yPlugin,
      "@next/next": nextPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      ...jsxA11yPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      ...reactHooksPlugin.configs.recommended.rules,
    },
  },

  // Pilar 4: Anulación de Entorno para Archivos CommonJS
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

  // Pilar 5: Pacto de No Agresión con Prettier
  // DEBE ser el último elemento para anular correctamente las reglas de estilo.
  prettierConfig
);
