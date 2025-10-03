// RUTA: src/shared/lib/utils/server-encryption.ts
/**
 * @file server-encryption.ts
 * @description Utilidad de élite para encriptación y desencriptación simétrica en el servidor.
 *              Utiliza la Node.js Crypto API para proteger datos sensibles en reposo.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import * as crypto from "crypto";
import { logger } from "@/shared/lib/logging";

// Asegurarse de que la clave secreta esté disponible.
// En un entorno de producción, esta clave debería ser un secreto de entorno gestionado de forma segura.
const ENCRYPTION_KEY = process.env.SUPABASE_JWT_SECRET;
const IV_LENGTH = 16; // AES block size in bytes

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length < 32) {
  // La clave debe ser al menos de 32 bytes para AES-256
  logger.error(
    "[Server Encryption] CRÍTICO: La variable de entorno 'SUPABASE_JWT_SECRET' no está definida o es demasiado corta para la encriptación."
  );
  throw new Error(
    "Missing or insecure 'SUPABASE_JWT_SECRET' for server encryption."
  );
}

// Derivar una clave de 32 bytes a partir de SUPABASE_JWT_SECRET para AES-256
const deriveKey = (secret: string): Buffer => {
  // Usamos PBKDF2 para derivar una clave de 32 bytes de forma segura
  return crypto.pbkdf2Sync(secret, "salt", 100000, 32, "sha512");
};

const key = deriveKey(ENCRYPTION_KEY);

/**
 * @function encryptServerData
 * @description Encripta un string de datos en el servidor usando AES-256-GCM.
 * @param {string} text - El texto a encriptar.
 * @returns {string} El texto encriptado en formato Base64.
 */
export function encryptServerData(text: string): string {
  const traceId = logger.startTrace("encryptServerData");
  logger.traceEvent(traceId, "Iniciando encriptación de datos en el servidor.");

  const iv = crypto.randomBytes(IV_LENGTH); // Generar un IV aleatorio
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex"); // Obtener el Authentication Tag

  const result = iv.toString("hex") + encrypted + authTag;
  logger.traceEvent(traceId, "Encriptación de datos completada.");
  logger.endTrace(traceId);
  return result; // IV + Encrypted Text + Auth Tag
}

/**
 * @function decryptServerData
 * @description Desencripta un string de datos encriptados en el servidor usando AES-256-GCM.
 * @param {string} encryptedText - El texto encriptado en formato Base64.
 * @returns {string} El texto desencriptado.
 * @throws {Error} Si la desencriptación falla (ej. clave incorrecta o datos manipulados).
 */
export function decryptServerData(encryptedText: string): string {
  const traceId = logger.startTrace("decryptServerData");
  logger.traceEvent(
    traceId,
    "Iniciando desencriptación de datos en el servidor."
  );

  try {
    const iv = Buffer.from(encryptedText.slice(0, IV_LENGTH * 2), "hex");
    const authTagHex = encryptedText.slice(-32); // El Authentication Tag es de 16 bytes (32 hex chars)
    const encrypted = encryptedText.slice(IV_LENGTH * 2, -32);

    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(Buffer.from(authTagHex, "hex"));

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    logger.traceEvent(traceId, "Desencriptación de datos completada.");
    logger.endTrace(traceId);
    return decrypted;
  } catch (error) {
    logger.error(
      "Fallo de desencriptación: datos corruptos o clave incorrecta.",
      { error, traceId }
    );
    throw new Error(
      "Failed to decrypt data: " +
        (error instanceof Error ? error.message : "unknown error")
    );
  } finally {
    logger.endTrace(traceId);
  }
}
