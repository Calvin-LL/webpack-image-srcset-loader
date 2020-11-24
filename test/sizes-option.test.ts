import WISLWebpackTestCompiler from "./helpers/WISLWebpackTestCompiler";

describe.each([4, 5] as const)('v%d "sizes" option', (webpackVersion) => {
  it("should work with empty array", async () => {
    const compiler = new WISLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        sizes: [],
      },
    });

    expect(bundle.execute("main.js")).toMatchSnapshot("result");
  });

  it("should work with [null]", async () => {
    const compiler = new WISLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        sizes: [null],
      },
    });

    expect(bundle.execute("main.js")).toMatchSnapshot("result");
  });

  it('should work with ["300w"]', async () => {
    const compiler = new WISLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        sizes: ["300w"],
      },
    });

    expect(bundle.execute("main.js")).toMatchSnapshot("result");
  });

  it('should work with ["2x"]', async () => {
    const compiler = new WISLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        sizes: ["2x"],
      },
    });

    expect(bundle.execute("main.js")).toMatchSnapshot("result");
  });

  it('should work with ["1x", "2x"]', async () => {
    const compiler = new WISLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        sizes: ["1x", "2x"],
      },
    });

    expect(bundle.execute("main.js")).toMatchSnapshot("result");
  });

  it('should work with ["1x", "300w", null, "2x"]', async () => {
    const compiler = new WISLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        sizes: ["1x", "300w", null, "2x"],
      },
    });

    expect(bundle.execute("main.js")).toMatchSnapshot("result");
  });
});
