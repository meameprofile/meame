// RUTA: prettier.config.mjs
/**
 * @file prettier.config.mjs
 * @description SSoT para las reglas de formateo de código de Prettier.
 *              v2.1.0 (Deprecation Fix): Se elimina la opción obsoleta
 *              'jsxBracketSameLine' para una configuración limpia y moderna.
 * @version 2.1.0
 * @author RaZ Podestá - MetaShark Tech
 */

/** @type {import("prettier").Config} */
const config = {
  printWidth: 80,
  useTabs: false,
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  trailingComma: "es5",
  bracketSpacing: true,
};

export default config;
