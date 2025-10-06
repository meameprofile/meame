// RUTA: src/shared/lib/utils/server-encryption.ts
/**
 * @file server-encryption.ts
 * @description Utilidad de élite ISOMÓRFICA para encriptación y desencriptación simétrica.
 *              v4.1.0 (Type-Safe Node Crypto): Resuelve errores de tipo de TypeScript
 *              relacionados con los tipos CipherGCM/DecipherGCM del módulo 'crypto' de Node.js,
 *              garantizando una seguridad de tipos absoluta.
 * @version 4.1.0
 * @author L.I.A. Legacy
 */
import "server-only";
//import { logger } from "@/shared/lib/logging";
import {
  webcrypto as webCryptoAPI,
  createCipheriv,
  createDecipheriv,
  pbkdf2Sync,
  randomBytes,
  type CipherGCM,
  type DecipherGCM,
} from "crypto";

// --- Guardián de Configuración Crítica ---
const ENCRYPTION_KEY = process.env.SUPABASE_JWT_SECRET;
const IV_LENGTH = 12;
const SALT = "lia-sovereign-salt-for-derivation";
const ITERATIONS = 100000;
const KEY_LENGTH = 32;
const DIGEST = "sha512";
const ALGORITHM = "aes-256-gcm";

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length < 32) {
  throw new Error(
    "CRÍTICO: La variable de entorno 'SUPABASE_JWT_SECRET' es insegura o no está definida."
  );
}

// --- Motor de Encriptación para Node.js ---
const nodeEncrypt = (text: string): string => {
  if (!ENCRYPTION_KEY)
    throw new Error("ENCRYPTION_KEY no está definida en el runtime.");

  const key = pbkdf2Sync(ENCRYPTION_KEY, SALT, ITERATIONS, KEY_LENGTH, DIGEST);
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv) as CipherGCM; // Aserción de tipo
  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag(); // Válido en CipherGCM
  return Buffer.concat([iv, authTag, encrypted]).toString("hex");
};

const nodeDecrypt = (hex: string): string => {
  if (!ENCRYPTION_KEY)
    throw new Error("ENCRYPTION_KEY no está definida en el runtime.");

  const data = Buffer.from(hex, "hex");
  const key = pbkdf2Sync(ENCRYPTION_KEY, SALT, ITERATIONS, KEY_LENGTH, DIGEST);
  const iv = data.slice(0, IV_LENGTH);
  const authTag = data.slice(IV_LENGTH, IV_LENGTH + 16);
  const encrypted = data.slice(IV_LENGTH + 16);
  const decipher = createDecipheriv(ALGORITHM, key, iv) as DecipherGCM; // Aserción de tipo
  decipher.setAuthTag(authTag); // Válido en DecipherGCM
  return decipher.update(encrypted, undefined, "utf8") + decipher.final("utf8");
};

// --- Motor de Encriptación para Web Crypto API (Edge) ---
const getWebCryptoKey = async (): Promise<CryptoKey> => {
  const keyMaterial = await webCryptoAPI.subtle.importKey(
    "raw",
    new TextEncoder().encode(ENCRYPTION_KEY),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  return webCryptoAPI.subtle.deriveKey(
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
  const iv = webCryptoAPI.getRandomValues(new Uint8Array(IV_LENGTH));
  const encrypted = await webCryptoAPI.subtle.encrypt(
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
    const decrypted = await webCryptoAPI.subtle.decrypt(
      { name: ALGORITHM, iv },
      key,
      encrypted
    );
    return new TextDecoder().decode(decrypted);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error desconocido durante la desencriptación.";
    throw new Error(errorMessage);
  }
};

// --- API Pública Isomórfica ---
const isNodeRuntime =
  typeof process !== "undefined" &&
  process.versions != null &&
  process.versions.node != null;

export const encryptServerData: (text: string) => Promise<string> =
  isNodeRuntime
    ? (text: string) => Promise.resolve(nodeEncrypt(text))
    : webEncrypt;

export const decryptServerData: (hex: string) => Promise<string> = isNodeRuntime
  ? (hex: string) => Promise.resolve(nodeDecrypt(hex))
  : webDecrypt;
