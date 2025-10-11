// RUTA: scripts/generation/generate-navigation-manifest.ts
/**
 * @file generate-navigation-manifest.ts
 * @description Script de élite para descubrir y generar automáticamente el manifiesto
 *              de rutas `navigation.ts`, ahora con una construcción de RegExp robusta
 *              y observabilidad de ciclo de vida completo.
 * @version 9.1.0 (Regex Integrity & Elite Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
import * as fs from "fs";
import * as path from "path";

import chalk from "chalk";

import { logger } from "@/shared/lib/logging";

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
  "auth",
]);

const PROTECTED_ROOT_DIRS = new Set(["(dev)", "creator"]);

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
  const relevantSegments = segments
    .slice(1)
    .filter((segment) => !/^\(.*\)$/.test(segment));

  if (relevantSegments.length === 0) {
    return "home";
  }

  const keyParts = relevantSegments.map((segment) =>
    segment
      .replace(
        /\[\[\.\.\.([^\]]+)\]\]/g,
        (_, param) => `With${param.charAt(0).toUpperCase() + param.slice(1)}`
      )
      .replace(
        /\[([^\]]+)\]/g,
        (_, param) => `By${param.charAt(0).toUpperCase() + param.slice(1)}`
      )
      .replace(/^./, (c) => c.toUpperCase())
  );

  const baseKey = keyParts.join("");
  const finalKey = toCamelCase(
    baseKey.charAt(0).toLowerCase() + baseKey.slice(1)
  );

  if (finalKey === "dev") return "devDashboard";
  if (finalKey === "login") return "login";

  return finalKey;
}

function discoverRoutes(
  currentDir: string,
  relativePathSegments: string[] = [],
  isDevZone = false
): RouteInfo[] {
  const routes: RouteInfo[] = [];
  let entries: fs.Dirent[];

  try {
    entries = fs.readdirSync(currentDir, { withFileTypes: true });
  } catch {
    return [];
  }

  const hasPageFile = entries.some((e) => e.isFile() && e.name === "page.tsx");

  const finalPathSegments = relativePathSegments
    .slice(1)
    .filter((segment) => !/^\(.*\)$/.test(segment));
  const pathTemplate = "/" + finalPathSegments.join("/");

  if (hasPageFile) {
    const key = generateKeyFromSegments(relativePathSegments);
    const paramsInPathTemplate = (
      pathTemplate.match(/\[([^\]]+)\]/g) || []
    ).map((p) => p.replace(/\[|\]|\./g, ""));
    const type = isDevZone ? "DevOnly" : "Public";

    console.log(
      chalk.gray(
        `   Descubierta: ${chalk.green(key)} -> ${chalk.yellow(
          pathTemplate
        )} (Tipo: ${type})`
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
      const nextIsDevZone = isDevZone || PROTECTED_ROOT_DIRS.has(entry.name);
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
        // --- [INICIO DE REFACTORIZACIÓN QUIRÚRGICA v9.1.0] ---
        // Se corrige la construcción de la RegExp para que las barras invertidas se escapen correctamente,
        // generando un código final sintácticamente válido y sin advertencias de ESLint.
        const placeholderRegex = new RegExp(\`\\\\[\\\\[\\\\.\\\\.\\\\.\${key}\\\\]\\\\]\\\\?|\\\\[\${key}\\\\]\`);
        // --- [FIN DE REFACTORIZACIÓN QUIRÚRGICA v9.1.0] ---
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
  const traceId = logger.startTrace("generate-navigation-manifest_v9.1");
  const groupId = logger.startGroup(
    "[Generador de Rutas] Iniciando ejecución..."
  );
  console.log(
    chalk.blue.bold(
      "🚀 Iniciando Generador de Manifiesto de Rutas de Élite v9.1..."
    )
  );
  try {
    const appPath = path.join(APP_ROOT_DIR);
    console.log(chalk.gray(`   Escaneando directorio base: ${appPath}`));

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
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error(
      chalk.red.bold("🔥 Error crítico durante la generación del manifiesto:"),
      errorMessage
    );
    logger.error("[Generador de Rutas] Fallo crítico.", {
      error: errorMessage,
      traceId,
    });
    process.exit(1);
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}

main();
