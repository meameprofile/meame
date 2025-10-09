// RUTA: src/components/features/campaign-suite/Step0_Identity/Step0Form.tsx
/**
 * @file Step0Form.tsx
 * @description Componente de presentación puro para el formulario del Paso 0.
 *              v3.0.0 (Architectural Restoration): Se elimina el uso del
 *              componente obsoleto FormFieldGroup, alineándose con el patrón
 *              de composición soberano de react-hook-form.
 * @version 3.0.0
 * @author L.I.A. Legacy
 */
"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  FormField,
  FormItem,
  FormControl,
  RadioGroup,
  RadioGroupItem,
  Label,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Button,
  DynamicIcon,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui";
import { CampaignSelectField, VariantInputField } from "../_components/shared";
import { TagInput } from "@/components/ui/TagInput";
import type { z } from "zod";
import type {
  Step0ContentSchema,
  Step0Data,
} from "@/shared/lib/schemas/campaigns/steps/step0.schema";
import type { CampaignTemplate } from "@/shared/lib/schemas/campaigns/template.schema";
import { producersConfig } from "@/shared/lib/config/campaign-suite/producers.config";

type Step0Content = z.infer<typeof Step0ContentSchema>;

interface Step0FormProps {
  form: UseFormReturn<Step0Data>;
  content: Step0Content;
  baseCampaigns: string[];
  templates: CampaignTemplate[];
  campaignOrigin: "scratch" | "template" | "clone";
}

export function Step0Form({
  form,
  content,
  baseCampaigns,
  templates,
  campaignOrigin,
}: Step0FormProps) {
  const producerOptions = producersConfig.map((p) => ({
    value: p.id,
    label: content.producerLabels[p.nameKey] || p.id,
  }));
  const campaignTypeOptions =
    producersConfig
      .find((p) => p.id === form.watch("producer"))
      ?.supportedCampaignTypes.map((ct) => ({
        value: ct.id,
        label: content.campaignTypeLabels[ct.nameKey] || ct.id,
      })) || [];

  return (
    <>
      <CardHeader>
        <CardTitle>{content.title}</CardTitle>
        <CardDescription>{content.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <FormField
          control={form.control}
          name="campaignOrigin"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>{content.originGroupLabel}</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="scratch" />
                    </FormControl>
                    <Label className="font-normal">
                      {content.originScratchLabel}
                    </Label>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem
                        value="template"
                        disabled={templates.length === 0}
                      />
                    </FormControl>
                    <Label className="font-normal">
                      {content.originTemplateLabel}
                    </Label>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem
                        value="clone"
                        disabled={baseCampaigns.length === 0}
                      />
                    </FormControl>
                    <Label className="font-normal">
                      {content.originCloneLabel}
                    </Label>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {campaignOrigin === "template" && (
          <CampaignSelectField
            control={form.control}
            name="templateId"
            label={content.templateSelectLabel}
            placeholder={content.templateSelectPlaceholder}
            options={templates.map((t) => ({ value: t.id, label: t.name }))}
          />
        )}

        {campaignOrigin === "clone" && (
          <CampaignSelectField
            control={form.control}
            name="baseCampaignId"
            label={content.baseCampaignLabel}
            placeholder={content.baseCampaignPlaceholder}
            options={baseCampaigns.map((id) => ({
              value: id,
              label: `Campaña ${id}`,
            }))}
          />
        )}

        <VariantInputField
          control={form.control}
          name="campaignName"
          label={content.campaignNameLabel}
          placeholder={content.campaignNamePlaceholder}
        />

        <FormField
          control={form.control}
          name="seoKeywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <div className="flex items-center gap-2">
                  <span>{content.seoKeywordsLabel}</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                        >
                          <DynamicIcon name="CircleHelp" className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{content.seoKeywordsTooltip.content}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </FormLabel>
              <FormControl>
                <TagInput
                  placeholder={content.seoKeywordsPlaceholder}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                {content.seoKeywordsDescription}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <CampaignSelectField
            control={form.control}
            name="producer"
            label={content.producerLabel}
            placeholder={content.producerPlaceholder}
            options={producerOptions}
          />
          <CampaignSelectField
            control={form.control}
            name="campaignType"
            label={content.campaignTypeLabel}
            placeholder={content.campaignTypePlaceholder}
            options={campaignTypeOptions}
          />
        </div>
      </CardContent>
    </>
  );
}
