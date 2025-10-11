// RUTA: src/shared/hooks/campaign-suite/use-live-preview-assets.ts
/**
 * @file use-live-preview-assets.ts
 * @description Hook de cliente para obtener y cachear los activos necesarios
 *              para el renderizado del LivePreviewCanvas.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useState, useEffect } from "react";

import { getLivePreviewAssetsAction } from "@/shared/lib/actions/campaign-suite/getLivePreviewAssets.action";
import type { BaviManifest } from "@/shared/lib/schemas/bavi/bavi.manifest.schema";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";

interface LivePreviewAssets {
  baviManifest: BaviManifest;
  dictionary: Dictionary;
}

export function useLivePreviewAssets() {
  const [assets, setAssets] = useState<LivePreviewAssets | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssets = async () => {
      const result = await getLivePreviewAssetsAction();
      if (result.success) {
        setAssets(result.data);
      } else {
        setError(result.error);
      }
      setIsLoading(false);
    };

    fetchAssets();
  }, []);

  return { assets, isLoading, error };
}
