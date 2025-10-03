// components/ui/cinematic-controls/ControlsBar.tsx
/**
 * @file ControlsBar.tsx
 * @description Componente ensamblador para la barra de controles de "Aether".
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { PlayPauseButton } from "./PlayPauseButton";
import { VolumeControl } from "./VolumeControl";
import { FullscreenButton } from "./FullscreenButton";
import { ProgressBar } from "./ProgressBar";
import type { CinematicRendererHook } from "@/shared/hooks/use-cinematic-renderer";

// Usamos Pick para seleccionar solo las props que este componente necesita del hook
type ControlsBarProps = Pick<
  CinematicRendererHook,
  | "isPlaying"
  | "togglePlay"
  | "isMuted"
  | "toggleMute"
  | "isFullscreen"
  | "toggleFullscreen"
  | "progress"
  | "onSeek"
>;

export function ControlsBar(props: ControlsBarProps) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-3xl bg-black/50 backdrop-blur-md rounded-full px-3 py-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
      <PlayPauseButton
        isPlaying={props.isPlaying}
        onTogglePlay={props.togglePlay}
      />
      <ProgressBar
        currentTime={props.progress.currentTime}
        duration={props.progress.duration}
        onSeek={props.onSeek}
      />
      <VolumeControl isMuted={props.isMuted} onToggleMute={props.toggleMute} />
      <FullscreenButton
        isFullscreen={props.isFullscreen}
        onToggleFullscreen={props.toggleFullscreen}
      />
    </div>
  );
}
// components/ui/cinematic-controls/ControlsBar.tsx
