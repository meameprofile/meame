// components/ui/ShareButton.tsx
/**
 * @file ShareButton.tsx
 * @description Componente de UI soberano para compartir contenido.
 *              v3.1.0 (API Contract Fix): Corrige la prop `quote` inválida
 *              en `FacebookShareButton` para alinearse con el contrato de API
 *              de `react-share`, resolviendo un error de tipo TS2322.
 * @version 3.1.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { toast } from "sonner";
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailIcon,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";
import { logger } from "@/shared/lib/logging";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";

type ShareContent = NonNullable<Dictionary["shareButton"]>;

interface ShareData {
  title: string;
  text: string;
  url: string;
}

interface ShareButtonProps {
  shareData: ShareData;
  content: ShareContent;
}

export function ShareButton({ shareData, content }: ShareButtonProps) {
  logger.info("[ShareButton] Renderizando v3.1 (API Contract Fix).");

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        logger.trace("[ShareButton] Contenido compartido vía API nativa.");
      } catch (error) {
        logger.warn(
          "[ShareButton] El usuario canceló el diálogo de compartir nativo.",
          { error }
        );
      }
    } else {
      setIsPopoverOpen(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareData.url);
    toast.success(content.copySuccessToast);
    setIsPopoverOpen(false);
  };

  const canShareNatively =
    typeof navigator !== "undefined" && !!navigator.share;

  const TriggerButton = (
    <Button
      variant="outline"
      size="icon"
      onClick={
        canShareNatively ? handleNativeShare : () => setIsPopoverOpen(true)
      }
      aria-label={content.buttonLabel}
    >
      <DynamicIcon name="Share2" />
    </Button>
  );

  if (canShareNatively) {
    return TriggerButton;
  }

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>{TriggerButton}</PopoverTrigger>
      <PopoverContent className="w-auto">
        <div className="space-y-2">
          <p className="font-semibold text-center">{content.popoverTitle}</p>
          <div className="flex gap-2">
            <TwitterShareButton url={shareData.url} title={shareData.title}>
              <TwitterIcon size={32} round />
            </TwitterShareButton>
            {/* --- [INICIO DE CORRECCIÓN DE CONTRATO] --- */}
            {/* Se elimina la prop `quote` inválida. */}
            <FacebookShareButton url={shareData.url}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            {/* --- [FIN DE CORRECCIÓN DE CONTRATO] --- */}
            <WhatsappShareButton url={shareData.url} title={shareData.title}>
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
            <EmailShareButton
              url={shareData.url}
              subject={shareData.title}
              body={shareData.text}
            >
              <EmailIcon size={32} round />
            </EmailShareButton>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 rounded-full"
              onClick={copyToClipboard}
              aria-label={content.copyLinkAction}
            >
              <DynamicIcon name="Link" />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
// components/ui/ShareButton.tsx
