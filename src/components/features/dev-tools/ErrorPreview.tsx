// components/dev/ErrorPreview.tsx
/**
 * @file ErrorPreview.tsx
 * @description Componente de UI atómico para mostrar un error de renderizado
 *              dentro de las vistas previas generadas por la API.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import * as React from "react";

interface ErrorPreviewProps {
  componentName: string;
}

export function ErrorPreview({
  componentName,
}: ErrorPreviewProps): React.ReactElement {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1f2937",
        color: "#fecaca",
        border: "2px dashed #ef4444",
        borderRadius: "8px",
        padding: "20px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ fontSize: "24px", fontWeight: "bold" }}>Render Error</div>
      <div style={{ fontSize: "16px", marginTop: "8px" }}>
        Could not render preview for:
      </div>
      <div
        style={{
          fontSize: "18px",
          marginTop: "4px",
          padding: "4px 12px",
          backgroundColor: "#374151",
          borderRadius: "4px",
        }}
      >
        {componentName}
      </div>
    </div>
  );
}
// components/dev/ErrorPreview.tsx
