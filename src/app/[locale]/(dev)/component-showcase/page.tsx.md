// app/[locale]/(dev)/dev/component-showcase/page.tsx
/\*\*

- @file page.tsx
- @description Página de vitrina para componentes de ShadCN/ui base.
-              v1.1.0 (PageHeader Contract Fix): Se alinea la llamada a PageHeader
-              con su contrato de API de élite.
- @version 1.1.0
- @author RaZ Podestá - MetaShark Tech
  \*/
  import React from "react";
  import { PageHeader } from "@/components/layout/PageHeader";
  import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Alert,
  AlertTitle,
  AlertDescription,
  Button,
  } from "@/components/ui";
  import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  } from "@/components/ui/Table";
  import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  } from "@/components/ui/Dialog";
  import { DynamicIcon } from "@/components/ui";

export default async function ComponentShowcasePage() {
const invoices = [
{
invoice: "INV001",
paymentStatus: "Pagado",
totalAmount: "$250.00",
paymentMethod: "Tarjeta de Crédito",
},
{
invoice: "INV002",
paymentStatus: "Pendiente",
totalAmount: "$150.00",
paymentMethod: "PayPal",
},
];

return (
<>
{/_ --- [INICIO DE CORRECCIÓN DE CONTRATO] --- _/}
<PageHeader
content={{
          title: "Vitrina de Componentes",
          subtitle:
            "Una instancia base de cada componente ShadCN/ui instalado para pruebas visuales.",
        }}
/>
{/_ --- [FIN DE CORRECCIÓN DE CONTRATO] --- _/}
<Container className="py-12 space-y-12">
{/_ Card _/}
<Card>
<CardHeader>
<CardTitle>Card</CardTitle>
</CardHeader>
<CardContent>

<p>Este es un componente de tarjeta base.</p>
</CardContent>
</Card>

        {/* Alert */}
        <Alert>
          <DynamicIcon name="Terminal" className="h-4 w-4" />
          <AlertTitle>Alerta</AlertTitle>
          <AlertDescription>
            Este es un componente de alerta para notificaciones importantes.
          </AlertDescription>
        </Alert>

        {/* Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button>Default</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </CardContent>
        </Card>

        {/* Dialog */}
        <Card>
          <CardHeader>
            <CardTitle>Dialog</CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Abrir Diálogo</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Editar Perfil</DialogTitle>
                  <DialogDescription>
                    Realiza cambios en tu perfil aquí. Haz clic en guardar
                    cuando hayas terminado.
                  </DialogDescription>
                </DialogHeader>
                {/* Contenido del formulario iría aquí */}
                <DialogFooter>
                  <Button type="submit">Guardar Cambios</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Table</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Factura</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.invoice}>
                    <TableCell className="font-medium">
                      {invoice.invoice}
                    </TableCell>
                    <TableCell>{invoice.paymentStatus}</TableCell>
                    <TableCell>{invoice.paymentMethod}</TableCell>
                    <TableCell className="text-right">
                      {invoice.totalAmount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Container>
    </>

);
}
// app/[locale]/(dev)/dev/component-showcase/page.tsx
