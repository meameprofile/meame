// APARATO NIVELADO Y COMPLETO
// RUTA: src/shared/lib/utils/server-encryption.ts

/**
 * @file server-encryption.ts
 * @description Utilidad de élite ISOMÓRFICA para encriptación y desencriptación simétrica.
 *              Detecta el entorno (Node.js o Edge) y utiliza la API Crypto apropiada.
 * @version 2.2.0 (Elite Hygiene & Type Safety)
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import {
  webcrypto,
  createCipheriv,
  createDecipheriv,
  pbkdf2Sync,
  randomBytes,
} from "crypto";

// --- Guardián de Configuración Crítica ---
const ENCRYPTION_KEY = process.env.SUPABASE_JWT_SECRET;
const IV_LENGTH = 12; // GCM recomienda un IV de 12 bytes
const SALT = "lia-sovereign-salt-for-derivation";
const ITERATIONS = 100000;
const KEY_LENGTH = 32; // 32 bytes para AES-256
const DIGEST = "sha512";
const ALGORITHM = "aes-256-gcm";

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length < 32) {
  // Falla rápido en el arranque del servidor si la configuración es insegura.
  throw new Error(
    "CRÍTICO: La variable de entorno 'SUPABASE_JWT_SECRET' es insegura o no está definida."
  );
}

// --- Motor de Encriptación para Node.js ---
const nodeEncrypt = (text: string): string => {
  const key = pbkdf2Sync(ENCRYPTION_KEY, SALT, ITERATIONS, KEY_LENGTH, DIGEST);
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encrypted]).toString("hex");
};

const nodeDecrypt = (hex: string): string => {
  const data = Buffer.from(hex, "hex");
  const key = pbkdf2Sync(ENCRYPTION_KEY, SALT, ITERATIONS, KEY_LENGTH, DIGEST);
  const iv = data.slice(0, IV_LENGTH);
  const authTag = data.slice(IV_LENGTH, IV_LENGTH + 16);
  const encrypted = data.slice(IV_LENGTH + 16);
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  return decipher.update(encrypted, undefined, "utf8") + decipher.final("utf8");
};

// --- Motor de Encriptación para Web Crypto API (Edge) ---
const getWebCryptoKey = async (): Promise<CryptoKey> => {
  const keyMaterial = await webcrypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(ENCRYPTION_KEY),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  return webcrypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: new TextEncoder().encode(SALT),
      iterations: ITERATIONS,
      hash: DIGEST,
    },
    keyMaterial,
    { name: ALGORITHM, length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
};

const webEncrypt = async (text: string): Promise<string> => {
  const key = await getWebCryptoKey();
  const iv = webcrypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encrypted = await webcrypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    new TextEncoder().encode(text)
  );
  const finalBuffer = new Uint8Array(iv.length + encrypted.byteLength);
  finalBuffer.set(iv, 0);
  finalBuffer.set(new Uint8Array(encrypted), iv.length);
  return Buffer.from(finalBuffer).toString("hex");
};

const webDecrypt = async (hex: string): Promise<string> => {
  try {
    const key = await getWebCryptoKey();
    const data = Buffer.from(hex, "hex");
    const iv = data.slice(0, IV_LENGTH);
    const encrypted = data.slice(IV_LENGTH);
    const decrypted = await webcrypto.subtle.decrypt(
      { name: ALGORITHM, iv },
      key,
      encrypted
    );
    return new TextDecoder().decode(decrypted);
  } catch (error) {
    // --- [INICIO DE REFACTORIZACIÓN DE SEGURIDAD DE TIPOS] ---
    // Se asegura que el error propagado sea siempre un string.
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error desconocido durante la desencriptación.";
    throw new Error(errorMessage);
    // --- [FIN DE REFACTORIZACIÓN DE SEGURIDAD DE TIPOS] ---
  }
};

// --- API Pública Isomórfica ---
const isNode =
  typeof process !== "undefined" &&
  process.versions != null &&
  process.versions.node != null;

export const encryptServerData: (text: string) => string | Promise<string> =
  isNode ? nodeEncrypt : webEncrypt;
export const decryptServerData: (hex: string) => string | Promise<string> =
  isNode ? nodeDecrypt : webDecrypt;
