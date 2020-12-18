import WISLWebpackTestCompiler from "./helpers/WISLWebpackTestCompiler";

test.each([4, 5] as const)(
  "use with webpack-query-loader",
  async (webpackVersion) => {
    const compiler = new WISLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        sizes: ["1x", "300w", "original", "2x"],
      },
      useQueryLoader: true,
    });

    expect(bundle.execute("main.js")).toMatchSnapshot("result");
  }
);
