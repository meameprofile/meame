// RUTA: src/components/features/raz-prompts/components/PromptDiscoveryGroup.tsx
/**
 * @file PromptDiscoveryGroup.tsx
 * @description Aparato de UI atómico para los campos de descubrimiento del creador de prompts.
 * @version 1.0.0 (Forged & Elite)
 *@author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import type { Control } from "react-hook-form";
import { motion, type Variants } from "framer-motion";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
  Input,
} from "@/components/ui";
import type { CreatePromptFormData } from "@/shared/hooks/raz-prompts/use-prompt-creator";
import type { z } from "zod";
import type { PromptCreatorContentSchema } from "@/shared/lib/schemas/raz-prompts/prompt-creator.i18n.schema";

type Content = z.infer<typeof PromptCreatorContentSchema>;

interface PromptDiscoveryGroupProps {
  control: Control<CreatePromptFormData>;
  content: Pick<
    Content,
    "keywordsLabel" | "keywordsPlaceholder" | "keywordsDescription"
  >;
  variants: Variants;
}

export function PromptDiscoveryGroup({
  control,
  content,
  variants,
}: PromptDiscoveryGroupProps) {
  return (
    <motion.div variants={variants}>
      <FormField
        control={control}
        name="keywords"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{content.keywordsLabel}</FormLabel>
            <FormControl>
              <Input placeholder={content.keywordsPlaceholder} {...field} />
            </FormControl>
            <FormDescription>{content.keywordsDescription}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </motion.div>
  );
}
