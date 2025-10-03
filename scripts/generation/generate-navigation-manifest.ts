// scripts/generation/generate-navigation-manifest.ts
/**
 * @file generate-navigation-manifest.ts
 * @description Script de élite para descubrir y generar automáticamente el manifiesto
 *              de rutas `lib/navigation.ts`. Es semánticamente consciente de la
 *              estructura del App Router, incluyendo Grupos de Rutas y segmentos dinámicos.
 * @version 5.0.0 (Definitive Logic & Elite Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";

const APP_ROOT_DIR = path.resolve(process.cwd(), "app");
const OUTPUT_FILE = path.resolve(process.cwd(), "lib/navigation.ts");
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

  const keyParts = relevantSegments.map((segment) =>
    segment
      .replace(
        /\[([^\]]+)\]/g,
        (_, param) => `By${param.charAt(0).toUpperCase() + param.slice(1)}`
      )
      .replace(/^\(.*\)$/, "")
      .replace(/^./, (c) => c.toUpperCase())
  );
  const filteredKeyParts = keyParts.filter((part) => part !== "");
  const baseKey = filteredKeyParts.join("");
  const finalKey = toCamelCase(
    baseKey.charAt(0).toLowerCase() + baseKey.slice(1)
  );

  if (finalKey === "dev") return "devDashboard";
  if (finalKey === "login") return "devLogin";

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
    console.error(
      chalk.red(
        `[Generator Error] No se pudo escanear el directorio: ${currentDir}.`
      )
    );
    throw error;
  }

  const hasPageFile = entries.some((e) => e.isFile() && e.name === "page.tsx");
  // --- [INICIO DE CORRECCIÓN LÓGICA] ---
  // La plantilla de ruta ahora omite el segmento `[locale]` inicial.
  const pathTemplate =
    "/" +
    (relativePathSegments[0] === "[locale]"
      ? relativePathSegments.slice(1)
      : relativePathSegments
    ).join("/");
  // --- [FIN DE CORRECCIÓN LÓGICA] ---

  if (hasPageFile) {
    const key = generateKeyFromSegments(relativePathSegments);
    const paramsInPathTemplate = (
      pathTemplate.match(/\[([^\]]+)\]/g) || []
    ).map((p) => p.slice(1, -1));
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
      const isRouteGroup = /^\(.*\)$/.test(entry.name);
      const nextRelativePathSegments = isRouteGroup
        ? relativePathSegments
        : [...relativePathSegments, entry.name];
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
      const paramsType = hasParams
        ? `RouteParams & { ${route.params.map((p) => `${toCamelCase(p)}: string | number`).join("; ")} }`
        : "RouteParams";

      let pathFunctionBody = route.pathTemplate;

      route.params.forEach((param) => {
        pathFunctionBody = pathFunctionBody.replace(
          `[${param}]`,
          `\${params.${toCamelCase(param)}}`
        );
      });

      // La función ahora construye la URL correctamente, anteponiendo el locale a la plantilla ya limpia.
      const pathFunction = `(params: ${paramsType}) => \`/\${params.locale || defaultLocale}${pathFunctionBody}\`.replace(/[/]{2,}/g, '/').replace(/[/]$/, '') || '/'`;

      return `
  ${route.key}: {
    path: ${pathFunction},
    type: RouteType.${route.type},
  }`;
    })
    .join(",");

  return `// lib/navigation.ts
/**
 * @file navigation.ts
 * @description Manifiesto y SSoT para la definición de rutas.
 *              ESTE ARCHIVO ES GENERADO AUTOMÁTICAMENTE. NO LO EDITE MANUALMENTE.
 *              Ejecute 'pnpm gen:routes' para actualizarlo.
 * @version ${new Date().toISOString()}
 * @author Script de Generación Automática de Élite
 */
import { defaultLocale, type Locale } from "@/shared/lib/i18n/i18n.config";

export const RouteType = {
  Public: "public",
  DevOnly: "dev-only",
} as const;

export type RouteType = (typeof RouteType)[keyof typeof RouteType];

export type RouteParams = {
  locale?: Locale;
  [key: string]: string | number | undefined;
};

export const routes = {${routesObjectContent}
} as const;
`;
}

function main() {
  console.log(
    chalk.blue.bold(
      "🚀 Iniciando Generador de Manifiesto de Rutas de Élite v5.0..."
    )
  );
  try {
    const appPath = path.join(APP_ROOT_DIR);
    console.log(chalk.gray(`   Escaneando directorio base: ${appPath}`));

    const discoveredRoutes = discoverRoutes(appPath);

    if (discoveredRoutes.length === 0) {
      console.warn(
        chalk.yellow(
          "⚠️ No se descubrieron rutas. Verifica la estructura de 'app/'."
        )
      );
    }

    discoveredRoutes.sort((a, b) => a.key.localeCompare(b.key));

    const outputDirPath = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDirPath)) {
      fs.mkdirSync(outputDirPath, { recursive: true });
    }

    const fileContent = generateNavigationFileContent(discoveredRoutes);
    fs.writeFileSync(OUTPUT_FILE, fileContent, "utf-8");

    console.log(
      chalk.green(
        `✅ Manifiesto de navegación generado con éxito en ${chalk.yellow(path.relative(process.cwd(), OUTPUT_FILE))}`
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
// scripts/generation/generate-navigation-manifest.ts
