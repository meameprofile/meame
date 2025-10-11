// RUTA: src/components/features/aether/_components/AetherOverlays.tsx
/**
 * @file AetherOverlays.tsx
 * @description Orquestador de UI atómico para los overlays de estado del motor Aether.
 *              Este componente vive en el mundo de React-DOM, fuera del canvas de R3F.
 * @version 1.0.0 (Forged & Elite)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import React from "react";

import { DynamicIcon } from "@/components/ui";
import { FadingLines } from "@/components/ui/Loaders";
import type { VideoState } from "@/shared/hooks/aether/use-video-state";

const OverlayWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/50 text-white gap-2"
  >
    {children}
  </motion.div>
);

interface AetherOverlaysProps {
  videoState: VideoState;
  content: {
    preloaderText: string;
    errorText: string;
  };
}

export function AetherOverlays({ videoState, content }: AetherOverlaysProps) {
  return (
    <AnimatePresence>
      {videoState === "loading" && (
        <OverlayWrapper>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <FadingLines className="w-8 h-8" />
          </motion.div>
          <p className="text-xs">{content.preloaderText}</p>
        </OverlayWrapper>
      )}
      {videoState === "error" && (
        <OverlayWrapper>
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1, x: [-5, 5, -5, 5, 0] }}
            transition={{
              scale: { duration: 0.2 },
              x: { duration: 0.3, ease: "easeInOut" },
            }}
            className="flex flex-col items-center text-center p-4 gap-2 bg-destructive/80 rounded-lg"
          >
            <DynamicIcon name="TriangleAlert" className="w-8 h-8" />
            <p className="text-sm font-semibold">{content.errorText}</p>
          </motion.div>
        </OverlayWrapper>
      )}
    </AnimatePresence>
  );
}
