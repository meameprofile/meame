// shared/hooks/use-sound.ts
import { useCallback } from "react";

export const useSound = (soundPath: string, volume = 0.5) => {
  const play = useCallback(() => {
    const audio = new Audio(soundPath);
    audio.volume = volume;
    audio.play();
  }, [soundPath, volume]);
  return play;
};
