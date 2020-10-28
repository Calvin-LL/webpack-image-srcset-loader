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
};
