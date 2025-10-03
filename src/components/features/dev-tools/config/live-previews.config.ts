// RUTA: src/components/features/dev-tools/config/live-previews.config.ts
/**
 * @file live-previews.config.ts
 * @description SSoT para el registro de componentes SEGUROS PARA EL CLIENTE para el EDVI.
 *              Este manifiesto es el guardián de la frontera Servidor-Cliente. Solo
 *              debe importar componentes de presentación puros ("use client") para
 *              garantizar la integridad del build.
 * @version 7.0.0 (Server-Client Boundary Enforcement)
 *@author RaZ Podestá - MetaShark Tech
 */
import type { ComponentType } from "react";
import { logger } from "@/shared/lib/logging";

logger.trace(
  "[LivePreviewRegistry] Cargando registro para EDVI (v7.0 - Client-Safe)."
);

// --- Pilar V (Arquitectura): Importaciones quirúrgicas SÓLO a componentes de CLIENTE ---
import { Footer } from "@/components/layout/Footer";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { CommunitySection } from "@/components/sections/CommunitySection";
import { ContactSection } from "@/components/sections/ContactSection";
import { DoubleScrollingBanner } from "@/components/sections/DoubleScrollingBanner";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { FeaturedArticlesCarousel } from "@/components/sections/FeaturedArticlesCarousel";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { GuaranteeSection } from "@/components/sections/GuaranteeSection";
import { HeroClient } from "@/components/sections/HeroClient";
import { HeroNews } from "@/components/sections/HeroNews";
import { IngredientAnalysis } from "@/components/sections/IngredientAnalysis";
import { NewsGrid } from "@/components/sections/NewsGrid";
import { OrderSection } from "@/components/sections/OrderSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { ProductShowcase } from "@/components/sections/ProductShowcase";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { SocialProofLogosClient } from "@/components/sections/SocialProofLogosClient";
import { SponsorsSection } from "@/components/sections/SponsorsSection";
import { TeamSection } from "@/components/sections/TeamSection";
import { TestimonialCarouselSection } from "@/components/sections/TestimonialCarouselSection";
import { TestimonialGrid } from "@/components/sections/TestimonialGrid";
import { TextSection } from "@/components/sections/TextSection";
import { ThumbnailCarousel } from "@/components/sections/ThumbnailCarousel";
// --- [INICIO DE REFACTORIZACIÓN DE FRONTERA] ---
// Se importa el Header y CommentSection en su versión de CLIENTE para el canvas.
import HeaderClient from "@/components/layout/HeaderClient";
import { CommentSectionClient } from "@/components/sections/comments/CommentSectionClient";
// --- [FIN DE REFACTORIZACIÓN DE FRONTERA] ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const livePreviewComponentMap: Record<string, ComponentType<any>> = {
  StandardHeader: HeaderClient,
  MinimalHeader: HeaderClient,
  StandardFooter: Footer,
  BenefitsSection,
  CommunitySection,
  ContactSection,
  DoubleScrollingBanner,
  FaqAccordion,
  FeaturedArticlesCarousel,
  FeaturesSection,
  GuaranteeSection,
  Hero: HeroClient,
  HeroNews,
  IngredientAnalysis,
  NewsGrid,
  OrderSection,
  PricingSection,
  ProductShowcase,
  ServicesSection,
  SocialProofLogos: SocialProofLogosClient,
  SponsorsSection,
  TeamSection,
  TestimonialCarouselSection,
  TestimonialGrid,
  TextSection,
  ThumbnailCarousel,
  // --- [INICIO DE REFACTORIZACIÓN DE FRONTERA] ---
  // Se mapea la sección al componente de CLIENTE para la previsualización.
  CommentSection: CommentSectionClient,
  // --- [FIN DE REFACTORIZACIÓN DE FRONTERA] ---
};
