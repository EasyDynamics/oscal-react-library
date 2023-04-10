import type { Config } from "jest";

const config: Config = {
  roots: ["src"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  transform: {
    "^.+\\.[tj]sx?$": "ts-jest",
    // For non-code files, use the file transform. This will just return the name of the
    // file, matching the behavior for these files in `react-scripts`.
    "^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)": "<rootDir>/tests/fileTransform.js",
  },
  testMatch: ["**/*.test.(ts|tsx|js|jsx)"],
  testEnvironment: "jsdom",
  transformIgnorePatterns: [
    // Actually transform any given ESM modules, since Jest cannot support them
    "(?!(/node_modules/(react-markdown|vfile|vfile-message|unist-.*|unified|bail|is-plain-obj|trough|remark-.*|mdast-util-.*|micromark.*|decode-named-character-reference|character-entities|property-information|hast-util-whitespace|space-separated-tokens|comma-separated-tokens|pretty-bytes|trim-lines)/))(/node_modules/.+.(js|jsx|mjs|cjs|ts|tsx)$)",
  ],
  setupFilesAfterEnv: ["<rootDir>/tests/setupTests.js"],
};

export default config;
