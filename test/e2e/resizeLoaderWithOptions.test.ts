import path from "path";

import WISLWebpackTestCompiler from "./helpers/WISLWebpackTestCompiler";

describe.each([4, 5] as const)(
  "v%d resize loader with options",
  (webpackVersion) => {
    it("should work with options in webpackConfig", async () => {
      const compiler = new WISLWebpackTestCompiler({ webpackVersion });
      const bundle = await compiler.compile({
        loaderOptions: {
          sizes: ["300w", "original"],
        },
        resizeLoaderOptions: {
          quality: 80,
        },
      });

      expect(bundle.execute("main.js")).toMatchSnapshot("result");
    });

    it("should work with options in query", async () => {
      const loaderPath = path.resolve(__dirname, "../../test-dist/cjs.js");
      const loaderOptions = {
        sizes: ["300w", "original"],
      };
      const loaderOptionsString = JSON.stringify(loaderOptions);
      const resizeLoaderOptions = {
        quality: 80,
      };
      const resizeLoaderOptionssString = JSON.stringify(resizeLoaderOptions);

      const compiler = new WISLWebpackTestCompiler({ webpackVersion });
      const bundle = await compiler.compile({
        fileContentOverride: `__export__ = require('-!${loaderPath}?${loaderOptionsString}!webpack-image-resize-loader?${resizeLoaderOptionssString}!./Macaca_nigra_self-portrait_large.jpg');`,
      });

      expect(bundle.execute("main.js")).toMatchSnapshot("result");
    });
  }
);
