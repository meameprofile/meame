// RUTA: src/components/sections/SocialProofLogosClient.tsx
/**
 * @file SocialProofLogosClient.tsx
 * @description Componente "Client Core" para la sección de prueba social.
 * @version 3.0.0 (Sovereign Contract & Focus-Aware)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { forwardRef } from "react";
import Marquee from "react-fast-marquee";
import { CldImage } from "next-cloudinary";
import { Container } from "@/components/ui/Container";
import { logger } from "@/shared/lib/logging";
import { cn } from "@/shared/lib/utils/cn";

interface LogoData {
  alt: string;
  publicId: string;
  width: number;
  height: number;
}

interface SocialProofLogosClientProps {
  title: string;
  logos: LogoData[];
  isFocused?: boolean;
}

export const SocialProofLogosClient = forwardRef<
  HTMLElement,
  SocialProofLogosClientProps
>(({ title, logos, isFocused }, ref) => {
  logger.info(
    `[SocialProofLogosClient] Renderizando UI con ${logos.length} logos (v3.0).`
  );

  return (
    <section
      ref={ref}
      aria-labelledby="social-proof-title"
      className={cn(
        "py-12 bg-background transition-all duration-300",
        isFocused && "ring-2 ring-primary"
      )}
    >
      <Container>
        <h2
          id="social-proof-title"
          className="text-center font-semibold text-foreground/70 uppercase tracking-wider mb-8"
        >
          {title}
        </h2>
        <Marquee
          gradient
          gradientColor="hsl(var(--background))"
          gradientWidth={100}
          speed={40}
          autoFill
          pauseOnHover
        >
          {logos.map((logo) => (
            <div
              key={logo.publicId}
              className="mx-12 flex items-center justify-center h-10"
            >
              <CldImage
                src={logo.publicId}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                format="auto"
                quality="auto"
                className="h-10 w-auto object-contain grayscale opacity-60 transition-all duration-300 ease-in-out hover:grayscale-0 hover:opacity-100 hover:scale-110"
              />
            </div>
          ))}
        </Marquee>
      </Container>
    </section>
  );
});
SocialProofLogosClient.displayName = "SocialProofLogosClient";
