// RUTA: src/app/[locale]/login/layout.tsx
/**
 * @file layout.tsx
 * @description Layout soberano y vacío para la ruta de autenticación.
 *              Su propósito es anular el layout del grupo (dev) para
 *              proporcionar un lienzo limpio para la UI de login/registro.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Este layout simplemente renderiza a sus hijos sin añadir ninguna
  // estructura adicional como Headers o Footers.
  return <>{children}</>;
}
