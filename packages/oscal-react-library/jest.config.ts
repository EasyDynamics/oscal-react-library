import type { Config } from "jest";

const config: Config = {
  roots: ["src"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  transform: {
    "^.+\\.[tj]sx?$": "ts-jest",
  },
  testMatch: ["**/*.test.(ts|tsx|js|jsx)"],
  testEnvironment: "jsdom",
};

export default config;
