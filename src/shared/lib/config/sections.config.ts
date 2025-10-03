// RUTA: src/shared/lib/config/sections.config.ts
/**
 * @file sections.config.ts
 * @description SSoT Soberana para el registro de METADATOS y COMPONENTES.
 *              v33.0.0 (Definitive Build Fix): Refactorizado para importar
 *              únicamente componentes seguros para el cliente, erradicando la
 *              causa raíz de las violaciones de la frontera Cliente-Servidor.
 * @version 33.0.0
 * @author L.I.A. Legacy
 */
import { z } from "zod";
import type { ComponentType } from "react";
import { logger } from "@/shared/lib/logging";
import * as Schemas from "@/shared/lib/schemas/components";
import type { SectionProps } from "@/shared/lib/types/sections.types";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";

// --- [INICIO DE REFACTORIZACIÓN DEFINITIVA] ---
// Se importan las contrapartes de CLIENTE para los componentes que tienen
// una arquitectura dividida (Server Shell + Client Core).
import { HeroClient } from "@/components/sections/HeroClient";
import { SocialProofLogosClient } from "@/components/sections/SocialProofLogosClient";
import { CommentSectionClient } from "@/components/sections/comments/CommentSectionClient";
// Se importan los componentes que son seguros para el cliente o puros.
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { CommunitySection } from "@/components/sections/CommunitySection";
import { ContactSection } from "@/components/sections/ContactSection";
import { DoubleScrollingBanner } from "@/components/sections/DoubleScrollingBanner";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { FeaturedArticlesCarousel } from "@/components/sections/FeaturedArticlesCarousel";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { GuaranteeSection } from "@/components/sections/GuaranteeSection";
import { HeroNews } from "@/components/sections/HeroNews";
import { IngredientAnalysis } from "@/components/sections/IngredientAnalysis";
import { NewsGridClient } from "@/components/sections/NewsGridClient";
import { OrderSection } from "@/components/sections/OrderSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { ProductShowcase } from "@/components/sections/ProductShowcase";
import { ScrollingBanner } from "@/components/sections/ScrollingBanner";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { SponsorsSection } from "@/components/sections/SponsorsSection";
import { TeamSection } from "@/components/sections/TeamSection";
import { TestimonialCarouselSection } from "@/components/sections/TestimonialCarouselSection";
import { TestimonialGrid } from "@/components/sections/TestimonialGrid";
import { TextSection } from "@/components/sections/TextSection";
import { ThumbnailCarousel } from "@/components/sections/ThumbnailCarousel";
// --- [FIN DE REFACTORIZACIÓN DEFINITIVA] ---

logger.trace(
  "[sections.config.ts] Manifiesto soberano de secciones cargado (v33.0)."
);

interface SectionMetadata {
  readonly dictionaryKey: keyof Dictionary;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly schema: z.ZodObject<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly component: ComponentType<any>;
}

type StandardSectionComponent = ComponentType<SectionProps<keyof Dictionary>>;

