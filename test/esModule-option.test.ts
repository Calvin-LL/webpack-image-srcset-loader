import WISLWebpackTestCompiler from "./helpers/WISLWebpackTestCompiler";

describe.each([4, 5] as const)('v%d "esModule" option', (webpackVersion) => {
  test("should work with default true", async () => {
    const compiler = new WISLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        sizes: [],
      },
      fileContentOverride:
        '__export__ = require("./Macaca_nigra_self-portrait_large.jpg");',
    });

    expect(bundle.execute("main.js")).toMatchSnapshot("result");
  });

  test("should work with true", async () => {
    const compiler = new WISLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        sizes: [],
        esModule: true,
      },
      fileContentOverride:
        '__export__ = require("./Macaca_nigra_self-portrait_large.jpg");',
    });

    expect(bundle.execute("main.js")).toMatchSnapshot("result");
  });

  test("should work with false", async () => {
    const compiler = new WISLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        sizes: [],
        esModule: false,
      },
      fileContentOverride:
        '__export__ = require("./Macaca_nigra_self-portrait_large.jpg");',
    });

    expect(bundle.execute("main.js")).toMatchSnapshot("result");
  });
});
