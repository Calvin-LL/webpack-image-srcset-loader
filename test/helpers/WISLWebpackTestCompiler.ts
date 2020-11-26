import path from "path";

import {
  CompileOptions,
  WebpackTestBundle,
  WebpackTestCompiler,
} from "@calvin-l/webpack-loader-test-util";

interface WISLCompileOptions extends Omit<CompileOptions, "entryFilePath"> {
  entryFileName?: string;
  loaderOptions?: any;
  useQueryLoader?: boolean;
}

export default class WISLWebpackTestCompiler extends WebpackTestCompiler {
  compile(options: WISLCompileOptions = {}): Promise<WebpackTestBundle> {
    const {
      loaderOptions = {},
      entryFileName = "index.js",
      useQueryLoader = false,
    } = options;
    const fixturesDir = path.resolve(__dirname, "..", "fixtures");

    this.webpackConfig = {
      context: fixturesDir,
      outputPath: path.resolve(__dirname, "..", "outputs"),
      rules: [
        useQueryLoader
          ? {
              test: /\.(png|jpg|svg)/i,
              use: [
                {
                  loader: "webpack-query-loader",
                  options: {
                    resourceQuery: "!no-srcset",
                    use: {
                      loader: path.resolve(
                        __dirname,
                        "..",
                        "..",
                        "test-dist",
                        "cjs.js"
                      ),
                      options: loaderOptions,
                    },
                  },
                },
                {
                  loader: "webpack-query-loader",
                  options: {
                    resourceQuery: "!no-srcset",
                    use: "webpack-image-resize-loader",
                  },
                },
              ],
            }
          : {
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
