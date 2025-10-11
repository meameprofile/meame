// RUTA: src/components/features/campaign-suite/_components/LivePreviewCanvas/_components/PreviewOverlays.tsx
/**
 * @file PreviewOverlays.tsx
 * @description Componente de presentación puro para los overlays de estado.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import React from "react";

import { DynamicIcon } from "@/components/ui";

const IframeOverlay = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      textAlign: "center",
      backgroundColor: "hsla(var(--background-hsl), 0.8)",
      backdropFilter: "blur(4px)",
      color: "hsl(var(--foreground))",
      fontFamily: "sans-serif",
    }}
  >
    {children}
  </div>
);

export const PreviewLoadingOverlay = ({ text }: { text: string }) => (
  <IframeOverlay>
    <DynamicIcon name="LoaderCircle" className="w-8 h-8 animate-spin" />
    <p style={{ marginTop: "1rem", fontSize: "0.875rem" }}>{text}</p>
  </IframeOverlay>
);

export const PreviewErrorOverlay = ({
  title,
  details,
}: {
  title: string;
  details: string | null;
}) => (
  <IframeOverlay>
    <DynamicIcon
      name="TriangleAlert"
      className="w-8 h-8"
      style={{ color: "hsl(var(--destructive))" }}
    />
    <p
      style={{
        marginTop: "1rem",
        fontSize: "0.875rem",
        fontWeight: "bold",
        color: "hsl(var(--destructive))",
      }}
    >
      {title}
    </p>
    {details && (
      <p style={{ fontSize: "0.75rem", opacity: 0.7, marginTop: "0.5rem" }}>
        {details}
      </p>
    )}
  </IframeOverlay>
);
