// RUTA: src/shared/lib/schemas/i18n.schema.ts
/**
 * @file i18n.schema.ts
 * @description Aparato ensamblador y SSoT para el contrato del diccionario i18n.
 *              v36.0.0 (OAuthButtons Contract Restoration): Se restaura la importación
 *              y fusión del schema para `oAuthButtons`, resolviendo un error crítico
 *              de tipo TS2739 en el flujo de autenticación.
 * @version 36.0.0
 * @author L.I.A. Legacy
 */
import { z } from "zod";

// [DOMINIO GLOBAL Y PORTAL]
import { GlobalsLocaleSchema } from "./globals.schema";
import { StorePageLocaleSchema } from "./pages/store-page.schema";
import { TextPageContentSchema } from "./pages/text-page.schema";
import { NotFoundPageLocaleSchema } from "./pages/not-found-page.schema";
import { SelectLanguagePageLocaleSchema } from "./pages/select-language.schema";

// [DOMINIO DCC - PÁGINAS]
import { DevDashboardLocaleSchema } from "./pages/dev-dashboard.schema";
import { DevLoginPageLocaleSchema } from "./pages/dev-login-page.schema";
import { DevTestPageLocaleSchema } from "./pages/dev-test-page.schema";
import { CampaignSuiteLocaleSchema } from "./pages/dev-campaign-suite.schema";
import { BaviHomePageLocaleSchema } from "./pages/bavi-home-page.schema";
import { BaviAssetExplorerLocaleSchema } from "./pages/bavi-asset-explorer.i18n.schema";
import { RaZPromptsHomePageLocaleSchema } from "./pages/raz-prompts-home-page.schema";
import { CinematicDemoPageLocaleSchema } from "./pages/dev-cinematic-demo-page.schema";
import { CogniReadDashboardLocaleSchema } from "./pages/cogniread-dashboard.schema";
import { CogniReadEditorLocaleSchema } from "./pages/cogniread-editor.schema";
import { Nos3DashboardLocaleSchema } from "./pages/nos3-dashboard.schema";

// [DOMINIO LAYOUT Y UI ATÓMICOS]
import { HeaderLocaleSchema } from "./components/header.schema";
import { FooterLocaleSchema } from "./components/footer.schema";
import { CookieConsentBannerLocaleSchema } from "./components/cookie-consent-banner.schema";
import { DevHeaderLocaleSchema } from "./components/dev/dev-header.schema";
import { DevHomepageHeaderLocaleSchema } from "./components/dev/dev-homepage-header.schema";
import { DevRouteMenuLocaleSchema } from "./components/dev/dev-route-menu.schema";
import { ToggleThemeLocaleSchema } from "./components/toggle-theme.schema";
import { LanguageSwitcherLocaleSchema } from "./components/language-switcher.schema";
import { PageHeaderLocaleSchema } from "./components/page-header.schema";
import { CartLocaleSchema } from "./components/cart.schema";
import { UserNavLocaleSchema } from "./components/auth/user-nav.schema";
// --- [INICIO DE NIVELACIÓN DE INTEGRIDAD v36.0.0] ---
import { OAuthButtonsLocaleSchema } from "./components/auth/oauth-buttons.schema";
// --- [FIN DE NIVELACIÓN DE INTEGRIDAD v36.0.0] ---
import { NotificationBellLocaleSchema } from "./components/notifications.schema";
import { ValidationErrorLocaleSchema } from "./components/validation-error.schema";
import { SuiteStyleComposerLocaleSchema } from "./components/dev/suite-style-composer.schema";
import { ComponentCanvasHeaderLocaleSchema } from "./components/dev/component-canvas-header.schema";
import { ComponentCanvasLocaleSchema } from "./components/dev/component-canvas.schema";
import { ShareButtonLocaleSchema } from "./components/share-button.schema";
import { AlertLocaleSchema } from "./components/alert.schema";
import { AlertDialogLocaleSchema } from "./components/alert-dialog.schema";
import { ProfileFormLocaleSchema } from "./components/account/profile-form.schema";

// [DOMINIO SECCIONES]
import { BenefitsSectionLocaleSchema } from "./components/benefits-section.schema";
import { CommunitySectionLocaleSchema } from "./components/community-section.schema";
import { ContactSectionLocaleSchema } from "./components/contact-section.schema";
import { DoubleScrollingBannerLocaleSchema } from "./components/double-scrolling-banner.schema";
import { FaqAccordionLocaleSchema } from "./components/faq-accordion.schema";
import { FeaturedArticlesCarouselLocaleSchema } from "./components/featured-articles-carousel.schema";
import { FeaturesSectionLocaleSchema } from "./components/features-section.schema";
import { GuaranteeSectionLocaleSchema } from "./components/guarantee-section.schema";
import { HeroLocaleSchema } from "./components/hero.schema";
import { HeroNewsLocaleSchema } from "./components/hero-news.schema";
import { IngredientAnalysisLocaleSchema } from "./components/ingredient-analysis.schema";
import { NewsGridLocaleSchema } from "./components/news-grid.schema";
import { OrderSectionLocaleSchema } from "./components/order-section.schema";
import { PricingSectionLocaleSchema } from "./components/pricing-section.schema";
import { ProductShowcaseLocaleSchema } from "./components/product-showcase.schema";
import { ScrollingBannerLocaleSchema } from "./components/scrolling-banner.schema";
import { ServicesSectionLocaleSchema } from "./components/services-section.schema";
import { SocialProofLogosLocaleSchema } from "./components/social-proof-logos.schema";
import { SponsorsSectionLocaleSchema } from "./components/sponsors-section.schema";
import { TeamSectionLocaleSchema } from "./components/team-section.schema";
import { TestimonialCarouselSectionLocaleSchema } from "./components/testimonial-carousel-section.schema";
import { TestimonialGridLocaleSchema } from "./components/testimonial-grid.schema";
import { ThumbnailCarouselLocaleSchema } from "./components/thumbnail-carousel.schema";
import { CommentSectionLocaleSchema } from "./components/comment-section.schema";

