// scripts/diagnostics/diag-mongo-content.ts
/**
 * @file diag-mongo-content.ts
 * @description Herramienta de auditoría para realizar un censo de contenido en MongoDB.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0 (ESM Fix)
 */
import { MongoClient } from "mongodb";
import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import { loadEnvironment } from "./_utils";

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
        `\n📊 Realizando censo de contenido para la base de datos '${MONGODB_DB_NAME}'...`
      )
    );

    const collections = await db.collections();
    const report: Record<string, number> = {};

    for (const collection of collections) {
      const count = await collection.countDocuments();
      report[collection.collectionName] = count;
    }

    console.log(
      chalk.blueBright.bold(`\n--- CENSO DE DOCUMENTOS POR COLECCIÓN ---`)
    );
    console.table(
      Object.entries(report).map(([Coleccion, Documentos]) => ({
        Coleccion,
        Documentos,
      }))
    );

    const reportDir = path.resolve(process.cwd(), "mongodb/reports");
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    const reportPath = path.resolve(
      reportDir,
      `latest-content-diagnostics.json`
    );
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(
      chalk.blueBright.bold(
        `\n📄 Reporte de contenido JSON guardado en: ${chalk.yellow(reportPath)}`
      )
    );
  } finally {
    await client.close();
  }
}

main()
  .then(() =>
    console.log(
      chalk.green.bold("\n\n✅ Censo de contenido de MongoDB completado.")
    )
  )
  .catch((error) => {
    console.error(
      chalk.red.bold("\n🔥 Fallo irrecuperable en el script:"),
      error.message
    );
    process.exit(1);
  });
// scripts/diagnostics/diag-mongo-content.ts
