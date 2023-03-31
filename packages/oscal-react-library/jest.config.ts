import type { Config } from "jest";

const config: Config = {
  roots: ["src"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  transform: {
    "^.+\\.[tj]sx?$": "ts-jest",
    "^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)": "<rootDir>/tests/fileTransform.js",
  },
  testMatch: ["**/*.test.(ts|tsx|js|jsx)"],
  testEnvironment: "jsdom",
  transformIgnorePatterns: [
    "(?!(/node_modules/(react-markdown|vfile|vfile-message|unist-.*|unified|bail|is-plain-obj|trough|remark-.*|mdast-util-.*|micromark.*|decode-named-character-reference|character-entities|property-information|hast-util-whitespace|space-separated-tokens|comma-separated-tokens|pretty-bytes|trim-lines)/))(/node_modules/.+.(js|jsx|mjs|cjs|ts|tsx)$)",
    "^.+.module.(css|sass|scss)$",
  ],
  setupFilesAfterEnv: ["<rootDir>/tests/setupTests.js"],
};

export default config;
