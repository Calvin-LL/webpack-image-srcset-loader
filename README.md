# webpack-image-srcset-loader

[![npm](https://img.shields.io/npm/v/webpack-image-srcset-loader?style=flat)](https://www.npmjs.com/package/webpack-image-srcset-loader) [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat)](https://opensource.org/licenses/MIT)

This loader generates a srcset string from an image.

## Examples

[React](https://github.com/Calvin-LL/webpack-image-srcset-loader/tree/master/examples/react)

[Vue](https://github.com/Calvin-LL/webpack-image-srcset-loader/tree/master/examples/vue)

[React example with other related loaders](https://github.com/Calvin-LL/react-responsive-images-example)

[Vue example with other related loaders](https://github.com/Calvin-LL/vue-responsive-images-example)

## Install

Install with npm:

```bash
npm install --save-dev webpack-image-srcset-loader webpack-image-resize-loader
```

Install with yarn:

```bash
yarn add --dev webpack-image-srcset-loader webpack-image-resize-loader
```

## Usage

```javascript
import jpgSrcSet from "./some_pic.jpg?srcset";

// jpgSrcSet will be "97[...]7.jpg 500w, ed[...]3.jpg 1000w, c6[...]b.jpg 1500w, 57[...]e.jpg"
```

#### webpack.config.js

```javascript
module.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        test: /\.(png|jpe?g|svg|gif|webp|tiff?)$/i,
        oneOf: [
          {
            // if the import url looks like "some.png?srcset..."
            resourceQuery: /srcset/,
            use: [
              {
                loader: "webpack-image-srcset-loader",
                options: {
                  sizes: ["500w", "1000w", "1500w", null],
                },
              },
              "webpack-image-resize-loader",
            ],
          },
          {
            // if no previous resourceQuery match
            use: "file-loader",
          },
        ],
      },
    ],
  },
};
```

## Options

#### Note:

Additional options such as `quality` here will be passed down to [webpack-image-resize-loader](https://github.com/Calvin-LL/webpack-image-resize-loader). See [webpack-image-resize-loader's options](https://github.com/Calvin-LL/webpack-image-resize-loader#options).

For example:

```javascript
import webpSrcSet from "./some_pic.jpg?srcset&format=webp";

// webpSrcSet will be "00[...]5.webp 500w, 40[...]3.webp 1000w, 76[...]b.webp 1500w, b1[...]c.webp"
```

| Name                                                | Type               | Default   | Description                                                                                  |
| --------------------------------------------------- | ------------------ | --------- | -------------------------------------------------------------------------------------------- |
| **[`sizes`](#sizes)**                               | `(string\|null)[]` | undefined | Sizes in the output srcset.                                                                  |
| **[`scaleUp`](#scaleup)**                           | `boolean`          | `false`   | Whether or not to scale up the image when the desired width is greater than the image width. |
| **[`customOptionsFactory`](#customoptionsfactory)** | `function`         | undefined | A function that returns the option to be passed on to the next loader.                       |
| **[`esModule`](#esmodule)**                         | `boolean`          | `true`    | Whether the export is in ES modules syntax or CommonJS modules syntax                        |

### `sizes`

An array containing strings in the format `"[number]w"`, `"[number]x"`, or `null`. The numbers cannot contain decimals.

Allowed: `["10w", "1x", "2x", null]`

Not allowed: `["10.0w", "1.5x", "2.0x"]`

When using `"[number]x"`, the original size of the image will be used for the greatest value. For example, if an image is `10×10` in size, and `sizes` is `["1x", "2x"]`, the output image will have sizes `5×5` for `"1x"` and `10×10` for `"2x"`.

### `scaleUp`

When true, if the desired width is greater than the image width, the size will not be included in the output srcset string. For example, if the original image is `10×10` in size, and the `sizes` array is `["5w", "10w", "15w"]`, when `scaleUp` is `true` the output string is `"image1.jpg 5w, image2.jpg 10w, image3.jpg 15w"`, when `scaleUp` is `false` the output string is `"image1.jpg 5w, image2.jpg 10w"`.

Note: this option has no effect on `"[number]x"` or `null`

### `customOptionsFactory`

If you wish to use a resize loader other than [webpack-image-resize-loader](https://github.com/Calvin-LL/webpack-image-resize-loader). You may customize how the width and scale is passed down to that loader`s options.

```
// width is either a number or undefined
// scale is either a number or undefined
// existingOptions is either the existing options for the next loader or undefined
(width, scale, existingOptions: object) => {
  ...
  return { ...existingOptions };
}
```

For example, if `sizes` is `["10w", "1x", "2x", null]`, `customOptionsFactory` will be called with

- `customOptionsFactory(10, undefined, existingOptions)` for `10w`
- `customOptionsFactory(undefined, 1, existingOptions)` for `1x`
- `customOptionsFactory(undefined, 2, existingOptions)` for `2x`
- `customOptionsFactory(undefined, undefined, existingOptions)` for `null`

### `esModule`

Whether the export is in ES modules syntax or CommonJS modules syntax. If you don't know what it is or whether or not you need it, leave is as default.
