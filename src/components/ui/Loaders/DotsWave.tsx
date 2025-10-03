// components/ui/Loaders/DotsWave.tsx
/**
 * @file DotsWave.tsx
 * @description Loader SVG animado con efecto de onda.
 * @version 1.1.0 (Code Hygiene)
 * @author RaZ Podestá - MetaShark Tech
 */
import React from "react";
import { cn } from "@/shared/lib/utils/cn";

export function DotsWave({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-primary", className)}
      {...props}
    >
      <circle cx="4" cy="12" r="3" fill="currentColor">
        <animate
          id="a"
          begin="0;c.end-0.25s"
          attributeName="r"
          from="3"
          to="3"
          values="3;0;3"
          dur="1s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="12" cy="12" r="3" fill="currentColor">
        <animate
          id="b"
          begin="a.end-0.75s"
          attributeName="r"
          from="3"
          to="3"
          values="3;0;3"
          dur="1s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="20" cy="12" r="3" fill="currentColor">
        <animate
          id="c"
          begin="b.end-0.5s"
          attributeName="r"
          from="3"
          to="3"
          values="3;0;3"
          dur="1s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}
