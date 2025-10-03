// RUTA: components/razBits/LightRays/use-light-rays.ts
/**
 * @file use-light-rays.ts
 * @description Hook de React para renderizar un efecto de rayos de luz volumétricos
 *              usando WebGL (ogl).
 * @version 3.0.0 (Functional Restoration & Elite Leveling)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useRef, useEffect } from "react";
import { Renderer, Program, Triangle, Mesh } from "ogl";
import { logger } from "@/shared/lib/logging";
import type { z } from "zod";
import type {
  LightRaysConfigSchema,
  RaysOriginSchema,
} from "./light-rays.schema";

type LightRaysConfig = z.infer<typeof LightRaysConfigSchema>;
type RaysOrigin = z.infer<typeof RaysOriginSchema>;

const vertexShader = `attribute vec2 position;varying vec2 vUv;void main(){vUv=position*0.5+0.5;gl_Position=vec4(position,0.0,1.0);}`;
const fragmentShader = `precision highp float;uniform float iTime;uniform vec2 iResolution;uniform vec2 rayPos;uniform vec2 rayDir;uniform vec3 raysColor;uniform float raysSpeed;uniform float lightSpread;uniform float rayLength;uniform float pulsating;uniform float fadeDistance;uniform float saturation;uniform vec2 mousePos;uniform float mouseInfluence;uniform float noiseAmount;uniform float distortion;varying vec2 vUv;float noise(vec2 st){return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);}float rayStrength(vec2 rSource,vec2 rDir,vec2 coord,float seedA,float seedB,float speed){vec2 sourceToCoord=coord-rSource;vec2 dirNorm=normalize(sourceToCoord);float cosAngle=dot(dirNorm,rDir);float distortedAngle=cosAngle+distortion*sin(iTime*2.0+length(sourceToCoord)*0.01)*0.2;float spreadFactor=pow(max(distortedAngle,0.0),1.0/max(lightSpread,0.001));float distance=length(sourceToCoord);float maxDistance=iResolution.x*rayLength;float lengthFalloff=clamp((maxDistance-distance)/maxDistance,0.0,1.0);float fadeFalloff=clamp((iResolution.x*fadeDistance-distance)/(iResolution.x*fadeDistance),0.5,1.0);float pulse=pulsating>0.5?(0.8+0.2*sin(iTime*speed*3.0)):1.0;float baseStrength=clamp((0.45+0.15*sin(distortedAngle*seedA+iTime*speed))+(0.3+0.2*cos(-distortedAngle*seedB+iTime*speed)),0.0,1.0);return baseStrength*lengthFalloff*fadeFalloff*spreadFactor*pulse;}void main(){vec2 coord=vec2(gl_FragCoord.x,iResolution.y-gl_FragCoord.y);vec2 finalRayDir=rayDir;if(mouseInfluence>0.0){vec2 mouseScreenPos=mousePos*iResolution.xy;vec2 mouseDirection=normalize(mouseScreenPos-rayPos);finalRayDir=normalize(mix(rayDir,mouseDirection,mouseInfluence));}vec4 rays=vec4(1.0)*rayStrength(rayPos,finalRayDir,coord,36.22,21.11,1.5*raysSpeed)*0.5+vec4(1.0)*rayStrength(rayPos,finalRayDir,coord,22.39,18.02,1.1*raysSpeed)*0.4;if(noiseAmount>0.0){float n=noise(coord*0.01+iTime*0.1);rays.rgb*=(1.0-noiseAmount+noiseAmount*n);}float brightness=1.0-(coord.y/iResolution.y);rays.x*=0.1+brightness*0.8;rays.y*=0.3+brightness*0.6;rays.z*=0.5+brightness*0.5;if(saturation!=1.0){float gray=dot(rays.rgb,vec3(0.299,0.587,0.114));rays.rgb=mix(vec3(gray),rays.rgb,saturation);}gl_FragColor=vec4(rays.rgb*raysColor,rays.a);}`;

const getCssVariableHsl = (varName: string): [number, number, number] => {
  if (typeof window === "undefined") return [1, 1, 1];
  const hslStr = getComputedStyle(document.documentElement)
    .getPropertyValue(`--${varName}`)
    .trim();
  if (!hslStr) return [1, 1, 1];
  const parts = hslStr.split(" ");
  if (parts.length < 3) return [1, 1, 1];
  const [h, s, l] = parts.map(
    (val) => parseFloat(val.replace("%", "")) / (val.includes("%") ? 100 : 1)
  );
  return [h, s, l];
};

const hslToRgb = (
  h: number,
  s: number,
  l: number
): [number, number, number] => {
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [r, g, b];
};

const getAnchorAndDir = (origin: RaysOrigin, w: number, h: number) => {
  const outside = 0.2;
  switch (origin) {
    case "top-left":
      return { anchor: [0, -outside * h], dir: [0, 1] };
    case "top-right":
      return { anchor: [w, -outside * h], dir: [0, 1] };
    case "left":
      return { anchor: [-outside * w, 0.5 * h], dir: [1, 0] };
    case "right":
      return { anchor: [(1 + outside) * w, 0.5 * h], dir: [-1, 0] };
    case "bottom-left":
      return { anchor: [0, (1 + outside) * h], dir: [0, -1] };
    case "bottom-center":
      return { anchor: [0.5 * w, (1 + outside) * h], dir: [0, -1] };
    case "bottom-right":
      return { anchor: [w, (1 + outside) * h], dir: [0, -1] };
    default:
      return { anchor: [0.5 * w, -outside * h], dir: [0, 1] };
  }
};

export const useLightRays = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  config: LightRaysConfig
) => {
  const animationFrameId = useRef<number | null>(null);
  const mousePos = useRef({ x: 0.5, y: 0.5 });
  const smoothMousePos = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: Renderer | null = null;
    let mesh: Mesh | null = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let uniforms: any = null;
    let isVisible = false;

    const loop = (t: number) => {
      if (!renderer || !mesh || !uniforms || !isVisible) return;
      uniforms.iTime.value = t * 0.001;
      if (config.followMouse) {
        const smoothing = 0.92;
        smoothMousePos.current.x =
          smoothMousePos.current.x * smoothing +
          mousePos.current.x * (1 - smoothing);
        smoothMousePos.current.y =
          smoothMousePos.current.y * smoothing +
          mousePos.current.y * (1 - smoothing);
        uniforms.mousePos.value = [
          smoothMousePos.current.x,
          smoothMousePos.current.y,
        ];
      }
      try {
        renderer.render({ scene: mesh });
        animationFrameId.current = requestAnimationFrame(loop);
      } catch (e) {
        logger.warn("Error en el bucle de renderizado de WebGL.", { error: e });
      }
    };

    const updateSize = () => {
      if (!renderer || !uniforms || !container) return;
      renderer.setSize(container.clientWidth, container.clientHeight);
      const w = container.clientWidth * renderer.dpr;
      const h = container.clientHeight * renderer.dpr;
      uniforms.iResolution.value = [w, h];
      // --- INICIO DE REFACTORIZACIÓN DE RESILIENCIA ---
      const { anchor, dir } = getAnchorAndDir(
        config.raysOrigin || "top-center",
        w,
        h
      );
      // --- FIN DE REFACTORIZACIÓN DE RESILIENCIA ---
      uniforms.rayPos.value = anchor;
      uniforms.rayDir.value = dir;
    };

    const initializeWebGL = () => {
      logger.startGroup("useLightRays: WebGL Initialization");
      renderer = new Renderer({
        dpr: Math.min(window.devicePixelRatio, 2),
        alpha: true,
      });
      const gl = renderer.gl;
      gl.canvas.style.width = "100%";
      gl.canvas.style.height = "100%";
      container.appendChild(gl.canvas);

      // --- INICIO DE REFACTORIZACIÓN DE RESILIENCIA ---
      const hslColor = getCssVariableHsl(config.raysColor || "primary");
      const rgbColor = hslToRgb(hslColor[0], hslColor[1], hslColor[2]);

      uniforms = {
        iTime: { value: 0 },
        iResolution: { value: [1, 1] },
        rayPos: { value: [0, 0] },
        rayDir: { value: [0, 1] },
        raysColor: { value: rgbColor },
        raysSpeed: { value: config.raysSpeed ?? 1.5 },
        lightSpread: { value: config.lightSpread ?? 0.8 },
        rayLength: { value: config.rayLength ?? 1.2 },
        pulsating: { value: config.pulsating ? 1.0 : 0.0 },
        fadeDistance: { value: config.fadeDistance ?? 1.0 },
        saturation: { value: config.saturation ?? 1.0 },
        mousePos: { value: [0.5, 0.5] },
        mouseInfluence: { value: config.mouseInfluence ?? 0.1 },
        noiseAmount: { value: config.noiseAmount ?? 0.1 },
        distortion: { value: config.distortion ?? 0.05 },
      };
      // --- FIN DE REFACTORIZACIÓN DE RESILIENCIA ---

      const geometry = new Triangle(gl);
      const program = new Program(gl, {
        vertex: vertexShader,
        fragment: fragmentShader,
        uniforms,
      });
      mesh = new Mesh(gl, { geometry, program });

      window.addEventListener("resize", updateSize);
      updateSize();
      logger.info("WebGL inicializado correctamente.");
      logger.endGroup();

      if (isVisible) {
        animationFrameId.current = requestAnimationFrame(loop);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          if (!renderer) initializeWebGL();
          if (animationFrameId.current === null) {
            logger.trace("[useLightRays] Animación reanudada.");
            animationFrameId.current = requestAnimationFrame(loop);
          }
        } else if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
          animationFrameId.current = null;
          logger.trace("[useLightRays] Animación pausada.");
        }
      },
      { threshold: 0.01 }
    );
    observer.observe(container);

    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      mousePos.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };

    if (config.followMouse) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      logger.startGroup("useLightRays: WebGL Cleanup");
      observer.disconnect();
      window.removeEventListener("resize", updateSize);
      if (config.followMouse) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (renderer) {
        try {
          const gl = renderer.gl;
          gl.getExtension("WEBGL_lose_context")?.loseContext();
          if (container.contains(gl.canvas)) {
            container.removeChild(gl.canvas);
          }
        } catch (e) {
          logger.warn("Error durante la limpieza de WebGL.", { error: e });
        }
      }
      logger.info("Recursos de WebGL liberados.");
      logger.endGroup();
    };
  }, [containerRef, config]);
};
