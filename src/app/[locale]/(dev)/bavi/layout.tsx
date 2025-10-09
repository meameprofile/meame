// RUTA: src/app/[locale]/(dev)/bavi/layout.tsx
/**
 * @file layout.tsx
 * @description Layout soberano para la Central de Operaciones BAVI.
 *              Establece la estructura de 2 columnas inspirada en la consola de Cloudinary.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import React from "react";
import { BaviSidebar } from "./_components/BaviSidebar"; // Componente que crearemos a continuación

export default function BaviLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] w-full h-full">
      <BaviSidebar />
      <main className="flex flex-col h-full p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
