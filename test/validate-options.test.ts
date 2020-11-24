import webpack from "webpack";

import WISLWebpackTestCompiler from "./helpers/WISLWebpackTestCompiler";

describe.each([4, 5] as const)("v%d validate options", (webpackVersion) => {
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
  ): void {
    test(`should ${
      type === "success" ? "successfully validate" : "throw an error on"
    } the "${key}" option with ${JSON.stringify(value)} value`, async () => {
      const compiler = new WISLWebpackTestCompiler({ webpackVersion });

      let stats;

      try {
        stats = (
          await compiler.compile({
            loaderOptions: {
              sizes: [null],
              [key]: value,
            },
            throwOnError: false,
          })
        ).stats;
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
