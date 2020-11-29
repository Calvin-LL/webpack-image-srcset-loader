module.exports = {
  publicPath: ".",
  chainWebpack: (config) => {
    config.module
      .rule("images")
      .test(/\.(png|jpe?g|gif|webp|tiff?)$/i)
      // if the import url looks like "some.png?srcset..."
      .oneOf("srcset")
      .resourceQuery(/srcset/)
      .use("srcset")
      .loader("webpack-image-srcset-loader")
      .options({
        sizes: ["500w", "1000w", "1500w", null],
        esModule: false,
      })
      .end()
      .use("resize")
      .loader("webpack-image-resize-loader")
      .end()
      .end()
      // if no previous resourceQuery match
      .oneOf("normal")
      .use("normal")
      .loader(config.module.rule("images").use("url-loader").get("loader"))
      .options(config.module.rule("images").use("url-loader").get("options"));

    config.module.rule("images").uses.delete("url-loader");
  },
};
