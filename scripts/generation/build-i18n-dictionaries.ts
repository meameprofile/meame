// RUTA: scripts/generation/build-i18n-dictionaries.ts
/**
 * @file build-i18n-dictionaries.ts
 * @description Script de build para i18n, ahora definitivamente alineado con la SSoT de enrutamiento.
 * @version 8.0.0 (Definitive Routing Contract Alignment)
 * @author RaZ Podestá - MetaShark Tech
 */
import { readFileSync } from "fs";
import * as fs from "fs/promises";
import * as path from "path";

import chalk from "chalk";
import hash from "object-hash";
import { register } from "tsconfig-paths";

import { ROUTING_LOCALES } from "@/shared/lib/i18n/i18n.config";
import { i18nSchema } from "@/shared/lib/schemas/i18n.schema";

import {
  discoverAndReadI18nFiles,
  type I18nFileContent,
} from "./i18n-discoverer";

const tsconfigPath = path.resolve(process.cwd(), "tsconfig.json");
const tsconfigFileContent = readFileSync(tsconfigPath, "utf-8").replace(
  /\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g,
  (match, group1) => (group1 ? "" : match)
);
const tsconfig = JSON.parse(tsconfigFileContent);

register({
  baseUrl: path.resolve(process.cwd(), tsconfig.compilerOptions.baseUrl || "."),
  paths: tsconfig.compilerOptions.paths,
});

const OUTPUT_DIR = path.resolve(process.cwd(), "public/locales");
const CACHE_DIR = path.resolve(process.cwd(), ".i18n-cache");
const HASH_CACHE_FILE = path.join(CACHE_DIR, "hashes.json");

type HashCache = Record<string, string>;

async function readHashCache(): Promise<HashCache> {
  try {
    const content = await fs.readFile(HASH_CACHE_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    return {};
  }
}

async function writeHashCache(cache: HashCache): Promise<void> {
  await fs.mkdir(CACHE_DIR, { recursive: true });
  await fs.writeFile(HASH_CACHE_FILE, JSON.stringify(cache, null, 2));
}

async function buildDictionaries() {
  console.log(
    chalk.blue.bold(
      "🚀 Iniciando compilación de diccionarios i18n (v8.0 - Definitive)..."
    )
  );

  const isProduction = process.env.NODE_ENV === "production";
  const { files, contents } = await discoverAndReadI18nFiles({
    excludeDevContent: isProduction,
  });

  const oldHashes = await readHashCache();
  const newHashes: HashCache = {};
  let hasChanges = false;

  for (let i = 0; i < files.length; i++) {
    const filePath = files[i];
    const content = contents[i];
    const currentHash = hash(content);
    newHashes[filePath] = currentHash;
    if (oldHashes[filePath] !== currentHash) {
      hasChanges = true;
    }
  }

  if (!hasChanges && Object.keys(oldHashes).length === files.length) {
    console.log(
      chalk.green(
        "✨ No se detectaron cambios en los archivos de contenido. El build se omite."
      )
    );
    return;
  }

  console.log(
    chalk.yellow(
      "   Cambios de contenido detectados. Reconstruyendo diccionarios..."
    )
  );

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  let validationFailed = false;

  for (const locale of ROUTING_LOCALES) {
    const fullDictionary = contents.reduce(
      (acc: Record<string, unknown>, moduleContent: I18nFileContent) => ({
        ...acc,
        ...(moduleContent[locale] || {}),
      }),
      {}
    );

    const validation = i18nSchema.safeParse(fullDictionary);

    if (!validation.success) {
      console.error(
        chalk.red.bold(`  🔥 ¡FALLO DE VALIDACIÓN para [${locale}]!`)
      );
      console.error(
        chalk.red(
          JSON.stringify(validation.error.flatten().fieldErrors, null, 2)
        )
      );
      validationFailed = true;
    }

    const outputPath = path.join(OUTPUT_DIR, `${locale}.json`);
    await fs.writeFile(
      outputPath,
      JSON.stringify(validation.data || fullDictionary, null, 2),
      "utf-8"
    );

    console.log(
      validation.success
        ? chalk.green(`  ✅ Diccionario para [${locale}] compilado con éxito.`)
        : chalk.yellow(
            `  ⚠️  Diccionario para [${locale}] compilado CON ERRORES.`
          )
    );
  }

  await writeHashCache(newHashes);

  if (validationFailed && isProduction) {
    console.error(
      chalk.red.bold(
        "\n❌ Error Crítico: Fallo de validación en modo PRODUCCIÓN."
      )
    );
    process.exit(1);
  }

  console.log(chalk.green("\n✨ Proceso de compilación de i18n completado."));
}

buildDictionaries().catch((error) => {
  console.error(
    chalk.red.bold("\n❌ Error fatal durante la compilación:"),
    error
  );
  process.exit(1);
});
