// app/[locale]/(dev)/dev/campaign-suite/_config/gallery.config.ts
/**
 * @file gallery.config.ts
 * @description SSoT para los componentes disponibles en las galerías de la SDC.
 *              v4.0.0 (i18n Refactor): Se elimina la descripción harcodeada.
 *              El componente ahora solo define la estructura, no el contenido.
 * @version 4.0.0
 * @author RaZ Podestá - MetaShark Tech
 */

export const galleryConfig = {
  headers: [
    {
      name: "StandardHeader",
      previewImage: "/api/component-preview/StandardHeader",
    },
    {
      name: "MinimalHeader",
      previewImage: "/api/component-preview/MinimalHeader",
    },
  ],
  footers: [
    {
      name: "StandardFooter",
      previewImage: "/api/component-preview/StandardFooter",
    },
  ],
  sections: [
    {
      name: "BenefitsSection",
      previewImage: "/api/component-preview/BenefitsSection",
    },
  ],
} as const;

export type GalleryComponentType = keyof typeof galleryConfig;
export type GalleryItem = (typeof galleryConfig)[GalleryComponentType][number];
// app/[locale]/(dev)/dev/campaign-suite/_config/gallery.config.ts
