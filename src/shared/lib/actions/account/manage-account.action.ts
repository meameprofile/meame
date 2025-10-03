// RUTA: shared/lib/actions/account/manage-account.action.ts
/**
 * @file manage-account.action.ts
 * @description Server Actions seguras para la gestión de la cuenta del usuario.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import {
  UpdateProfileSchema,
  UpdatePasswordSchema,
} from "@/shared/lib/schemas/account/account-forms.schema";

async function getSupabaseServerClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  );
}

export async function updateUserProfileAction(
  formData: FormData
): Promise<ActionResult<null>> {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Acción no autorizada." };

  const formValues = { fullName: formData.get("fullName") };
  const validation = UpdateProfileSchema.safeParse(formValues);
  if (!validation.success) {
    return {
      success: false,
      error:
        validation.error.flatten().fieldErrors.fullName?.[0] ||
        "Datos inválidos.",
    };
  }

  const { error } = await supabase.auth.updateUser({
    data: { full_name: validation.data.fullName },
  });

  if (error) {
    logger.error("Fallo al actualizar el perfil.", {
      userId: user.id,
      error: error.message,
    });
    return { success: false, error: "No se pudo actualizar el perfil." };
  }

  revalidatePath("/account"); // Refresca los datos en la página de la cuenta
  return { success: true, data: null };
}

export async function updateUserPasswordAction(
  formData: FormData
): Promise<ActionResult<null>> {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Acción no autorizada." };

  const formValues = {
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  };
  const validation = UpdatePasswordSchema.safeParse(formValues);
  if (!validation.success) {
    const fieldErrors = validation.error.flatten().fieldErrors;
    const errorMessage =
      fieldErrors.newPassword?.[0] ||
      fieldErrors.confirmPassword?.[0] ||
      "Datos inválidos.";
    return { success: false, error: errorMessage };
  }

  const { error } = await supabase.auth.updateUser({
    password: validation.data.newPassword,
  });

  if (error) {
    logger.error("Fallo al actualizar la contraseña.", {
      userId: user.id,
      error: error.message,
    });
    return { success: false, error: "No se pudo actualizar la contraseña." };
  }

  return { success: true, data: null };
}

export async function deleteUserAccountAction(): Promise<ActionResult<null>> {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Acción no autorizada." };

  // En un escenario de producción, esto DEBE ser una llamada a una Edge Function
  // que maneje la eliminación en cascada de todos los datos del usuario.
  // const { error } = await supabase.rpc('delete_user_account');

  // Por ahora, simularemos el éxito.
  logger.warn("Se ha iniciado la eliminación de la cuenta para el usuario.", {
    userId: user.id,
  });

  // Aquí también se invalidaría la sesión del usuario.

  return { success: true, data: null };
}
