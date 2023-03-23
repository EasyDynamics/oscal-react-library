/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  roots: ["src"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  transform: {
    "^.+\\.[jt]sx?$": "ts-jest",
  },
  testMatch: ["**/*.test.(ts|tsx|js|jsx)"],
  // preset: "ts-jest",
  // transform: {
  //   "^.+\\.tsx?$": "ts-jest",
  // },
};
