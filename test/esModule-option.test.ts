import webpack from "webpack";

import compile from "./helpers/compile";
import execute from "./helpers/execute";
import getCompiler from "./helpers/getCompiler";
import readAsset from "./helpers/readAsset";

describe.each([4, 5] as const)('v%d "esModule" option', (webpackVersion) => {
  test("should work with default true", async () => {
    const compiler = getCompiler(
      webpackVersion,
      {
        sizes: [],
      },
      false,
      "simple-require.js"
    );
    const stats = await compile(webpackVersion, compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });

  test("should work with true", async () => {
    const compiler = getCompiler(
      webpackVersion,
      {
        sizes: [],
        esModule: true,
      },
      false,
      "simple-require.js"
    );
    const stats = await compile(webpackVersion, compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });

  test("should work with false", async () => {
    const compiler = getCompiler(
      webpackVersion,
      {
        sizes: [],
        esModule: false,
      },
      false,
      "simple-require.js"
    );
    const stats = await compile(webpackVersion, compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });
});
