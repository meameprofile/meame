// RUTA: src/components/sections/ProductInfo.tsx
/**
 * @file ProductInfo.tsx
 * @description Panel de información para detalle de producto, forjado con
 *              seguridad de tipos absoluta, resiliencia y cumplimiento estricto
 *              de las Reglas de los Hooks.
 * @version 11.0.0 (Absolute Type Safety & `any` Eradication)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useMemo, useEffect, forwardRef } from "react";
import { useSearchParams } from "next/navigation";
import { DynamicIcon, Separator } from "@/components/ui";
import { TextSection } from "@/components/sections/TextSection";
import { VariantSelectorProvider } from "@/components/features/product-variant-selector/VariantSelectorProvider";
import { VariantSelector } from "@/components/features/product-variant-selector/VariantSelector";
import { AddToCartForm } from "@/components/features/commerce/AddToCartForm";
import { ShareButton } from "@/components/ui/ShareButton";
import type { z } from "zod";
import type { ProductDetailPageContentSchema } from "@/shared/lib/schemas/pages/product-detail-page.schema";
import type { Product } from "@/shared/lib/schemas/entities/product.schema";
import { cn } from "@/shared/lib/utils/cn";
import { logger } from "@/shared/lib/logging";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import type { Locale } from "@/shared/lib/i18n/i18n.config";

type ProductPageContent = z.infer<typeof ProductDetailPageContentSchema>;

interface ProductInfoProps {
  product: Product;
  content: ProductPageContent;
  absoluteUrl: string;
  isFocused?: boolean;
  locale: Locale; // <-- [1] AÑADIR LOCALE AL CONTRATO
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <DynamicIcon
        key={i}
        name="Star"
        className={cn(
          "h-5 w-5",
          i < Math.floor(rating)
            ? "text-yellow-400"
            : "text-muted-foreground/30"
        )}
        fill={i < Math.floor(rating) ? "currentColor" : "none"}
      />
    ))}
  </div>
);

export const ProductInfo = forwardRef<HTMLDivElement, ProductInfoProps>(
  ({ product, content, absoluteUrl, isFocused, locale }, ref) => {
    const traceId = useMemo(
      () => logger.startTrace("ProductInfo_Lifecycle_v11.0"),
      []
    );
    const searchParams = useSearchParams();

    useEffect(() => {
      logger.info(`[ProductInfo] Componente montado para: ${product?.name}`, {
        traceId,
      });
      return () => logger.endTrace(traceId);
    }, [product?.name, traceId]);

    const variants = useMemo(
      () => product?.variants ?? [],
      [product?.variants]
    );

    const selectedVariant = useMemo(() => {
      if (!variants || variants.length === 0) return undefined;
      return variants.find((variant) =>
        variant.selectedOptions.every(
          (option) =>
            searchParams.get(option.name.toLowerCase()) === option.value
        )
      );
    }, [variants, searchParams]);

    const shareText = useMemo(() => {
      if (!content?.description) return "";
      return (
        content.description
          .filter((block) => block.type === "p")
          .map((block) => block.text)
          .join(" ")
          .slice(0, 150) + "..."
      );
    }, [content?.description]);

    if (!product || !content) {
      logger.error(
        "[Guardián] Props 'product' o 'content' no proporcionadas a ProductInfo."
      );
      return (
        <DeveloperErrorDisplay
          context="ProductInfo"
          errorMessage="Contrato de UI violado: Faltan props esenciales."
        />
      );
    }

    const {
      description,
      addToCartButton,
      quantityLabel,
      stockStatus,
      shareButton,
    } = content;

    const stockAvailable = selectedVariant
      ? selectedVariant.availableForSale
      : product.inventory.available > 0;
    const selectedVariantId = selectedVariant?.id;

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-6 transition-all duration-300",
          isFocused && "ring-2 ring-primary rounded-lg p-2"
        )}
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              {product.categorization.primary}
            </p>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 mt-4">
              {product.rating && <StarRating rating={product.rating} />}
              {/* [2] ERRADICACIÓN DE `ANY` */}
              {/* Se utiliza la prop `locale` que el componente recibe legítimamente. */}
              <span className="text-3xl font-bold text-primary">
                {new Intl.NumberFormat(locale, {
                  style: "currency",
                  currency: product.currency,
                }).format(product.price)}
              </span>
            </div>
          </div>
          <ShareButton
            shareData={{
              title: product.name,
              text: shareText,
              url: absoluteUrl,
            }}
            content={shareButton}
          />
        </div>

        <TextSection
          content={description}
          spacing="compact"
          prose={true}
          className="py-0 text-muted-foreground"
        />

        <Separator />

        <VariantSelectorProvider
          options={product.options ?? []}
          variants={variants}
        >
          <VariantSelector />
        </VariantSelectorProvider>

        <AddToCartForm
          isAvailable={stockAvailable}
          variantId={selectedVariantId}
          content={{
            addToCartButton: addToCartButton,
            quantityLabel: quantityLabel,
            outOfStockText: stockStatus.unavailable,
          }}
        />

        <div className="text-sm text-center">
          {stockAvailable ? (
            <p className="text-green-600">
              {stockStatus.available.replace(
                "{{count}}",
                String(product.inventory.available)
              )}
            </p>
          ) : (
            <p className="text-destructive">{stockStatus.unavailable}</p>
          )}
        </div>
      </div>
    );
  }
);
ProductInfo.displayName = "ProductInfo";
