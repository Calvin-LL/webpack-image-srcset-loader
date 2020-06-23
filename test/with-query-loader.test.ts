import webpack from "webpack";

import compile from "./helpers/compile";
import execute from "./helpers/execute";
import getCompiler from "./helpers/getCompiler";
import readAsset from "./helpers/readAsset";

test("use with webpack-query-loader", async () => {
  const compiler = getCompiler(
    {
      sizes: ["1x", "300w", null, "2x"],
    },
    true
  );
  const stats = await compile(compiler);

  expect(
    execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
  ).toMatchSnapshot("result");
});
