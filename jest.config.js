module.exports = {
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/test/tsconfig.json",
    },
  },
  testMatch: ["<rootDir>/test/**/*.test.ts"],
  testEnvironment: "node",
  snapshotSerializers: ["<rootDir>/test/snapshotSerializers.js"],
  collectCoverage: true,
  coveragePathIgnorePatterns: ["<rootDir>/test/", "<rootDir>/node_modules/"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
