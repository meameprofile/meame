// RUTA: src/app/[locale]/(public)/store/[slug]/page.tsx
/**
 * @file page.tsx
 * @description Página de Detalle de Producto ("Server Shell"), forjada con
 *              resiliencia, observabilidad de élite y una arquitectura soberana.
 * @version 12.0.0 (Observability Contract v20+ Compliance)
 * @author L.I.A. Legacy
 */
import "server-only";
import React from "react";
import { notFound } from "next/navigation";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { getProductBySlug, getProducts } from "@/shared/lib/commerce";
import { logger } from "@/shared/lib/logging";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { Container } from "@/components/ui";
import { ProductGallery } from "@/components/sections/ProductGallery";
import { ProductInfo } from "@/components/sections/ProductInfo";
import { ProductGrid } from "@/components/sections/ProductGrid";
import {
  ProductDetailPageContentSchema,
  type ProductDetailPageContent,
} from "@/shared/lib/schemas/pages/product-detail-page.schema";

interface ProductPageProps {
  params: { slug: string; locale: Locale };
}

export default async function ProductPage({
  params: { slug, locale },
}: ProductPageProps) {
  const traceId = logger.startTrace(`ProductPage_Shell_v12.0:${slug}`);
  const groupId = logger.startGroup(
    `[ProductPage Shell] Ensamblando datos para [${locale}] slug: "${slug}"...`
  );

  try {
    const [{ dictionary, error: dictError }, product, relatedProducts] =
      await Promise.all([
        getDictionary(locale),
        getProductBySlug({ slug, locale }),
        getProducts({ locale }),
      ]);

    const contentValidation = ProductDetailPageContentSchema.safeParse(
      dictionary[slug]
    );

    if (dictError || !product || !contentValidation.success) {
      const cause =
        dictError ||
        (!product ? "Producto no encontrado." : null) ||
        contentValidation.error;
      throw new Error("Faltan datos esenciales (producto o contenido i18n).", {
        cause,
      });
    }
    const content: ProductDetailPageContent = contentValidation.data;

    const filteredRelated = relatedProducts
      .filter((p) => p.id !== product.id)
      .slice(0, 3);

    const absoluteUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/store/${slug}`;

    return (
      <>
        <Container className="py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            <ProductGallery images={content.galleryImages} />
            <ProductInfo
              product={product}
              content={content}
              absoluteUrl={absoluteUrl}
              locale={locale}
            />
          </div>
        </Container>
        <ProductGrid
          products={filteredRelated}
          locale={locale}
          content={{
            ...dictionary.storePage!,
            title: content.relatedProductsTitle,
            subtitle: "",
          }}
        />
      </>
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[ProductPage Shell] Fallo crítico al renderizar.", {
      error: errorMessage,
      cause: error instanceof Error ? error.cause : undefined,
      traceId,
    });
    if (process.env.NODE_ENV === "production") return notFound();
    return (
      <DeveloperErrorDisplay
        context={`ProductPage: ${slug}`}
        errorMessage="No se pudo cargar la página del producto."
        errorDetails={error instanceof Error ? error : errorMessage}
      />
    );
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
