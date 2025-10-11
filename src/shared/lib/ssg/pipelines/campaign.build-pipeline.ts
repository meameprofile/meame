// RUTA: src/shared/lib/ssg/pipelines/campaign.build-pipeline.ts
/**
 * @file campaign.build-pipeline.ts
 * @description SSoT para la definición de la "receta" de un build de campaña.
 *              v3.1.0 (Module Integrity Restoration): Se restaura la importación
 *              faltante del módulo 'path', resolviendo un error crítico de build.
 * @version 3.1.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use server-only";

import { promises as fs } from "fs";
import path from "path"; // <-- APARATO NIVELADO: Importación restaurada.

import type { z } from "zod";

import type { CampaignDraftDataSchema } from "@/shared/lib/schemas/campaigns/draft.schema";
import { copyComponentDependencies } from "@/shared/lib/ssg/componentCopier";
import type { BuildPipeline } from "@/shared/lib/ssg/engine/build-pipeline";
import { generateContentFile } from "@/shared/lib/ssg/generators/generate-content-file";
import { generateNextConfig } from "@/shared/lib/ssg/generators/generate-next-config";
import { generateGlobalsCss } from "@/shared/lib/ssg/generators/generateGlobalsCss";
import { generateLayout } from "@/shared/lib/ssg/generators/generateLayout";
import { generatePackageJson } from "@/shared/lib/ssg/generators/generatePackageJson";
import { generatePage } from "@/shared/lib/ssg/generators/generatePage";
import { generatePostcssConfig } from "@/shared/lib/ssg/generators/generatePostcssConfig";
import { generateTailwindConfig } from "@/shared/lib/ssg/generators/generateTailwindConfig";
import { generateThemeFile } from "@/shared/lib/ssg/generators/generateThemeFile";
import { packageDirectory } from "@/shared/lib/ssg/packager";
import { runScopedNextBuild } from "@/shared/lib/ssg/programmatic-builder";

type ValidatedDraft = z.infer<typeof CampaignDraftDataSchema>;

export function defineCampaignBuildPipeline(
  pipeline: BuildPipeline,
  traceId: string
): void {
  pipeline
    .addTask({
      name: "Setup Directories",
      execute: async (ctx) => {
        await fs.rm(ctx.tempDir, { recursive: true, force: true });
        await fs.mkdir(path.join(ctx.tempDir, "app"), { recursive: true });
      },
    })
    .addTask({
      name: "Generate package.json",
      execute: (ctx) =>
        generatePackageJson(ctx.draft as ValidatedDraft, ctx.tempDir),
    })
    .addTask({
      name: "Generate Next.js Config",
      execute: (ctx) => generateNextConfig(ctx.draft, ctx.tempDir),
    })
    .addTask({
      name: "Generate PostCSS Config",
      execute: (ctx) => generatePostcssConfig(ctx.tempDir),
    })
    .addTask({
      name: "Generate Tailwind Config",
      execute: (ctx) => generateTailwindConfig(ctx.tempDir),
    })
    .addTask({
      name: "Generate src/app/globals.css",
      execute: (ctx) => generateGlobalsCss(ctx),
    })
    .addTask({
      name: "Generate src/app/layout.tsx",
      execute: (ctx) => generateLayout(ctx),
    })
    .addTask({
      name: "Generate src/content/ files",
      execute: async (ctx) => {
        await generateContentFile(ctx.draft, ctx.tempDir);
        await generateThemeFile(ctx.draft, ctx.tempDir);
      },
    })
    .addTask({
      name: "Copy Component Dependencies",
      execute: (ctx) => copyComponentDependencies(ctx.draft, ctx.tempDir),
    })
    .addTask({
      name: "Generate src/app/page.tsx",
      execute: (ctx) => generatePage(ctx.tempDir),
    })
    .addTask({
      name: "Run Next.js Build",
      execute: async (ctx) => {
        await runScopedNextBuild(ctx.tempDir, traceId);
      },
    })
    .addTask({
      name: "Package Artifacts",
      execute: async (ctx) => {
        await packageDirectory(ctx.buildDir, ctx.zipPath);
      },
    });
}
