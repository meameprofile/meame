// RUTA: scripts/generation/generate-navigation-manifest.ts
/**
 * @file generate-navigation-manifest.ts
 * @description Script de élite para descubrir y generar automáticamente el manifiesto
 *              de rutas `navigation.ts`. Corregido para manejar correctamente los Grupos de Rutas.
 * @version 6.0.0 (Route Group Integrity)
 * @author L.I.A. Legacy
 */
import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";
import { type Locale, defaultLocale } from "@/shared/lib/i18n/i18n.config";
import { routes as routeDefinitions, RouteType } from "@/shared/lib/navigation";

const APP_ROOT_DIR = path.resolve(process.cwd(), "src", "app");
const OUTPUT_FILE = path.resolve(
  process.cwd(),
  "src",
  "shared",
  "lib",
  "navigation.ts"
);
const IGNORED_ENTITIES = new Set([
  "_components",
  "_hooks",
  "_actions",
  "_context",
  "_config",
  "_schemas",
  "_types",
  "_utils",
  "favicon.ico",
  "sitemap.ts",
  "layout.tsx",
  "loading.tsx",
  "error.tsx",
  "global-error.tsx",
  "not-found.tsx",
  "api",
  "auth", // Ignorar la carpeta auth a nivel raíz
]);

interface RouteInfo {
  key: string;
  pathTemplate: string;
  params: string[];
  type: "Public" | "DevOnly";
}

function toCamelCase(str: string): string {
  return str.replace(/[-_](.)/g, (_, char) => char.toUpperCase());
}

function generateKeyFromSegments(segments: string[]): string {
  const relevantSegments =
    segments[0] === "[locale]" ? segments.slice(1) : segments;
  if (relevantSegments.length === 0) return "home";

  const keyParts = relevantSegments
    .filter((segment) => !/^\(.*\)$/.test(segment)) // No incluir grupos en la clave
    .map((segment) =>
      segment
        .replace(
          /\[\[\.\.\.([^\]]+)\]\]/g, // Manejar catch-all opcional
          (_, param) => `With${param.charAt(0).toUpperCase() + param.slice(1)}`
        )
        .replace(
          /\[([^\]]+)\]/g, // Manejar segmentos dinámicos
          (_, param) => `By${param.charAt(0).toUpperCase() + param.slice(1)}`
        )
        .replace(/^./, (c) => c.toUpperCase())
    );

  const baseKey = keyParts.join("");
  const finalKey = toCamelCase(
    baseKey.charAt(0).toLowerCase() + baseKey.slice(1)
  );

  // Mapeos especiales para rutas raíz
  if (finalKey === "dev") return "devDashboard";
  if (finalKey === "login") return "login"; // Asumimos que /login es público

  return finalKey;
}

function discoverRoutes(
  currentDir: string,
  relativePathSegments: string[] = [],
  isDevZone: boolean = false
): RouteInfo[] {
  const routes: RouteInfo[] = [];
  let entries: fs.Dirent[];

  try {
    entries = fs.readdirSync(currentDir, { withFileTypes: true });
  } catch (error) {
    // Ignorar directorios que no existen o no se pueden leer (ej. symlinks rotos)
    return [];
  }

  const hasPageFile = entries.some(
    (e) => e.isFile() && e.name === "page.tsx"
  );

  // --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA v6.0.0] ---
  // Se filtran los segmentos que son grupos de rutas ANTES de construir la plantilla.
  const finalPathSegments = relativePathSegments
    .slice(1) // Siempre omitir el primer segmento `[locale]`
    .filter((segment) => !/^\(.*\)$/.test(segment));
  const pathTemplate = "/" + finalPathSegments.join("/");
  // --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA v6.0.0] ---

  if (hasPageFile) {
    const key = generateKeyFromSegments(relativePathSegments);
    const paramsInPathTemplate = (
      pathTemplate.match(/\[([^\]]+)\]/g) || []
    ).map((p) => p.replace(/\[|\]|\./g, ""));
    const type = isDevZone ? "DevOnly" : "Public";

    console.log(
      chalk.gray(
        `   Discovered: ${chalk.green(key)} -> ${chalk.yellow(pathTemplate)} (${type})`
      )
    );
    routes.push({
      key,
      pathTemplate: pathTemplate.replace(/\/$/, "") || "/",
      params: paramsInPathTemplate,
      type,
    });
  }

  for (const entry of entries) {
    if (entry.isDirectory() && !IGNORED_ENTITIES.has(entry.name)) {
      const nextRelativePathSegments = [...relativePathSegments, entry.name];
      const nextIsDevZone = isDevZone || entry.name === "(dev)";

      routes.push(
        ...discoverRoutes(
          path.join(currentDir, entry.name),
          nextRelativePathSegments,
          nextIsDevZone
        )
      );
    }
  }

  return routes;
}

