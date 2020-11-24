import WISLWebpackTestCompiler from "./helpers/WISLWebpackTestCompiler";

describe.each([4, 5] as const)('v%d "scaleUp" option', (webpackVersion) => {
  test("should not skip original size", async () => {
    const compiler = new WISLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        sizes: ["2912w"],
      },
    });

    expect(bundle.execute("main.js")).toMatchSnapshot("result");
  });

  test("should skip greater size", async () => {
    const compiler = new WISLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        sizes: ["2913w", "1x"],
      },
    });

    expect(bundle.execute("main.js")).toMatchSnapshot("result");
  });

  test("should work with true", async () => {
    const compiler = new WISLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        sizes: ["2913w"],
        scaleUp: true,
      },
    });

    expect(bundle.execute("main.js")).toMatchSnapshot("result");
  });
});
