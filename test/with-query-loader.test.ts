import webpack from "webpack";

import compile from "./helpers/compile";
import execute from "./helpers/execute";
import getCompiler from "./helpers/getCompiler";
import readAsset from "./helpers/readAsset";

test.each([4, 5] as const)(
  "use with webpack-query-loader",
  async (webpackVersion) => {
    const compiler = getCompiler(
      webpackVersion,
      {
        sizes: ["1x", "300w", null, "2x"],
      },
      true
    );
    const stats = await compile(webpackVersion, compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  }
);
