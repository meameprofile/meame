// Ruta correcta: src/shared/lib/utils/search/keyword-normalizer.ts
/**
 * @file keyword-normalizer.ts
 * @description Utilidad pura y atómica para normalizar palabras clave para fines de búsqueda.
 *              Incluye singularización, conversión a minúsculas, eliminación de duplicados
 *              y filtrado de "stop words" (palabras de relleno).
 *              v1.1.0 (Optimized Logging & Stop Words Filtering): Se ajusta la estrategia
 *              de logging y se implementa un filtro de "stop words" para mejorar la
 *              relevancia de la búsqueda.
 * @version 1.1.0
 * @author RaZ Podestá - MetaShark Tech
 */
import pluralize from "pluralize";
import { logger } from "@/shared/lib/logging";

// --- INICIO DE MEJORA: OBSERVABILIDAD DE CARGA DE MÓDULO ---
logger.trace(
  "[keyword-normalizer.ts] Módulo de normalización de palabras clave cargado y listo para usar."
);
// --- FIN DE MEJORA: OBSERVABILIDAD DE CARGA DE MÓDULO ---

// Lista de "stop words" comunes en inglés e italiano.
// En una implementación más avanzada, esto podría ser configurable por locale.
const STOP_WORDS: ReadonlySet<string> = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "but",
  "about",
  "above",
  "after",
  "again",
  "against",
  "all",
  "am",
  "is",
  "are",
  "as",
  "at",
  "be",
  "because",
  "been",
  "before",
  "being",
  "below",
  "between",
  "both",
  "by",
  "can",
  "could",
  "did",
  "do",
  "does",
  "doing",
  "down",
  "during",
  "each",
  "few",
  "for",
  "from",
  "further",
  "had",
  "has",
  "have",
  "having",
  "he",
  "her",
  "here",
  "hers",
  "him",
  "his",
  "how",
  "i",
  "if",
  "in",
  "into",
  "it",
  "its",
  "just",
  "me",
  "more",
  "most",
  "my",
  "no",
  "nor",
  "not",
  "of",
  "off",
  "on",
  "once",
  "only",
  "or",
  "other",
  "our",
  "out",
  "over",
  "own",
  "s",
  "same",
  "she",
  "should",
  "so",
  "some",
  "such",
  "t",
  "than",
  "that",
  "then",
  "there",
  "these",
  "they",
  "this",
  "those",
  "through",
  "to",
  "too",
  "under",
  "until",
  "up",
  "very",
  "was",
  "we",
  "were",
  "what",
  "when",
  "where",
  "which",
  "while",
  "who",
  "whom",
  "why",
  "with",
  "you",
  "your",

  // Italian stop words
  "il",
  "la",
  "lo",
  "i",
  "gli",
  "le",
  "un",
  "una",
  "uno",
  "di",
  "a",
  "da",
  "in",
  "con",
  "su",
  "per",
  "tra",
  "fra",
  "e",
  "o",
  "ma",
  "se",
  "che",
  "chi",
  "cosa",
  "dove",
  "come",
  "quando",
  "perché",
  "non",
  "mi",
  "ti",
  "ci",
  "vi",
  "si",
  "ne",
  "lo",
  "la",
  "li",
  "le",
  "gli",
  "cui",
  "c'è",
  "c'era",
  "c'erano",
  "c'è stato",
  "c'è stata",
  "c'è stati",
  "c'è state",
]);

/**
 * @function normalizeKeywords
 * @description Procesa un array de palabras clave para optimizarlas para la búsqueda.
 *              - Convierte todas las palabras a minúsculas.
 *              - Elimina "stop words" (palabras de relleno).
 *              - Singulariza las palabras para manejar variaciones de plural/singular.
 *              - Elimina duplicados.
 *              - Filtra palabras vacías o solo espacios.
 * @param {string[]} keywords El array de palabras clave a normalizar.
 * @returns {string[]} Un nuevo array de palabras clave normalizadas.
 */
export function normalizeKeywords(keywords: string[]): string[] {
  const normalized = keywords
    .map((keyword) => keyword.trim().toLowerCase()) // Eliminar espacios y convertir a minúsculas
    .filter((keyword) => keyword.length > 0) // Eliminar cadenas vacías
    .filter((keyword) => !STOP_WORDS.has(keyword)) // Filtrar "stop words"
    .map((keyword) => pluralize.singular(keyword)); // Singularizar

  const uniqueKeywords = Array.from(new Set(normalized)); // Eliminar duplicados

  return uniqueKeywords;
}
