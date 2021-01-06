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
  useQueryLoader?: boolean;
}

export default class WISLWebpackTestCompiler extends WebpackTestCompiler.default {
  compile(
    options: WISLCompileOptions = {}
  ): Promise<WebpackTestBundle.default> {
    const {
      loaderOptions = {},
      resizeLoaderOptions,
      entryFileName = "index.js",
      useQueryLoader = false,
    } = options;
    const fixturesDir = path.resolve(__dirname, "../fixtures");

    this.webpackConfig = {
      context: fixturesDir,
      outputPath: path.resolve(__dirname, "../outputs"),
      rules: [
        useQueryLoader
          ? {
              test: /\.(png|jpg|svg)$/i,
              use: [
                {
                  loader: "webpack-query-loader",
                  options: {
                    resourceQuery: "!no-srcset",
                    use: {
                      loader: path.resolve(
                        __dirname,
                        "../../../test-dist/cjs.js"
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
              test: /\.(png|jpg|svg)$/i,
              use: [
                {
                  loader: path.resolve(__dirname, "../../../test-dist/cjs.js"),
                  options: loaderOptions,
                },
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