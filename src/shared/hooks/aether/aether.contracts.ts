// RUTA: src/shared/hooks/aether/aether.contracts.ts
/**
 * @file aether.contracts.ts
 * @description SSoT para los contratos de tipo del dominio "Aether", ahora con
 *              soporte para el estado de desacoplamiento (Picture-in-Picture).
 * @version 4.0.0 (Detachable State)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import type { useAetherOrchestrator } from "./use-aether-orchestrator";

export type PlaybackEventType =
  | "play"
  | "pause"
  | "seek"
  | "ended"
  | "volumechange";

export interface PlaybackEvent {
  type: PlaybackEventType;
  timestamp: number;
  duration: number;
  visitorId: string;
}

export interface AetherOrchestratorProps {
  src: string;
  audioSrc?: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onPlaybackEvent?: (event: PlaybackEvent) => void;
}

export type AetherOrchestratorHook = ReturnType<typeof useAetherOrchestrator>;
