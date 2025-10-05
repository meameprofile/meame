// RUTA: src/components/layout/LanguageSelectorModal.tsx
/**
 * @file LanguageSelectorModal.tsx
 * @description Modal de élite para la selección de idioma a gran escala.
 * @version 3.0.0 (Holistic Contract Restoration)
 * @author L.I.A. Legacy
 */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Input,
  ScrollArea,
  Button,
  DynamicIcon,
  FlagIcon,
} from "@/components/ui";
import { type Locale } from "@/shared/lib/i18n/i18n.config";
import { LANGUAGE_MANIFEST } from "@/shared/lib/i18n/global.i18n.manifest";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import { logger } from "@/shared/lib/logging";
type LanguageSwitcherContent = NonNullable<Dictionary["languageSwitcher"]>;
interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocale: Locale;
  content: LanguageSwitcherContent;
}

export function LanguageSelectorModal({
  isOpen,
  onClose,
  currentLocale,
  content,
}: LanguageSelectorModalProps) {
  const traceId = useMemo(
    () => logger.startTrace("LanguageSelectorModal_v3.0"),
    []
  );

  useEffect(() => {
    if (isOpen) {
      logger.info("[LanguageSelectorModal] Modal montado (v3.0).", { traceId });
    }
  }, [isOpen, traceId]);

  const [search, setSearch] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const groupedAndFilteredLanguages = useMemo(() => {
    const lowercasedSearch = search.toLowerCase();
    const filtered = LANGUAGE_MANIFEST.filter(
      (lang) =>
        lang.name.toLowerCase().includes(lowercasedSearch) ||
        lang.englishName.toLowerCase().includes(lowercasedSearch) ||
        lang.code.toLowerCase().includes(lowercasedSearch)
    );

    return filtered.reduce<Record<string, typeof filtered>>((acc, lang) => {
      const continent =
        content.continents[lang.continent as keyof typeof content.continents] ||
        content.continents.Other;
      if (!acc[continent]) acc[continent] = [];
      acc[continent].push(lang);
      return acc;
    }, {});
  }, [search, content]);

  const onSelect = (locale: Locale) => {
    Cookies.set("NEXT_LOCALE", locale, { expires: 365, path: "/" });
    const newPathname = pathname.replace(`/${currentLocale}`, `/${locale}`);
    router.push(newPathname);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{content.modalTitle}</DialogTitle>
          <DialogDescription>{content.modalDescription}</DialogDescription>
        </DialogHeader>
        <div className="relative my-4">
          <DynamicIcon
            name="Search"
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
          />
          <Input
            placeholder={content.searchPlaceholder}
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label={content.searchPlaceholder}
          />
        </div>
        <ScrollArea className="flex-grow pr-4 -mr-4">
          {Object.keys(groupedAndFilteredLanguages).length > 0 ? (
            Object.entries(groupedAndFilteredLanguages).map(
              ([continent, languages]) => (
                <div key={continent}>
                  <h3 className="font-semibold text-sm text-muted-foreground my-2 px-2">
                    {continent}
                  </h3>
                  <div className="space-y-1">
                    {languages.map((lang) => (
                      <Button
                        key={lang.code}
                        variant={
                          currentLocale === lang.code ? "secondary" : "ghost"
                        }
                        className="w-full justify-start h-12 text-left"
                        onClick={() => onSelect(lang.code as Locale)}
                      >

                        <FlagIcon
                          locale={lang.code as Locale}
                          className="w-5 h-5 mr-3 rounded-sm flex-shrink-0"
                        />

                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">
                            {lang.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {lang.englishName}
                          </span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              )
            )
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <p>{content.noResultsFound}</p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
