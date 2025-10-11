// RUTA: src/components/layout/GlobalLoader.tsx
/**
 * @file GlobalLoader.tsx
 * @description Orquestador de UI para el indicador de carga global.
 *              Consume el hook 'useGlobalPageLoader' y renderiza una
 *              superposición animada para una MEA/UX de élite.
 * @version 1.0.0 (Elite & MEA/UX)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import React from "react";

import Loading from "@/app/[locale]/(dev)/loading";
import { useGlobalPageLoader } from "@/shared/hooks/use-global-page-loader";

export function GlobalLoader() {
  const { isLoading } = useGlobalPageLoader();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="global-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm"
          aria-live="assertive"
          aria-busy="true"
        >
          <Loading />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
