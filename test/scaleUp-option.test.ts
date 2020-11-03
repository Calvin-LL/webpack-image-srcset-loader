import webpack from "webpack";

import compile from "./helpers/compile";
import execute from "./helpers/execute";
import getCompiler from "./helpers/getCompiler";
import readAsset from "./helpers/readAsset";

describe.each([4, 5] as const)('v%d "scaleUp" option', (webpackVersion) => {
  test("should not skip original size", async () => {
    const compiler = getCompiler(webpackVersion, {
      sizes: ["2912w"],
    });
    const stats = await compile(webpackVersion, compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });

  test("should skip greater size", async () => {
    const compiler = getCompiler(webpackVersion, {
      sizes: ["2913w", "1x"],
    });
    const stats = await compile(webpackVersion, compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });

  test("should work with true", async () => {
    const compiler = getCompiler(webpackVersion, {
      sizes: ["2913w"],
      scaleUp: true,
    });
    const stats = await compile(webpackVersion, compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });
});
