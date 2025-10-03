// RUTA: tailwind.config.mjs
/**
 * @file tailwind.config.mjs
 * @description SSoT para la configuración de Tailwind CSS v4, ahora utilizando
 *              sintaxis de ES Modules pura para una coherencia arquitectónica total.
 * @version 3.0.0 (ESM Syntax & Architectural Alignment)
 *@author RaZ Podestá - MetaShark Tech
 * @see src/app/globals.css - Esta es la SSoT para el sistema de diseño.
 */
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [typography],
};

export default config;
