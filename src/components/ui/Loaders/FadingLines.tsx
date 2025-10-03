// components/ui/Loaders/FadingLines.tsx
/**
 * @file FadingLines.tsx
 * @description Loader SVG animado con efecto de líneas que se desvanecen.
 * @version 1.1.0 (Code Hygiene)
 * @author RaZ Podestá - MetaShark Tech
 */
import React from "react";
import { cn } from "@/shared/lib/utils/cn";

export function FadingLines({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  const lines = Array.from({ length: 12 });
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-primary", className)}
      {...props}
    >
      <g>
        {lines.map((_, i) => (
          <rect
            key={i}
            x="11"
            y="1"
            width="2"
            height="6"
            rx="1"
            fill="currentColor"
            opacity="0"
            transform={`rotate(${i * 30} 12 12)`}
          >
            <animate
              attributeName="opacity"
              from="1"
              to="0"
              dur="1s"
              begin={`${(i * 1) / 12}s`}
              repeatCount="indefinite"
            />
          </rect>
        ))}
      </g>
    </svg>
  );
}
