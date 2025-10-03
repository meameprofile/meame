// RUTA: components/features/account/DeleteAccountZone.tsx
/**
 * @file DeleteAccountZone.tsx
 * @description Componente de cliente para la "Zona de Peligro" de eliminación de cuenta.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/AlertDialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { deleteUserAccountAction } from "@/shared/lib/actions/account/manage-account.action";
import { logger } from "@/shared/lib/logging";

export function DeleteAccountZone(): React.ReactElement {
  const [isPending, startTransition] = useTransition();
  const [confirmationText, setConfirmationText] = useState("");
  const router = useRouter();
  const CONFIRMATION_WORD = "ELIMINAR";

  const handleDelete = () => {
    startTransition(async () => {
      logger.warn(
        "Iniciando la acción de eliminación de cuenta desde el cliente."
      );
      const result = await deleteUserAccountAction();
      if (result.success) {
        toast.info("Tu cuenta ha sido programada para eliminación.");
        // Aquí también se debería forzar el cierre de sesión.
        router.push("/"); // Redirigir al inicio
      } else {
        toast.error("Error al eliminar la cuenta", {
          description: result.error,
        });
      }
    });
  };

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle>Zona de Peligro</CardTitle>
        <CardDescription>
          Estas acciones son permanentes y no se pueden deshacer.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <div className="space-y-1">
          <h4 className="font-semibold">Eliminar esta cuenta</h4>
          <p className="text-sm text-muted-foreground">
            Toda tu información, campañas y datos asociados serán eliminados
            permanentemente.
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Eliminar Cuenta</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción es irreversible. Todos tus datos serán eliminados de
                nuestros servidores. Para confirmar, por favor escribe{" "}
                <strong className="text-foreground">{CONFIRMATION_WORD}</strong>{" "}
                en el campo de abajo.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-2">
              <Label htmlFor="delete-confirmation">Confirmación</Label>
              <Input
                id="delete-confirmation"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                autoComplete="off"
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setConfirmationText("")}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={confirmationText !== CONFIRMATION_WORD || isPending}
                className="bg-destructive hover:bg-destructive/90"
              >
                {isPending && (
                  <DynamicIcon
                    name="LoaderCircle"
                    className="mr-2 h-4 w-4 animate-spin"
                  />
                )}
                Entiendo las consecuencias, eliminar mi cuenta
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
