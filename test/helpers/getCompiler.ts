import path from "path";

import { Volume, createFsFromVolume } from "memfs";
import webpack from "webpack";
import webpack5 from "webpack5";

export default (
  webpackVersion: 4 | 5,
  loaderOptions?: any,
  useQueryLoader = false,
  fileName = "simple.js"
) => {
  const fixturesDir = path.resolve(__dirname, "..", "fixtures");
  const fullConfig = {
    mode: "production",
    devtool: false,
    context: fixturesDir,
    entry: path.resolve(fixturesDir, fileName),
    output: {
      publicPath: "",
      path: path.resolve(__dirname, "..", "/outputs"),
      filename: "[name].bundle.js",
      chunkFilename: "[name].chunk.js",
    },
    module: {
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
                        "dist",
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
                  loader: path.resolve(__dirname, "..", "..", "dist", "cjs.js"),
                  options: loaderOptions,
                },
                {
                  loader: "webpack-image-resize-loader",
                },
              ],
            },
      ],
    },
  };

  const wp = (webpackVersion === 5 ? webpack5 : webpack) as typeof webpack;
  const compiler = wp(fullConfig as webpack.Configuration);

  const outputFileSystem = createFsFromVolume(new Volume());
  // Todo remove when we drop webpack@4 support
  // @ts-expect-error
  outputFileSystem.join = path.join.bind(path);

  // @ts-expect-error
  compiler.outputFileSystem = outputFileSystem;

  return compiler;
};
