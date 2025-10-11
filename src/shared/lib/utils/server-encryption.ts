// RUTA: src/shared/lib/utils/server-encryption.ts
/**
 * @file server-encryption.ts
 * @description Utilidad de élite ISOMÓRFICA para encriptación y desencriptación simétrica.
 *              v5.0.0 (Universal Web Crypto API): Refactorizado para usar exclusivamente
 *              la Web Crypto API, garantizando la compatibilidad con Node.js y Edge Runtime.
 * @version 5.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import { webcrypto as crypto } from "crypto";

import { logger } from "@/shared/lib/logging";

// --- Configuración Soberana ---
const ENCRYPTION_KEY = process.env.SUPABASE_JWT_SECRET;
const IV_LENGTH = 12;
const SALT = "lia-sovereign-salt-for-derivation";
const ITERATIONS = 100000;
const DIGEST = "SHA-512";
const ALGORITHM = "AES-GCM";

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length < 32) {
  throw new Error(
    "CRÍTICO: La variable de entorno 'SUPABASE_JWT_SECRET' es insegura o no está definida."
  );
}

// --- Motor de Criptografía Universal (basado en Web Crypto API) ---

const getDerivedKey = async (): Promise<CryptoKey> => {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(ENCRYPTION_KEY),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
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

export const encryptServerData = async (text: string): Promise<string> => {
  try {
    const key = await getDerivedKey();
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    const encrypted = await crypto.subtle.encrypt(
      { name: ALGORITHM, iv },
      key,
      new TextEncoder().encode(text)
    );
    const finalBuffer = new Uint8Array(iv.length + encrypted.byteLength);
    finalBuffer.set(iv, 0);
    finalBuffer.set(new Uint8Array(encrypted), iv.length);
    return Buffer.from(finalBuffer).toString("hex");
  } catch (error) {
    logger.error("[Encryption] Fallo durante la encriptación.", { error });
    throw new Error("La encriptación de datos del servidor falló.");
  }
};

export const decryptServerData = async (hex: string): Promise<string> => {
  try {
    const key = await getDerivedKey();
    const data = Buffer.from(hex, "hex");
    const iv = data.slice(0, IV_LENGTH);
    const encrypted = data.slice(IV_LENGTH);
    const decrypted = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv },
      key,
      encrypted
    );
    return new TextDecoder().decode(decrypted);
  } catch (error) {
    logger.error("[Encryption] Fallo durante la desencriptación.", { error });
    throw new Error("La desencriptación de datos del servidor falló.");
  }
};
