// src/config/branding.config.ts
/**
 * @file src/config/branding.config.ts
 * @description SSoT programática para los NOMBRES de los tokens de diseño.
 *              - v2.0.0 (Theming Sovereignty): Refactorizado para eliminar la
 *                definición de valores, que ahora reside exclusivamente en
 *                `app/globals.css`. Este archivo solo exporta las claves de
 *                los tokens para uso programático (ej. en el Dev Canvas).
 * @version 2.0.0
 * @author RaZ Podestá - MetaShark Tech
 */

/**
 * @constant GLOBAL_DESIGN_TOKENS
 * @description Objeto que encapsula los nombres de los tokens de diseño del proyecto.
 *              Sus valores son placeholders que coinciden con los nombres de las
 *              variables CSS semánticas. LA SSoT DE LOS VALORES REALES ES globals.css.
 */
export const GLOBAL_DESIGN_TOKENS = {
  colors: {
    primary: "hsl(var(--primary))",
    "primary-foreground": "hsl(var(--primary-foreground))",
    secondary: "hsl(var(--secondary))",
    "secondary-foreground": "hsl(var(--secondary-foreground))",
    background: "hsl(var(--background))",
    foreground: "hsl(var(--foreground))",
    accent: "hsl(var(--accent))",
    "accent-foreground": "hsl(var(--accent-foreground))",
    muted: "hsl(var(--muted))",
    "muted-foreground": "hsl(var(--muted-foreground))",
  },
  fonts: {
    sans: "var(--font-sans)",
    serif: "var(--font-serif)",
  },
  breakpoints: {
    sm: "40rem",
    md: "48rem",
    lg: "64rem",
    xl: "80rem",
    "2xl": "96rem",
  },
} as const;
// src/config/branding.config.ts
