// RUTA: jest.config.mjs
/**
 * @file jest.config.mjs
 * @description Configuración de Jest para pruebas unitarias e integración.
 *              v7.1.0 (ESM Compatibility): Se añade transformIgnorePatterns para
 *              instruir a Jest que compile los paquetes ESM necesarios desde node_modules.
 * @version 7.1.0
 * @author L.I.A. Legacy
 */
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const config = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleDirectories: ["node_modules", "<rootDir>/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.next/",
    "<rootDir>/tests/e2e/",
  ],
  transform: {
    "^.+\\.(ts|tsx|js|jsx|mjs)$": ["@swc/jest"],
  },
  // --- [INICIO DE REFACTORIZACIÓN DE INTEGRIDAD DE BUILD v7.1.0] ---
  // Se instruye a Jest para que NO ignore estos paquetes ESM durante la transpilación.
  transformIgnorePatterns: ["/node_modules/(?!chalk|lucide-react)/"],
  // --- [FIN DE REFACTORIZACIÓN DE INTEGRIDAD DE BUILD v7.1.0] ---
};

export default createJestConfig(config);
