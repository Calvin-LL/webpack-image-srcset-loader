import webpack from "webpack";

import compile from "./helpers/compile";
import getCompiler from "./helpers/getCompiler";

describe("validate options", () => {
  const tests = {
    sizes: {
      success: [["10w", "1x", "2x", null]],
      failure: [["10.0w"], ["10h"], ["0.5x"], ["0.5"], ["10"], [3]],
    },
    scaleUp: {
      success: [true, false],
      failure: ["true"],
    },
    customOptionsFactory: {
      success: [() => ({})],
      failure: [true],
    },
    esModule: {
      success: [true, false],
      failure: ["true"],
    },
  };

  function createTestCase(
    key: string,
    value: any,
    type: "success" | "failure"
  ) {
    test(`should ${
      type === "success" ? "successfully validate" : "throw an error on"
    } the "${key}" option with ${JSON.stringify(value)} value`, async () => {
      const compiler = getCompiler({ sizes: [null], [key]: value });

      let stats;

      try {
        stats = await compile(compiler);
      } finally {
        if (type === "success") {
          expect((stats as webpack.Stats).hasErrors()).toBe(false);
        } else if (type === "failure") {
          const errors = (stats as webpack.Stats).compilation.errors;

          expect(errors).toHaveLength(1);
          expect(() => {
            throw new Error(errors[0].error.message);
          }).toThrowErrorMatchingSnapshot();
        }
      }
    }, 60000);
  }

  for (const [key, values] of Object.entries(tests)) {
    for (const type of Object.keys(values) as ("success" | "failure")[]) {
      for (const value of values[type]) {
        createTestCase(key, value, type);
      }
    }
  }
});
