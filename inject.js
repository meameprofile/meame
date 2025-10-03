// RUTA: inject.js
/**
 * @file inject.js
 * @description Script de inyección de datos soberano y de fuerza bruta.
 *              v99.1.0 (Linter-Compliant): Se añaden directivas de entorno
 *              global para satisfacer a ESLint y eliminar errores 'no-undef'.
 * @version 99.1.0
 *@author RaZ Podestá - MetaShark Tech
 */
/* eslint-env node */
/* globals process, console */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { promises as fs } from "fs";
import path from "path";
import { createId } from "@paralleldrive/cuid2";

// --- Funciones de Logging Independientes (Cero Dependencias de 'src') ---
const log = (msg) => console.log(`[✅] ${msg}`);
const error = (msg, details) => console.error(`[❌] ${msg}`, details || "");

async function main() {
  log("Iniciando Inyector Soberano v99.1...");

  try {
    // 1. Cargar Variables de Entorno
    dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error(
        "Variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no encontradas en .env.local"
      );
    }
    log("Variables de entorno cargadas.");

    // 2. Obtener Ruta del Archivo desde Argumentos
    const fixturePathArg = process.argv[2];
    if (!fixturePathArg) {
      throw new Error("Uso: node inject.js <ruta/al/archivo.json>");
    }
    const fixturePath = path.resolve(process.cwd(), fixturePathArg);
    log(`Archivo objetivo: ${fixturePath}`);

    // 3. Crear Cliente de Supabase con Rol de Servicio
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    log("Cliente de Supabase (admin) creado.");

    // 4. Leer y Parsear el Archivo JSON
    const fileContent = await fs.readFile(fixturePath, "utf-8");
    const articleData = JSON.parse(fileContent);
    log("Archivo JSON leído y parseado.");

    // 5. Transformar Datos para la Base de Datos (snake_case)
    const now = new Date().toISOString();
    const articleId = articleData.articleId || createId();

    const supabasePayload = {
      id: articleId,
      status: articleData.status || "draft",
      study_dna: articleData.studyDna,
      content: articleData.content,
      tags: articleData.tags || [],
      bavi_hero_image_id: articleData.baviHeroImageId || null,
      related_prompt_ids: articleData.relatedPromptIds || [],
      created_at: articleData.createdAt || now,
      updated_at: now, // Siempre actualizamos el 'updated_at'
    };
    log(`Payload preparado para el ID de artículo: ${articleId}`);

    // 6. Ejecutar Operación 'upsert'
    const { data, error: dbError } = await supabase
      .from("cogniread_articles")
      .upsert(supabasePayload, { onConflict: "id" })
      .select("id")
      .single();

    if (dbError) {
      throw new Error(`Error de Supabase: ${dbError.message}`);
    }

    log(`Operación 'upsert' completada con éxito.`);
    console.log(
      `\n\n✅ INYECCIÓN COMPLETADA: El artículo '${data.id}' ha sido inyectado/actualizado en la base de datos.`
    );
  } catch (e) {
    error("FALLO CRÍTICO DURANTE LA INYECCIÓN:", e.message);
    process.exit(1);
  }
}

main();
