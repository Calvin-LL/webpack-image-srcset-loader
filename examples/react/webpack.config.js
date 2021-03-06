const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "./src/index.js"),
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "main.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.(png|jpe?g|webp|tiff?)$/i,
        oneOf: [
          {
            // if the import url looks like "some.png?srcset..."
            resourceQuery: /srcset/,
            use: [
              {
                loader: "webpack-image-srcset-loader",
                options: {
                  sizes: ["480w", "1024w", "1920w", "2560w", "original"],
                },
              },
              "file-loader",
              "webpack-image-resize-loader",
            ],
          },
          {
            // if no previous resourceQuery match
            use: "file-loader",
          },
        ],
      },
      /*
      // if you also want to use file-loader for other types of files
      {
        test: /\.(png|jpe?g|webp|tiff?)$/i,
        resourceQuery: /srcset/,
        use: [
          {
            loader: "webpack-image-srcset-loader",
            options: {
              sizes: ["480w", "1024w", "1920w", "2560w", "original"],
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|svg|gif|webp|tiff?)$/i,
        use: "file-loader",
      },
      {
        test: /\.(png|jpe?g|webp|tiff?)$/i,
        resourceQuery: /srcset/,
        use: "webpack-image-resize-loader",
      },
      */
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./public/index.html"),
    }),
  ],
};
