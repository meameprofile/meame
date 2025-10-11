// RUTA: src/components/features/account/ProfileForm.tsx
/**
 * @file ProfileForm.tsx
 * @description Componente de cliente seguro para el formulario de actualización de perfil.
 * @version 2.0.0 (Holistic Elite Leveling)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "@supabase/supabase-js";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { updateUserProfileAction } from "@/shared/lib/actions/account/manage-account.action";
import { logger } from "@/shared/lib/logging";
import {
  UpdateProfileSchema,
  type UpdateProfileFormData,
} from "@/shared/lib/schemas/account/account-forms.schema";
import type { ProfileFormContentSchema } from "@/shared/lib/schemas/components/account/profile-form.schema";

type Content = z.infer<typeof ProfileFormContentSchema>;

interface ProfileFormProps {
  user: User;
  content: Content;
}

export function ProfileForm({
  user,
  content,
}: ProfileFormProps): React.ReactElement {
  logger.info("[ProfileForm] Renderizando v2.0 (Elite Leveling).");
  const [isPending, startTransition] = useTransition();

  const form = useForm<UpdateProfileFormData>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      fullName: user.user_metadata.full_name || "",
    },
  });

  const onSubmit = (formData: UpdateProfileFormData) => {
    startTransition(async () => {
      const formPayload = new FormData();
      formPayload.append("fullName", formData.fullName);

      const result = await updateUserProfileAction(formPayload);
      if (result.success) {
        toast.success(content.successToast);
      } else {
        toast.error(content.errorToastTitle, {
          description: result.error,
        });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{content.title}</CardTitle>
        <CardDescription>{content.description}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{content.emailLabel}</Label>
              <Input type="email" value={user.email || ""} disabled />
            </div>
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="fullName">{content.fullNameLabel}</Label>
                  <FormControl>
                    <Input id="fullName" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && (
                <DynamicIcon
                  name="LoaderCircle"
                  className="mr-2 h-4 w-4 animate-spin"
                />
              )}
              {content.saveButtonText}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