export const sectionsConfig = {
  BenefitsSection: {
    dictionaryKey: "benefitsSection",
    schema: Schemas.BenefitsSectionContentSchema,
    component: BenefitsSection as unknown as StandardSectionComponent,
  },
  CommunitySection: {
    dictionaryKey: "communitySection",
    schema: Schemas.CommunitySectionContentSchema,
    component: CommunitySection as unknown as StandardSectionComponent,
  },
  CommentSection: {
    dictionaryKey: "commentSection",
    schema: Schemas.CommentSectionContentSchema,
    component: CommentSectionClient, // <-- CORREGIDO
  },
  ContactSection: {
    dictionaryKey: "contactSection",
    schema: Schemas.ContactSectionContentSchema,
    component: ContactSection as unknown as StandardSectionComponent,
  },
  DoubleScrollingBanner: {
    dictionaryKey: "doubleScrollingBanner",
    schema: Schemas.DoubleScrollingBannerContentSchema,
    component: DoubleScrollingBanner as unknown as StandardSectionComponent,
  },
  FaqAccordion: {
    dictionaryKey: "faqAccordion",
    schema: Schemas.FaqAccordionContentSchema,
    component: FaqAccordion as unknown as StandardSectionComponent,
  },
  FeaturedArticlesCarousel: {
    dictionaryKey: "featuredArticlesCarousel",
    schema: Schemas.FeaturedArticlesCarouselContentSchema,
    component: FeaturedArticlesCarousel as unknown as StandardSectionComponent,
  },
  FeaturesSection: {
    dictionaryKey: "featuresSection",
    schema: Schemas.FeaturesSectionContentSchema,
    component: FeaturesSection as unknown as StandardSectionComponent,
  },
  GuaranteeSection: {
    dictionaryKey: "guaranteeSection",
    schema: Schemas.GuaranteeSectionContentSchema,
    component: GuaranteeSection as unknown as StandardSectionComponent,
  },
  Hero: {
    dictionaryKey: "hero",
    schema: Schemas.HeroContentSchema,
    component: HeroClient, // <-- CORREGIDO
  },
  HeroNews: {
    dictionaryKey: "heroNews",
    schema: Schemas.HeroNewsContentSchema,
    component: HeroNews as unknown as StandardSectionComponent,
  },
  IngredientAnalysis: {
    dictionaryKey: "ingredientAnalysis",
    schema: Schemas.IngredientAnalysisContentSchema,
    component: IngredientAnalysis as unknown as StandardSectionComponent,
  },
  NewsGrid: {
    dictionaryKey: "newsGrid",
    schema: Schemas.NewsGridContentSchema,
    component: NewsGridClient, // <-- CORREGIDO
  },
  OrderSection: {
    dictionaryKey: "orderSection",
    schema: Schemas.OrderSectionContentSchema,
    component: OrderSection as unknown as StandardSectionComponent,
  },
  PricingSection: {
    dictionaryKey: "pricingSection",
    schema: Schemas.PricingSectionContentSchema,
    component: PricingSection as unknown as StandardSectionComponent,
  },
  ProductShowcase: {
    dictionaryKey: "productShowcase",
    schema: Schemas.ProductShowcaseContentSchema,
    component: ProductShowcase as unknown as StandardSectionComponent,
  },
  ScrollingBanner: {
    dictionaryKey: "scrollingBanner",
    schema: Schemas.ScrollingBannerContentSchema,
    component: ScrollingBanner as unknown as StandardSectionComponent,
  },
  ServicesSection: {
    dictionaryKey: "servicesSection",
    schema: Schemas.ServicesSectionContentSchema,
    component: ServicesSection as unknown as StandardSectionComponent,
  },
  SocialProofLogos: {
    dictionaryKey: "socialProofLogos",
    schema: Schemas.SocialProofLogosContentSchema,
    component: SocialProofLogosClient, // <-- CORREGIDO
  },
  SponsorsSection: {
    dictionaryKey: "sponsorsSection",
    schema: Schemas.SponsorsSectionContentSchema,
    component: SponsorsSection as unknown as StandardSectionComponent,
  },
  TeamSection: {
    dictionaryKey: "teamSection",
    schema: Schemas.TeamSectionContentSchema,
    component: TeamSection as unknown as StandardSectionComponent,
  },
  TestimonialCarouselSection: {
    dictionaryKey: "testimonialCarouselSection",
    schema: Schemas.TestimonialCarouselSectionContentSchema,
    component:
      TestimonialCarouselSection as unknown as StandardSectionComponent,
  },
  TestimonialGrid: {
    dictionaryKey: "testimonialGrid",
    schema: Schemas.TestimonialGridContentSchema,
    component: TestimonialGrid as unknown as StandardSectionComponent,
  },
  TextSection: {
    dictionaryKey: "aboutPage",
    schema: z.object({ content: Schemas.ContentBlocksSchema }),
    component: TextSection as unknown as StandardSectionComponent,
  },
  ThumbnailCarousel: {
    dictionaryKey: "thumbnailCarousel",
    schema: Schemas.ThumbnailCarouselContentSchema,
    component: ThumbnailCarousel as unknown as StandardSectionComponent,
  },
} as const satisfies Record<string, SectionMetadata>;

export type SectionName = keyof typeof sectionsConfig;
