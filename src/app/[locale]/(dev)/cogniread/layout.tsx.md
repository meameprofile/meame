// RUTA: src/app/[locale]/(dev)/cogniread/layout.tsx
/\*\*

- @file layout.tsx
- @description Layout soberano para el dashboard de CogniRead.
- @version 1.0.0
- @author RaZ Podestá - MetaShark Tech
  \*/
  import React from "react";
  import { Container } from "@/components/ui";

export default function CogniReadLayout({
children,
}: {
children: React.ReactNode;
}) {
return (
// Se elimina el PageHeader para dar paso a una UI de dashboard más integrada
// que será definida en la página principal.
<Container className="py-8">{children}</Container>
);
}
