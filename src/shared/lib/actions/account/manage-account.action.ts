// RUTA: src/shared/lib/actions/account/manage-account.action.ts
/**
 * @file manage-account.action.ts
 * @description Server Actions seguras para la gestión de la cuenta del usuario.
 * @version 2.0.0 (Holistic Elite Leveling)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import {
  UpdateProfileSchema,
  UpdatePasswordSchema,
} from "@/shared/lib/schemas/account/account-forms.schema";

export async function updateUserProfileAction(
  formData: FormData
): Promise<ActionResult<null>> {
  const traceId = logger.startTrace("updateUserProfileAction_v2.0");
  logger.startGroup("[Action] Actualizando perfil de usuario...", traceId);

  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Acción no autorizada." };
    logger.traceEvent(traceId, `Usuario ${user.id} autorizado.`);

    const formValues = { fullName: formData.get("fullName") };
    const validation = UpdateProfileSchema.safeParse(formValues);
    if (!validation.success) {
      const errorMsg =
        validation.error.flatten().fieldErrors.fullName?.[0] ||
        "Datos inválidos.";
      logger.warn("[Action] Validación de perfil fallida.", {
        error: errorMsg,
        traceId,
      });
      return { success: false, error: errorMsg };
    }
    logger.traceEvent(traceId, "Payload validado.");

    const { error } = await supabase.auth.updateUser({
      data: { full_name: validation.data.fullName },
    });
    if (error) throw new Error(error.message);

    revalidatePath("/account");
    logger.success("[Action] Perfil actualizado con éxito.", {
      userId: user.id,
      traceId,
    });
    return { success: true, data: null };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Action] Fallo crítico al actualizar el perfil.", {
      error: errorMessage,
      traceId,
    });
    return { success: false, error: "No se pudo actualizar el perfil." };
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}

export async function updateUserPasswordAction(
  formData: FormData
): Promise<ActionResult<null>> {
  const traceId = logger.startTrace("updateUserPasswordAction_v2.0");
  logger.startGroup("[Action] Actualizando contraseña de usuario...", traceId);

  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Acción no autorizada." };
    logger.traceEvent(traceId, `Usuario ${user.id} autorizado.`);

    const formValues = {
      currentPassword: formData.get("currentPassword"),
      newPassword: formData.get("newPassword"),
      confirmPassword: formData.get("confirmPassword"),
    };

    const validation = UpdatePasswordSchema.safeParse(formValues);
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      const errorMessage =
        fieldErrors.currentPassword?.[0] ||
        fieldErrors.newPassword?.[0] ||
        fieldErrors.confirmPassword?.[0] ||
        "Datos inválidos.";
      logger.warn("[Action] Validación de contraseña fallida.", {
        error: errorMessage,
        traceId,
      });
      return { success: false, error: errorMessage };
    }
    logger.traceEvent(traceId, "Payload validado.");

    const { error } = await supabase.auth.updateUser({
      password: validation.data.newPassword,
    });
    if (error) throw new Error(error.message);

    logger.success("[Action] Contraseña actualizada con éxito.", {
      userId: user.id,
      traceId,
    });
    return { success: true, data: null };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Action] Fallo crítico al actualizar la contraseña.", {
      error: errorMessage,
      traceId,
    });
    return { success: false, error: "No se pudo actualizar la contraseña." };
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}

export async function deleteUserAccountAction(): Promise<ActionResult<null>> {
  const traceId = logger.startTrace("deleteUserAccountAction_v2.0");
  logger.startGroup("[Action] Eliminando cuenta de usuario...", traceId);

  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Acción no autorizada." };

    logger.warn(
      "[Action] SIMULACIÓN: Se ha iniciado la eliminación de la cuenta para el usuario.",
      { userId: user.id, traceId }
    );
    // En producción, aquí se llamaría a la RPC:
    // const { error } = await supabase.rpc('delete_user_account');
    // if (error) throw new Error(error.message);

    // Aquí también se invalidaría la sesión del usuario.

    logger.success("[Action] SIMULACIÓN: Cuenta programada para eliminación.", {
      traceId,
    });
    return { success: true, data: null };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Action] Fallo crítico al eliminar la cuenta.", {
      error: errorMessage,
      traceId,
    });
    return { success: false, error: "No se pudo eliminar la cuenta." };
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
