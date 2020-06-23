import path from "path";

import { Volume, createFsFromVolume } from "memfs";
import webpack from "webpack";

export default (loaderOptions?: any, useQueryLoader = false) => {
  const fixturesDir = path.resolve(__dirname, "..", "fixtures");
  const fullConfig = {
    mode: "production",
    devtool: false,
    context: fixturesDir,
    entry: path.resolve(fixturesDir, "simple.js"),
    output: {
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

  const compiler = webpack(fullConfig as webpack.Configuration);

  const outputFileSystem = createFsFromVolume(new Volume());
  // Todo remove when we drop webpack@4 support
  // @ts-ignore
  outputFileSystem.join = path.join.bind(path);

  // @ts-ignore
  compiler.outputFileSystem = outputFileSystem;

  return compiler;
};
