// RUTA: src/components/ui/ProductCard.tsx
/**
 * @file ProductCard.tsx
 * @description Aparato de presentación atómico para una única tarjeta de producto.
 *              Encapsula toda la lógica de UI y MEA/UX.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { TiltCard } from "@/components/ui/TiltCard";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { routes } from "@/shared/lib/navigation";
import type { Product } from "@/shared/lib/schemas/entities/product.schema";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import { cn } from "@/shared/lib/utils/cn";

type StorePageContent = NonNullable<Dictionary["storePage"]>;

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <DynamicIcon
        key={i}
        name="Star"
        className={cn(
          "h-4 w-4",
          i < Math.floor(rating)
            ? "text-yellow-400"
            : "text-muted-foreground/30"
        )}
        fill={i < Math.floor(rating) ? "currentColor" : "none"}
      />
    ))}
  </div>
);

interface ProductCardProps {
  product: Product;
  locale: Locale;
  content: StorePageContent;
}

export function ProductCard({ product, locale, content }: ProductCardProps) {
  return (
    <TiltCard className="h-full">
      <Link
        href={routes.storeBySlug.path({ locale, slug: product.slug })}
        className="group relative rounded-xl border border-border bg-card shadow-subtle h-full flex flex-col transition-all duration-300 hover:shadow-strong hover:-translate-y-1"
      >
        {product.isBestseller && (
          <div className="absolute top-3 right-3 z-10 bg-accent text-accent-foreground text-xs font-bold uppercase px-2 py-1 rounded-full">
            {content.bestsellerLabel}
          </div>
        )}
        <div className="relative w-full aspect-square overflow-hidden rounded-t-xl">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-contain p-4 transition-transform duration-500 ease-in-out group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        <div className="p-4 flex-grow flex flex-col text-center border-t border-border">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            {product.categorization.primary}
          </p>
          <h3 className="text-md font-bold text-foreground flex-grow">
            {product.name}
          </h3>
          {product.rating && (
            <div className="flex justify-center my-2">
              <StarRating rating={product.rating} />
            </div>
          )}
          <p className="mt-2 text-xl font-semibold text-primary">
            {new Intl.NumberFormat(locale, {
              style: "currency",
              currency: product.currency,
            }).format(product.price)}
          </p>
        </div>
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl">
          <DynamicIcon
            name="ShoppingCart"
            className="w-10 h-10 text-white mb-4"
          />
          <span className="text-lg font-bold text-white text-center">
            {content.addToCartButton}
          </span>
        </div>
      </Link>
    </TiltCard>
  );
}
