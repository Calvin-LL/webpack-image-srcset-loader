# webpack-image-srcset-loader

[![npm](https://img.shields.io/npm/v/webpack-image-srcset-loader?style=flat)](https://www.npmjs.com/package/webpack-image-srcset-loader) [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat)](https://opensource.org/licenses/MIT)

This loader generates a srcset string from an image.

## Examples

[React](https://github.com/Calvin-LL/webpack-image-srcset-loader/tree/main/examples/react)

[Vue](https://github.com/Calvin-LL/webpack-image-srcset-loader/tree/main/examples/vue)

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

// jpgSrcSet will be "97[...]7.jpg 480w, ed[...]3.jpg 1024w, c6[...]b.jpg 1920w, b6[...]3.jpg 2560w, 57[...]e.jpg"
```

#### webpack.config.js

`webpack-image-srcset-loader` should be placed before all other loaders

Try [`webpack-sharp-loader`](https://github.com/Calvin-LL/webpack-sharp-loader) if you want to do other processing with your image before or after resizing

```javascript
module.exports = {
  // ...
  module: {
    rules: [
      // ...
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
              // add webpack-sharp-loader if you want to pre-process your image e.g. rotating, flipping
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

Additional options in the query (that thing after `?`) such as `quality` or `format` here will be passed down to [webpack-image-resize-loader](https://github.com/Calvin-LL/webpack-image-resize-loader). See [webpack-image-resize-loader's options](https://github.com/Calvin-LL/webpack-image-resize-loader#options).

For example:

```javascript
import webpSrcSet from "./some_pic.jpg?srcset&format=webp";

// webpSrcSet will be "00[...]5.webp 480w, 40[...]3.webp 1024w, 76[...]b.webp 1920w, a4[...]c.webp 2560w, b1[...]c.webp"
```

| Name                                                                | Type         | Default   | Description                                                                                  |
| ------------------------------------------------------------------- | ------------ | --------- | -------------------------------------------------------------------------------------------- |
| **[`sizes`](#sizes)**                                               | `(string)[]` | undefined | Sizes in the output srcset.                                                                  |
| **[`scaleUp`](#scaleup)**                                           | `boolean`    | `false`   | Whether or not to scale up the image when the desired width is greater than the image width. |
| **[`resizeLoaderOptionsGenerator`](#resizeloaderoptionsgenerator)** | `function`   | undefined | A function that returns the option to be passed on to the next loader.                       |
| **[`esModule`](#esmodule)**                                         | `boolean`    | `true`    | Whether the export is in ES modules syntax or CommonJS modules syntax                        |

### `sizes`

An array containing strings in the format `"[number]w"`, `"[number]x"`, or `"original"`. The numbers cannot contain decimals.

Allowed: `["10w", "1x", "2x", "original"]`

Not allowed: `["10.0w", "1.5x", "2.0x"]`

When using `"[number]x"`, the original size of the image will be used for the greatest value. For example, if an image is `10×10` in size, and `sizes` is `["1x", "2x"]`, the output image will have sizes `5×5` for `"1x"` and `10×10` for `"2x"`.

### `scaleUp`

When true, if the desired width is greater than the image width, the size will not be included in the output srcset string. For example, if the original image is `10×10` in size, and the `sizes` array is `["5w", "10w", "15w"]`, when `scaleUp` is `true` the output string is `"image1.jpg 5w, image2.jpg 10w, image3.jpg 15w"`, when `scaleUp` is `false` the output string is `"image1.jpg 5w, image2.jpg 10w"`.

Note: this option has no effect on `"[number]x"` or `"original"`

### `resizeLoaderOptionsGenerator`

##### default

```javascript
function defaultResizeLoaderOptionsGenerator(width, scale, existingOptions) {
  return {
    ...existingOptions,
    ...(existingOptions?.fileLoaderOptionsGenerator
      ? {
          fileLoaderOptionsGenerator: existingOptions.fileLoaderOptionsGenerator.toString(),
        }
      : {}),
    // since we filtered out all the width that are too wide,
    // nothing to worry about there, need this to make sure
    // scales larger than 1x works
    scaleUp: true,
    width,
    scale,
  };
}
```

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

For example, if `sizes` is `["10w", "1x", "2x", "original"]`, `resizeLoaderOptionsGenerator` will be called with

- `resizeLoaderOptionsGenerator(10, undefined, existingOptions)` for `10w`
- `resizeLoaderOptionsGenerator(undefined, 1, existingOptions)` for `1x`
- `resizeLoaderOptionsGenerator(undefined, 2, existingOptions)` for `2x`
- `resizeLoaderOptionsGenerator(undefined, undefined, existingOptions)` for `"original"`

### `esModule`

Whether the export is in ES modules syntax or CommonJS modules syntax. If you don't know what it is or whether or not you need it, leave is as default.
