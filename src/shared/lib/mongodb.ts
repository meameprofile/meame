// RUTA: src/shared/lib/mongodb.ts
/**
 * @file mongodb.ts
 * @description SSoT para la conexión a la base de datos de MongoDB.
 *              v3.0.0 (Server-Only Enforcement): Se añade la directiva "server-only"
 *              para forzar a nivel de build que este módulo nunca sea importado
 *              en un componente de cliente, resolviendo el error crítico de "net".
 * @version 3.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only"; // <-- ¡DIRECTIVA ARQUITECTÓNICA DE ÉLITE!

import { MongoClient } from "mongodb";
import { logger } from "@/shared/lib/logging";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

if (!MONGODB_URI) {
  throw new Error(
    "Error Crítico: La variable de entorno MONGODB_URI no está definida."
  );
}
if (!MONGODB_DB_NAME) {
  throw new Error(
    "Error Crítico: La variable de entorno MONGODB_DB_NAME no está definida."
  );
}

let cachedClientPromise: Promise<MongoClient> | null = null;

export async function connectToDatabase(): Promise<MongoClient> {
  if (cachedClientPromise) {
    logger.trace("[MongoDB] Usando conexión de cliente cacheada.");
    return cachedClientPromise;
  }

  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI no está disponible en el entorno de ejecución."
    );
  }

  logger.info(
    "[MongoDB] Creando nueva conexión de cliente a la base de datos..."
  );

  const client = new MongoClient(MONGODB_URI);
  cachedClientPromise = client.connect();

  try {
    await cachedClientPromise;
    logger.success(
      "[MongoDB] Conexión a la base de datos establecida con éxito."
    );
  } catch (e) {
    logger.error("[MongoDB] Fallo al conectar con la base de datos.", { e });
    cachedClientPromise = null;
    throw e;
  }

  return cachedClientPromise;
}
