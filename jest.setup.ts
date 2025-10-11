// RUTA: jest.setup.ts
/**
 * @file jest.setup.ts
 * @description Configuración global para Jest.
 * @version 3.0.0
 */
import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder as unknown as typeof global.TextEncoder;
global.TextDecoder = TextDecoder as unknown as typeof global.TextDecoder;

if (!global.TextEncoder || !global.TextDecoder) {
  throw new Error("Polyfills for TextEncoder/TextDecoder failed to load.");
}

import "@testing-library/jest-dom";
