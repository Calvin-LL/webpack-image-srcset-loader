import path from "path";

import {
  WebpackTestBundle,
  WebpackTestCompiler,
} from "@calvin-l/webpack-loader-test-util";

interface WISLCompileOptions
  extends Omit<WebpackTestCompiler.CompileOptions, "entryFilePath"> {
  entryFileName?: string;
  loaderOptions?: any;
  resizeLoaderOptions?: any;
}

export default class WISLWebpackTestCompiler extends WebpackTestCompiler.default {
  compile(
    options: WISLCompileOptions = {}
  ): Promise<WebpackTestBundle.default> {
    const {
      loaderOptions = {},
      resizeLoaderOptions,
      entryFileName = "index.js",
    } = options;
    const fixturesDir = path.resolve(__dirname, "../fixtures");

    this.webpackConfig = {
      context: fixturesDir,
      outputPath: path.resolve(__dirname, "../outputs"),
      rules: [
        {
          test: /\.(png|jpg|svg)$/i,
          use: [
            {
              loader: path.resolve(__dirname, "../../../test-dist/cjs.js"),
              options: loaderOptions,
            },
            "file-loader",
            {
              loader: "webpack-image-resize-loader",
              options: resizeLoaderOptions,
            },
          ],
        },
      ],
    };

    return super.compile({
      ...options,
      entryFilePath: path.resolve(fixturesDir, entryFileName),
    });
  }
}
