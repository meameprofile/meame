// RUTA: src/components/features/aether/_components/controls/ControlsBar.tsx
/**
 * @file ControlsBar.tsx
 * @description Componente ensamblador para la barra de controles de "Aether",
 *              ahora 100% data-driven y con un contrato de datos soberano y desacoplado.
 * @version 5.0.0 (I18n & Data-Driven & Decoupled)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { z } from "zod";
import { PlayPauseButton } from "./PlayPauseButton";
import { VolumeControl } from "./VolumeControl";
import { FullscreenButton } from "./FullscreenButton";
import { ProgressBar } from "./ProgressBar";
import { ExpandButton } from "./ExpandButton";
import { PictureInPictureButton } from "./PictureInPictureButton";
import type { AetherOrchestratorHook } from "@/shared/hooks/aether/aether.contracts";
import { AetherControlsContentSchema } from "@/shared/lib/schemas/aether/aether.schema";

// --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA] ---
// Se infiere el tipo directamente desde el schema soberano del componente.
type AetherControlsContent = z.infer<typeof AetherControlsContentSchema>;

type ControlsBarProps = Pick<
  AetherOrchestratorHook,
  | "isPlaying"
  | "togglePlay"
  | "isMuted"
  | "toggleMute"
  | "isFullscreen"
  | "toggleFullscreen"
  | "isExpanded"
  | "toggleExpand"
  | "progress"
  | "onSeek"
  | "isDetached"
  | "toggleDetach"
> & {
  content: AetherControlsContent;
};
// --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA] ---

export function ControlsBar(props: ControlsBarProps) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-3xl bg-black/50 backdrop-blur-md rounded-full px-3 py-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
      <PlayPauseButton
        isPlaying={props.isPlaying}
        onTogglePlay={props.togglePlay}
        playLabel={props.content.playLabel}
        pauseLabel={props.content.pauseLabel}
      />
      <ProgressBar
        currentTime={props.progress.currentTime}
        duration={props.progress.duration}
        onSeek={props.onSeek}
        ariaLabel={props.content.progressBarLabel}
      />
      <VolumeControl
        isMuted={props.isMuted}
        onToggleMute={props.toggleMute}
        muteLabel={props.content.muteLabel}
        unmuteLabel={props.content.unmuteLabel}
      />
      <ExpandButton
        isExpanded={props.isExpanded}
        onToggleExpand={props.toggleExpand}
        expandLabel={props.content.expandLabel}
        collapseLabel={props.content.collapseLabel}
      />
      <PictureInPictureButton
        isPipActive={props.isDetached}
        onTogglePip={props.toggleDetach}
        enterPipLabel={props.content.enterPipLabel}
        exitPipLabel={props.content.exitPipLabel}
      />
      <FullscreenButton
        isFullscreen={props.isFullscreen}
        onToggleFullscreen={props.toggleFullscreen}
        enterFullscreenLabel={props.content.enterFullscreenLabel}
        exitFullscreenLabel={props.content.exitFullscreenLabel}
      />
    </div>
  );
}
