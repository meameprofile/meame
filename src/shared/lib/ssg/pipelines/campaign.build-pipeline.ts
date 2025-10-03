// RUTA: src/shared/lib/ssg/pipelines/campaign.build-pipeline.ts
/**
 * @file campaign.build-pipeline.ts
 * @description SSoT para la definición de la "receta" de un build de campaña.
 *              Este módulo es una función pura que configura un pipeline de build.
 * @version 2.0.0 (Elite & Resilient)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server-only";

import { BuildPipeline } from "@/shared/lib/ssg/engine/build-pipeline";
import * as generators from "@/shared/lib/ssg/generators";
import { copyComponentDependencies } from "@/shared/lib/ssg/componentCopier";
import { runScopedNextBuild } from "@/shared/lib/ssg/programmatic-builder";
import { packageDirectory } from "@/shared/lib/ssg/packager";
import fs from "fs/promises";
import type { CampaignDraftDataSchema } from "@/shared/lib/schemas/campaigns/draft.schema";
import type { z } from "zod";

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
        await fs.mkdir(ctx.tempDir, { recursive: true });
      },
    })
    .addTask({
      name: "Generate package.json",
      execute: (ctx) =>
        generators.generatePackageJson(
          ctx.draft as ValidatedDraft,
          ctx.tempDir
        ),
    })
    .addTask({
      name: "Generate Next.js Config",
      execute: (ctx) => generators.generateNextConfig(ctx.draft, ctx.tempDir),
    })
    .addTask({
      name: "Generate PostCSS Config",
      execute: (ctx) => generators.generatePostcssConfig(ctx.tempDir),
    })
    .addTask({
      name: "Generate Tailwind Config",
      execute: (ctx) => generators.generateTailwindConfig(ctx.tempDir),
    })
    .addTask({
      name: "Generate src/app/globals.css",
      execute: (ctx) => generators.generateGlobalsCss(ctx.draft, ctx.tempDir),
    })
    .addTask({
      name: "Generate src/app/layout.tsx",
      execute: (ctx) => generators.generateLayout(ctx.draft, ctx.tempDir),
    })
    .addTask({
      name: "Generate src/content/ files",
      execute: async (ctx) => {
        await generators.generateContentFile(ctx.draft, ctx.tempDir);
        await generators.generateThemeFile(ctx.draft, ctx.tempDir);
      },
    })
    .addTask({
      name: "Copy Component Dependencies",
      execute: (ctx) => copyComponentDependencies(ctx.draft, ctx.tempDir),
    })
    .addTask({
      name: "Generate src/app/page.tsx",
      execute: (ctx) => generators.generatePage(ctx.tempDir),
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
