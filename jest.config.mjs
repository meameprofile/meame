// RUTA: jest.config.mjs
/**
 * @file jest.config.mjs
 * @description Configuración de Jest para pruebas unitarias e integración.
 *              v7.0.0 (Build Integrity Restoration): Se elimina la propiedad
 *              'globalSetup' que apuntaba a un archivo inexistente, resolviendo
 *              un error de validación crítico que bloqueaba el pipeline de pruebas.
 * @version 7.0.0
 * @author L.I.A. Legacy
 */
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const config = {
  // --- [INICIO DE REFACTORIZACIÓN DE INTEGRIDAD DE BUILD v7.0.0] ---
  // Se elimina la propiedad 'globalSetup' que apuntaba a un archivo inexistente
  // y causaba el fallo de validación de Jest. La lógica de setup ya está
  // correctamente manejada por 'setupFilesAfterEnv'.
  // globalSetup: "<rootDir>/tests/jest.global-setup.ts",
  // --- [FIN DE REFACTORIZACIÓN DE INTEGRIDAD DE BUILD v7.0.0] ---
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleDirectories: ["node_modules", "<rootDir>/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@app/(.*)$": "<rootDir>/src/app/$1",
    "^@components/(.*)$": "<rootDir>/src/components/$1",
    "^@content/(.*)$": "<rootDir>/content/$1",
    "^@messages/(.*)$": "<rootDir>/src/messages/$1",
    "^@prompts/(.*)$": "<rootDir>/prompts/$1",
    "^@scripts/(.*)$": "<rootDir>/scripts/$1",
    "^@shared/(.*)$": "<rootDir>/src/shared/$1",
    "^@store/(.*)$": "<rootDir>/src/store/$1",
    "^@types/(.*)$": "<rootDir>/src/types/$1",
  },
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.next/",
    "<rootDir>/tests/e2e/",
  ],
  transform: {
    "^.+\\.(ts|tsx|js|jsx|mjs)$": ["@swc/jest"],
  },
  transformIgnorePatterns: ["/node_modules/(?!chalk)/"],
};

export default createJestConfig(config);
