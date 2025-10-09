// RUTA: src/components/features/bavi/components/AssetUploader/components/AssetDropzone.tsx
/**
 * @file AssetDropzone.tsx
 * @description Componente de presentación puro para la zona de arrastre de archivos.
 *              Forjado con observabilidad de élite y MEA/UX.
 * @version 3.0.0 (MEA/UX Injected & Elite Compliance)
 * @author L.I.A. Legacy
 */
"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { logger } from "@/shared/lib/logging";
import { cn } from "@/shared/lib/utils/cn";

interface AssetDropzoneProps {
  getRootProps: <T extends React.HTMLAttributes<HTMLElement>>(props?: T) => T;
  getInputProps: <T extends React.InputHTMLAttributes<HTMLInputElement>>(
    props?: T
  ) => T;
  isDragActive: boolean;
  preview: string | null;
  text: string;
}

export function AssetDropzone({
  getRootProps,
  getInputProps,
  isDragActive,
  preview,
  text,
}: AssetDropzoneProps) {
  logger.trace("[AssetDropzone] Renderizando UI de dropzone v3.0.");

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative p-8 border-2 border-dashed rounded-lg flex items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[240px] group",
        isDragActive
          ? "border-primary bg-primary/10"
          : "border-muted-foreground/30 hover:border-primary/50"
      )}
    >
      <input {...getInputProps()} />
      {preview ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Image
            src={preview}
            alt="Vista previa del activo a subir"
            width={240}
            height={240}
            className="object-contain max-h-48 rounded-md transition-transform duration-300 group-hover:scale-105"
          />
        </motion.div>
      ) : (
        <p className="text-muted-foreground">{text}</p>
      )}
    </div>
  );
}
