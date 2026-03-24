import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Points to the Next.js app root so next/jest can load next.config.ts and .env
  dir: "./",
});

const customConfig: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: [
    "**/__tests__/**/*.test.ts",
    "**/__tests__/**/*.test.tsx",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
};

export default createJestConfig(customConfig);
