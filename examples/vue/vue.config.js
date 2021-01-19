const defaultFileLoaderOptionsGenerator = require("webpack-image-resize-loader/dist/index")
  .defaultFileLoaderOptionsGenerator;

module.exports = {
  publicPath: ".",
  chainWebpack: (config) => {
    config.module
      .rule("images-srcset")
      .before("images")
      .test(/\.(png|jpe?g|webp|tiff?)$/i)
      // if the import url looks like "some.png?srcset..."
      .oneOf("srcset")
      .resourceQuery(/srcset/)
      .use("srcset")
      .loader("webpack-image-srcset-loader")
      .options({
        sizes: ["480w", "1024w", "1920w", "2560w", "original"],
        esModule: false,
      });

    config.module
      .rule("images-resize")
      .after("images")
      .test(/\.(png|jpe?g|webp|tiff?)$/i)
      // if the import url looks like "some.png?srcset..."
      .oneOf("srcset")
      .resourceQuery(/srcset/)
      .use("resize")
      .loader("webpack-image-resize-loader")
      .options({
        fileLoader: "url-loader",
        fileLoaderOptionsGenerator: (options, existingOptions) => ({
          ...existingOptions,
          fallback: {
            ...existingOptions.fallback,
            options: {
              ...defaultFileLoaderOptionsGenerator(
                options,
                existingOptions.fallback.options
              ),
            },
          },
        }),
      });
  },
};
