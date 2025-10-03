// scripts/diagnostics/diag-mongo.ts
/**
 * @file diag-mongo.ts
 * @description Herramienta de diagnóstico de élite para verificar la conexión
 *              y la autenticación con la base de datos de MongoDB Atlas.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 * @usage pnpm diag:mongo
 */
import { MongoClient } from "mongodb";
import chalk from "chalk";
import dotenv from "dotenv";
import path from "path";

async function runMongoDiagnostics() {
  console.clear();
  console.log(
    chalk.cyan.bold("🔬 Iniciando Diagnóstico de Conexión a MongoDB Atlas...")
  );

  // 1. Cargar Variables de Entorno
  dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
  const MONGODB_URI = process.env.MONGODB_URI;
  const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

  if (!MONGODB_URI || !MONGODB_DB_NAME) {
    console.error(
      chalk.red.bold(
        "\n❌ [FALLO] Faltan variables de entorno. Asegúrate de que MONGODB_URI y MONGODB_DB_NAME estén definidos en tu archivo .env.local."
      )
    );
    process.exit(1);
  }
  console.log(chalk.green("✅ Variables de entorno cargadas."));

  // 2. Intentar Conexión
  console.log(
    chalk.gray(`   Conectando al clúster... (Esto puede tardar unos segundos)`)
  );
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    console.log(
      chalk.green("✅ Conexión con el clúster de MongoDB establecida.")
    );
  } catch (error) {
    console.error(
      chalk.red.bold("\n❌ [FALLO] No se pudo conectar al clúster de MongoDB.")
    );
    console.error(chalk.white("Posibles Causas:"));
    console.error(
      chalk.yellow(
        "   1. Tu dirección IP actual no está en la lista blanca de 'Network Access' en MongoDB Atlas."
      )
    );
    console.error(
      chalk.yellow(
        "   2. La cadena de conexión 'MONGODB_URI' en tu .env.local es incorrecta (revisa la contraseña)."
      )
    );
    console.error(
      chalk.yellow(
        "   3. Un firewall o problema de red está bloqueando la conexión."
      )
    );
    console.error("\nError detallado:", error);
    process.exit(1);
  }

  // 3. Verificar Base de Datos y Colección
  try {
    const db = client.db(MONGODB_DB_NAME);
    const collections = await db
      .listCollections({ name: "articles" })
      .toArray();
    console.log(
      chalk.green(
        `✅ Conexión a la base de datos '${MONGODB_DB_NAME}' exitosa.`
      )
    );

    if (collections.length > 0) {
      console.log(chalk.green("✅ La colección 'articles' fue encontrada."));
    } else {
      console.log(
        chalk.yellow(
          "   ⚠️  La colección 'articles' no existe. Será creada en la primera inserción."
        )
      );
    }
  } catch (error) {
    console.error(
      chalk.red.bold(
        "\n❌ [FALLO] Se conectó al clúster, pero no se pudo acceder a la base de datos."
      )
    );
    console.error(
      chalk.white(
        "Verifica que el nombre de la base de datos en MONGODB_DB_NAME sea correcto y que el usuario tenga permisos."
      )
    );
    console.error("\nError detallado:", error);
    process.exit(1);
  } finally {
    await client.close();
  }

  console.log(
    chalk.green.bold(
      "\n✨ Diagnóstico de MongoDB completado. ¡La conexión es saludable!"
    )
  );
}

runMongoDiagnostics();
// scripts/diagnostics/diag-mongo.ts
