// RUTA: src/components/razBits/Dock/Dock.tsx
/**
 * @file Dock.tsx
 * @description Componente de UI interactivo tipo "dock" con efectos de magnificación.
 *              v3.0.0 (Holistic Elite Leveling): Restaurada la integridad de importación
 *              de schemas, reforzada la seguridad de tipos en `cloneElement` y
 *              alineado con los 7 Pilares de Calidad.
 * @version 3.0.0
 * @author RaZ Podestá - MetaShark Tech
 * @see .docs-espejo/components/razBits/Dock/Dock.tsx.md
 */
"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
  type SpringOptions,
} from "framer-motion";
import React, {
  Children,
  cloneElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";
import type { z } from "zod";

import { logger } from "@/shared/lib/logging";

import { DockConfigSchema } from "./dock.schema";

// --- SSoT de Contratos de Datos y Props ---

export interface DockItemData {
  icon: React.ReactNode;
  label: React.ReactNode;
  onClick: () => void;
  className?: string;
}

export interface DockProps {
  items: DockItemData[];
  className?: string;
  config?: z.infer<typeof DockConfigSchema>;
  spring?: SpringOptions;
}

interface DockItemInternalProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  mouseX: MotionValue<number>;
  spring: SpringOptions;
  distance: number;
  baseItemSize: number;
  magnification: number;
}

interface CommonDockChildProps {
  isHovered?: MotionValue<number>;
}

interface DockLabelProps extends CommonDockChildProps {
  className?: string;
  children: React.ReactNode;
}

interface DockIconProps extends CommonDockChildProps {
  className?: string;
  children: React.ReactNode;
}

// --- Subcomponentes de Presentación Puros ---

function DockLabel({
  children,
  className = "",
  isHovered,
}: DockLabelProps): React.ReactElement {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    const unsubscribe = isHovered.on("change", (latest) =>
      setIsVisible(latest === 1)
    );
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={twMerge(
            `absolute -top-6 left-1/2 -translate-x-1/2 whitespace-pre rounded-md border border-muted bg-background px-2 py-0.5 text-xs text-foreground`,
            className
          )}
          role="tooltip"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DockIcon({
  children,
  className = "",
}: DockIconProps): React.ReactElement {
  return (
    <div className={twMerge(`flex items-center justify-center`, className)}>
      {children}
    </div>
  );
}

function DockItem({
  children,
  className = "",
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
}: DockItemInternalProps): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize,
    };
    return val - rect.x - baseItemSize / 2;
  });

  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize]
  );
  const size = useSpring(targetSize, spring);

  return (
    <motion.div
      ref={ref}
      style={{ width: size, height: size }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className={twMerge(
        `relative inline-flex items-center justify-center rounded-full bg-secondary border border-muted shadow-md`,
        className
      )}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
    >
      {Children.map(children, (child) =>
        cloneElement(child as React.ReactElement<CommonDockChildProps>, {
          isHovered,
        })
      )}
    </motion.div>
  );
}

// --- Componente Principal Orquestador ---

export function Dock({
  items,
  className = "",
  config,
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
}: DockProps): React.ReactElement {
  logger.info("[Dock] Renderizando componente naturalizado v3.0.");

  const validatedConfig = DockConfigSchema.parse(config || {});
  const { magnification, distance, panelHeight, dockHeight, baseItemSize } =
    validatedConfig;

  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const maxHeight = useMemo(
    () => Math.max(dockHeight, magnification + magnification / 2 + 4),
    [magnification, dockHeight]
  );
  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  return (
    <motion.div
      style={{ height, scrollbarWidth: "none" }}
      className="mx-2 flex max-w-full items-center"
    >
      <motion.div
        onMouseMove={({ pageX }) => {
          isHovered.set(1);
          mouseX.set(pageX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        className={twMerge(
          `absolute bottom-2 left-1/2 -translate-x-1/2 flex items-end w-fit gap-4 rounded-2xl border border-muted pb-2 px-4 bg-background/50 backdrop-blur-sm`,
          className
        )}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Application dock"
      >
        {items.map((item, index) => (
          <DockItem
            key={index}
            onClick={item.onClick}
            className={item.className}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
          >
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel>{item.label}</DockLabel>
          </DockItem>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default Dock;
// RUTA: src/components/razBits/Dock/Dock.tsx
