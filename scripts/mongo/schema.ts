// scripts/diagnostics/diag-mongo-schema.ts
/**
 * @file diag-mongo-schema.ts
 * @description Herramienta de auditoría para inferir y reportar el esquema de las colecciones de MongoDB.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0 (ESM Fix & Type Safety)
 */
import { MongoClient, Document } from "mongodb";
import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import { loadEnvironment } from "./_utils";

function inferSchema(doc: Document, path: string = ""): Record<string, string> {
  const schema: Record<string, string> = {};
  for (const key in doc) {
    const newPath = path ? `${path}.${key}` : key;
    const value = doc[key];
    if (Array.isArray(value)) {
      schema[newPath] = "Array";
      if (
        value.length > 0 &&
        typeof value[0] === "object" &&
        value[0] !== null
      ) {
        Object.assign(schema, inferSchema(value[0], `${newPath}[*]`));
      }
    } else if (value instanceof Date) {
      schema[newPath] = "Date";
    } else if (typeof value === "object" && value !== null) {
      schema[newPath] = "Object";
      Object.assign(schema, inferSchema(value, newPath));
    } else {
      schema[newPath] = typeof value;
    }
  }
  return schema;
}

async function main() {
  console.clear();
  loadEnvironment(["MONGODB_URI", "MONGODB_DB_NAME"]);

  const { MONGODB_URI, MONGODB_DB_NAME } = process.env;
  const client = new MongoClient(MONGODB_URI!);

  try {
    await client.connect();
    const db = client.db(MONGODB_DB_NAME);
    console.log(
      chalk.cyan(
        `\n🔬 Infiriendo esquemas para la base de datos '${MONGODB_DB_NAME}'...`
      )
    );

    const collections = await db.collections();
    const fullReport: Record<string, unknown> = {};

    for (const collection of collections) {
      const collectionName = collection.collectionName;
      console.log(
        chalk.blueBright.bold(`\n--- COLECCIÓN: ${collectionName} ---`)
      );
      const sampleDoc = await collection.findOne({});

      if (sampleDoc) {
        const schema = inferSchema(sampleDoc);
        fullReport[collectionName] = schema;
        console.table(
          Object.entries(schema).map(([Campo, Tipo]) => ({ Campo, Tipo }))
        );
      } else {
        fullReport[collectionName] = "Vacía o sin documentos.";
        console.log(
          chalk.yellow("Colección vacía, no se puede inferir el esquema.")
        );
      }
    }

    const reportDir = path.resolve(process.cwd(), "mongodb/reports");
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    const reportPath = path.resolve(
      reportDir,
      `latest-schema-diagnostics.json`
    );
    fs.writeFileSync(reportPath, JSON.stringify(fullReport, null, 2));
    console.log(
      chalk.blueBright.bold(
        `\n📄 Reporte de esquema JSON guardado en: ${chalk.yellow(reportPath)}`
      )
    );
  } finally {
    await client.close();
  }
}

main()
  .then(() =>
    console.log(
      chalk.green.bold("\n\n✅ Auditoría de esquema de MongoDB completada.")
    )
  )
  .catch((error) => {
    console.error(
      chalk.red.bold("\n🔥 Fallo irrecuperable en el script:"),
      error.message
    );
    process.exit(1);
  });
// scripts/diagnostics/diag-mongo-schema.ts
