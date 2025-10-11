// RUTA: src/components/features/raz-prompts/components/PromptIdentityGroup.tsx
/**
 * @file PromptIdentityGroup.tsx
 * @description Aparato de UI atómico para los campos de identidad del creador de prompts.
 * @version 1.0.0 (Forged & Elite)
 *@author RaZ Podestá - MetaShark Tech
 */
"use client";

import { motion, type Variants } from "framer-motion";
import React from "react";
import type { Control } from "react-hook-form";
import type { z } from "zod";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
  Input,
  Textarea,
  Switch,
} from "@/components/ui";
import type { CreatePromptFormData } from "@/shared/hooks/raz-prompts/use-prompt-creator";
import type { PromptCreatorContentSchema } from "@/shared/lib/schemas/raz-prompts/prompt-creator.i18n.schema";

type Content = z.infer<typeof PromptCreatorContentSchema>;

interface PromptIdentityGroupProps {
  control: Control<CreatePromptFormData>;
  content: Pick<
    Content,
    | "titleLabel"
    | "titlePlaceholder"
    | "promptTextLabel"
    | "promptTextPlaceholder"
    | "enhanceAILabel"
    | "enhanceAIDescription"
  >;
  variants: Variants;
}

export function PromptIdentityGroup({
  control,
  content,
  variants,
}: PromptIdentityGroupProps) {
  return (
    <motion.div variants={variants} className="space-y-6">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{content.titleLabel}</FormLabel>
            <FormControl>
              <Input placeholder={content.titlePlaceholder} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="promptText"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{content.promptTextLabel}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={content.promptTextPlaceholder}
                className="min-h-[150px] font-mono text-sm"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="enhanceWithAI"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-muted/30">
            <div className="space-y-0.5">
              <FormLabel>{content.enhanceAILabel}</FormLabel>
              <FormDescription>{content.enhanceAIDescription}</FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
    </motion.div>
  );
}
