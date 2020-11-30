import path from "path";

import {
  CompileOptions,
  WebpackTestBundle,
  WebpackTestCompiler,
} from "@calvin-l/webpack-loader-test-util";

interface WISLCompileOptions extends Omit<CompileOptions, "entryFilePath"> {
  entryFileName?: string;
  loaderOptions?: any;
}

export default class WISLWebpackTestCompiler extends WebpackTestCompiler {
  compile(options: WISLCompileOptions = {}): Promise<WebpackTestBundle> {
    const { loaderOptions = {}, entryFileName = "index.js" } = options;
    const fixturesDir = path.resolve(__dirname, "..", "fixtures");

    this.webpackConfig = {
      context: fixturesDir,
      outputPath: path.resolve(__dirname, "..", "outputs"),
      rules: [
        {
          test: /\.(png|jpg|svg)/i,
          use: [
            {
              loader: path.resolve(
                __dirname,
                "..",
                "..",
                "test-dist",
                "cjs.js"
              ),
              options: loaderOptions,
            },
            {
              loader: "webpack-image-resize-loader",
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
