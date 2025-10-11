// RUTA: src/shared/lib/actions/user-intelligence/index.ts
/**
 * @file index.ts (Barrel File)
 * @description Fachada pública para las Server Actions del dominio User Intelligence.
 * @version 1.0.0 (Architectural Purity)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import { getProfiledUserDetailAction } from "./getProfiledUserDetail.action";
import { getProfiledUsersAction } from "./getProfiledUsers.action";

export { getProfiledUserDetailAction, getProfiledUsersAction };
