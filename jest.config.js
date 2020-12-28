module.exports = {
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/test/tsconfig.json",
    },
  },
  testMatch: ["<rootDir>/test/**/*.test.ts"],
  testEnvironment: "node",
  testTimeout: 600000,
  snapshotSerializers: ["<rootDir>/test/snapshotSerializers.js"],
  collectCoverage: true,
  coveragePathIgnorePatterns: ["<rootDir>/test/", "<rootDir>/node_modules/"],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