// [DOMINIO ECOSISTEMAS ADICIONALES]
import { BaviUploaderLocaleSchema } from "./bavi/bavi-uploader.i18n.schema";
import { PromptCreatorLocaleSchema } from "./raz-prompts/prompt-creator.i18n.schema";
import { PromptVaultLocaleSchema } from "./raz-prompts/prompt-vault.i18n.schema";
import { OrderConfirmationEmailLocaleSchema } from "./emails/order-confirmation-email.schema";
import { DockLocaleSchema } from "./components/razBits/Dock/dock.schema";
import { LightRaysLocaleSchema } from "./components/razBits/LightRays/light-rays.schema";
import { MagicBentoLocaleSchema } from "./components/razBits/MagicBento/magic-bento.schema";

const baseSchema = z.object({
  ...GlobalsLocaleSchema.shape,
  ...StorePageLocaleSchema.shape,
  ...NotFoundPageLocaleSchema.shape,
  ...SelectLanguagePageLocaleSchema.shape,
  aboutPage: TextPageContentSchema.optional(),
  privacyPage: TextPageContentSchema.optional(),
  termsPage: TextPageContentSchema.optional(),
  cookiesPage: TextPageContentSchema.optional(),
  ...DevDashboardLocaleSchema.shape,
  ...DevLoginPageLocaleSchema.shape,
  ...DevTestPageLocaleSchema.shape,
  ...CampaignSuiteLocaleSchema.shape,
  ...BaviHomePageLocaleSchema.shape,
  ...BaviAssetExplorerLocaleSchema.shape,
  ...RaZPromptsHomePageLocaleSchema.shape,
  ...CinematicDemoPageLocaleSchema.shape,
  ...CogniReadDashboardLocaleSchema.shape,
  ...CogniReadEditorLocaleSchema.shape,
  ...Nos3DashboardLocaleSchema.shape,
  ...HeaderLocaleSchema.shape,
  ...FooterLocaleSchema.shape,
  ...CookieConsentBannerLocaleSchema.shape,
  ...DevHeaderLocaleSchema.shape,
  ...DevHomepageHeaderLocaleSchema.shape,
  ...DevRouteMenuLocaleSchema.shape,
  ...ToggleThemeLocaleSchema.shape,
  ...LanguageSwitcherLocaleSchema.shape,
  ...PageHeaderLocaleSchema.shape,
  ...CartLocaleSchema.shape,
  ...UserNavLocaleSchema.shape,
  // --- [INICIO DE NIVELACIÓN DE INTEGRIDAD v36.0.0] ---
  ...OAuthButtonsLocaleSchema.shape,
  // --- [FIN DE NIVELACIÓN DE INTEGRIDAD v36.0.0] ---
  ...NotificationBellLocaleSchema.shape,
  ...ValidationErrorLocaleSchema.shape,
  ...SuiteStyleComposerLocaleSchema.shape,
  ...ComponentCanvasHeaderLocaleSchema.shape,
  ...ComponentCanvasLocaleSchema.shape,
  ...ShareButtonLocaleSchema.shape,
  ...AlertLocaleSchema.shape,
  ...AlertDialogLocaleSchema.shape,
  ...ProfileFormLocaleSchema.shape,
  ...BenefitsSectionLocaleSchema.shape,
  ...CommunitySectionLocaleSchema.shape,
  ...ContactSectionLocaleSchema.shape,
  ...DoubleScrollingBannerLocaleSchema.shape,
  ...FaqAccordionLocaleSchema.shape,
  ...FeaturedArticlesCarouselLocaleSchema.shape,
  ...FeaturesSectionLocaleSchema.shape,
  ...GuaranteeSectionLocaleSchema.shape,
  ...HeroLocaleSchema.shape,
  ...HeroNewsLocaleSchema.shape,
  ...IngredientAnalysisLocaleSchema.shape,
  ...NewsGridLocaleSchema.shape,
  ...OrderSectionLocaleSchema.shape,
  ...PricingSectionLocaleSchema.shape,
  ...ProductShowcaseLocaleSchema.shape,
  ...ScrollingBannerLocaleSchema.shape,
  ...ServicesSectionLocaleSchema.shape,
  ...SocialProofLogosLocaleSchema.shape,
  ...SponsorsSectionLocaleSchema.shape,
  ...TeamSectionLocaleSchema.shape,
  ...TestimonialCarouselSectionLocaleSchema.shape,
  ...TestimonialGridLocaleSchema.shape,
  ...ThumbnailCarouselLocaleSchema.shape,
  ...CommentSectionLocaleSchema.shape,
  ...BaviUploaderLocaleSchema.shape,
  ...PromptCreatorLocaleSchema.shape,
  ...PromptVaultLocaleSchema.shape,
  ...DockLocaleSchema.shape,
  ...LightRaysLocaleSchema.shape,
  ...MagicBentoLocaleSchema.shape,
  ...OrderConfirmationEmailLocaleSchema.shape,
});

export const i18nSchema = baseSchema.passthrough();

export type Dictionary = z.infer<typeof i18nSchema>;
