/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // preset: "ts-jest/presets/js-with-ts",
  testEnvironment: "jsdom",
  preset: "ts-jest",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
