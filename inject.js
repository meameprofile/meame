// RUTA: inject.js
/**
 * @file inject.js
 * @description Script de inyección de datos soberano y de fuerza bruta, con observabilidad mejorada.
 * @version 99.2.0 (Elite Observability)
 */
/* eslint-env node */
/* globals process, console */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { promises as fs } from "fs";
import path from "path";
import { createId } from "@paralleldrive/cuid2";

const log = (msg) => console.log(`[✅] ${msg}`);
const error = (msg, details) => console.error(`[❌] ${msg}`, details || "");

async function main() {
  log("Iniciando Inyector Soberano v99.2...");

  try {
    dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Variables de entorno de Supabase no encontradas.");
    }
    log("Variables de entorno cargadas.");

    const fixturePathArg = process.argv[2];
    if (!fixturePathArg) {
      throw new Error("Uso: node inject.js <ruta/al/archivo.json>");
    }
    const fixturePath = path.resolve(process.cwd(), fixturePathArg);
    log(`Archivo objetivo: ${fixturePath}`);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    log("Cliente de Supabase (admin) creado.");

    const fileContent = await fs.readFile(fixturePath, "utf-8");
    const articleData = JSON.parse(fileContent);
    log("Archivo JSON leído y parseado.");

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
      updated_at: now,
    };
    log(`Payload preparado para el ID de artículo: ${articleId}`);

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
      `\n\n✅ INYECCIÓN COMPLETADA: El artículo '${data.id}' ha sido inyectado/actualizado.`
    );
  } catch (e) {
    error("FALLO CRÍTICO DURANTE LA INYECCIÓN:", e.message);
    process.exit(1);
  }
}

main();