function generateNavigationFileContent(routes: RouteInfo[]): string {
  const routesObjectContent = routes
    .map((route) => {
      const hasParams = route.params.length > 0;
      // Genera el tipo para los parámetros de la ruta de forma dinámica
      const paramsType = hasParams
        ? `RouteParams & { ${route.params
            .map((p) => `${toCamelCase(p)}: string | number | string[]`)
            .join("; ")} }`
        : "RouteParams";

      return `
  ${route.key}: {
    path: (params: ${paramsType}) => buildPath(params.locale, "${route.pathTemplate}", params),
    template: "${route.pathTemplate}",
    type: RouteType.${route.type},
  }`;
    })
    .join(",");

  return `// RUTA: src/shared/lib/navigation.ts
/**
 * @file navigation.ts
 * @description Manifiesto y SSoT para la definición de rutas del ecosistema.
 *              ESTE ARCHIVO ES GENERADO AUTOMÁTICAMENTE. NO LO EDITE MANUALMENTE.
 *              Ejecute 'pnpm gen:routes' para actualizarlo.
 * @version ${new Date().toISOString()}
 * @author Script de Generación Automática de Élite
 */
import { defaultLocale, type Locale } from "./i18n/i18n.config";

export const RouteType = {
  Public: "public",
  DevOnly: "dev-only",
} as const;

export type RouteType = (typeof RouteType)[keyof typeof RouteType];

export type RouteParams = {
  locale?: Locale;
  [key: string]: string | number | string[] | undefined;
};

const buildPath = (
  locale: Locale | undefined,
  template: string,
  params?: RouteParams
): string => {
  let path = \`/\${locale || defaultLocale}\${template}\`;
  if (params) {
    for (const key in params) {
      if (key !== "locale" && params[key] !== undefined) {
        const value = params[key];
        const stringValue = Array.isArray(value) ? value.join("/") : String(value);
        const placeholderRegex = new RegExp(\`\\[\\[?\\.\\.\\.\${key}\\]\\]?|\\[\${key}\\]\`);
        path = path.replace(placeholderRegex, stringValue);
      }
    }
  }
  path = path.replace(/\\/\\[\\[\\.\\.\\..*?\\]\\]/g, "");
  path = path.replace(/\\/+/g, "/");
  if (path !== "/" && path.endsWith("/")) {
    path = path.slice(0, -1);
  }
  return path || "/";
};

export const routes = {${routesObjectContent}
} as const;
`;
}

function main() {
  console.log(
    chalk.blue.bold(
      "🚀 Iniciando Generador de Manifiesto de Rutas de Élite v6.0..."
    )
  );
  try {
    const appPath = path.join(APP_ROOT_DIR);
    console.log(chalk.gray(`   Escaneando directorio base: ${appPath}`));

    // El descubrimiento comienza desde dentro de 'src/app/[locale]'
    const localeDir = path.join(appPath, "[locale]");
    const discoveredRoutes = discoverRoutes(localeDir, ["[locale]"]);

    if (discoveredRoutes.length === 0) {
      console.warn(
        chalk.yellow(
          "⚠️ No se descubrieron rutas. Verifica la estructura de 'src/app/[locale]'."
        )
      );
    }

    discoveredRoutes.sort((a, b) => a.key.localeCompare(b.key));

    const fileContent = generateNavigationFileContent(discoveredRoutes);
    fs.writeFileSync(OUTPUT_FILE, fileContent, "utf-8");

    console.log(
      chalk.green(
        `✅ Manifiesto de navegación generado con éxito en ${chalk.yellow(
          path.relative(process.cwd(), OUTPUT_FILE)
        )}`
      )
    );
    console.log(
      chalk.cyan(
        `   Total de ${discoveredRoutes.length} rutas descubiertas y registradas.`
      )
    );
  } catch (error) {
    console.error(
      chalk.red.bold("🔥 Error crítico durante la generación del manifiesto:"),
      error
    );
    process.exit(1);
  }
}

main();
