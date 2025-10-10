// RUTA: src/shared/lib/actions/user-intelligence/user-intelligence.contracts.ts
/**
 * @file user-intelligence.contracts.ts
 * @description SSoT para los contratos de datos del dominio User Intelligence.
 * @version 1.0.0
 * @author L.I.A. Legacy
 */
import { z } from "zod";
import type { VisitorCampaignEventRow } from "@/shared/lib/schemas/analytics/analytics.contracts";

export const UaParserResultSchema = z
  .object({
    ua: z.string(),
    browser: z
      .object({ name: z.string().optional(), version: z.string().optional() })
      .optional(),
    engine: z
      .object({ name: z.string().optional(), version: z.string().optional() })
      .optional(),
    os: z
      .object({ name: z.string().optional(), version: z.string().optional() })
      .optional(),
    device: z
      .object({
        vendor: z.string().optional(),
        model: z.string().optional(),
        type: z.string().optional(),
      })
      .optional(),
    cpu: z.object({ architecture: z.string().optional() }).optional(),
  })
  .passthrough();

export type UaParserResult = z.infer<typeof UaParserResultSchema>;

export const ProfiledUserSchema = z.object({
  userId: z.string().uuid().nullable(),
  sessionId: z.string(),
  userType: z.enum(["Registered", "Anonymous"]),
  displayName: z.string(),
  avatarUrl: z.string().nullable(),
  firstSeenAt: z.string().datetime(),
  lastSeenAt: z.string().datetime(),
  totalEvents: z.number().int(),
});

export type ProfiledUser = z.infer<typeof ProfiledUserSchema>;

export interface ProfiledUserDetail {
  sessionId: string;
  userId: string | null;
  fingerprintId: string;
  userType: "Registered" | "Anonymous";
  displayName: string;
  avatarUrl: string | null;
  ip: string | null;
  geo: {
    countryCode: string | null;
    city: string | null;
    region: string | null;
  } | null;
  userAgent: UaParserResult;
  events: VisitorCampaignEventRow[];
}
