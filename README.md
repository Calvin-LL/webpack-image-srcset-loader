# webpack-image-srcset-loader

[![npm](https://img.shields.io/npm/v/webpack-image-srcset-loader?style=flat)](https://www.npmjs.com/package/webpack-image-srcset-loader) [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat)](https://opensource.org/licenses/MIT)

This loader generates a srcset string from an image.

## Example

```javascript
import jpg from "./some_pic.jpg?srcset&sizes[]=500w&sizes[]=1000w&sizes[]=1500w";

console.log(jpg);
// outputs: "44aacd9d8d250c420d100a3fb0f1debe.jpg 500w, 5a35cdf3268c47471b8e96b656a23200.jpg 1000w, fdaf70a107ad3cebfaf1e03ff0601c1c.jpg 1500w"
```

## Install

Install with npm:

```bash
npm install webpack-image-srcset-loader webpack-image-resize-loader --save-dev
```

Install with yarn:

```bash
yarn add webpack-image-srcset-loader webpack-image-resize-loader --dev
```

## Usage

### Use with [webpack-query-loader](https://github.com/CoolCyberBrain/webpack-query-loader)

Use [webpack-query-loader](https://github.com/CoolCyberBrain/webpack-query-loader) if you only want some import of images to be in the srcset format

```javascript
import jpg from "./some_pic.jpg?srcset";
```

note:
You can override the `sizes` in options by

```javascript
import jpg from "./some_pic.jpg?srcset&sizes[]=1x&sizes[]=2x&sizes[]=3x";
```

Install with npm:

```bash
npm install webpack-query-loader --save-dev
```

Install with yarn:

```bash
yarn add webpack-query-loader --dev
```

#### webpack.config.js

```javascript
module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.(png|jpe?g)/i,
        use: [
          {
            loader: "webpack-query-loader",
            options: {
              resourceQuery: "srcset", // run only if the url query has "srcset"
              use: {
                loader: "webpack-image-srcset-loader",
                options: {
                  sizes: ["500w", "1000w", "1500w", null],
                },
              },
            },
          },
          {
            loader: "webpack-query-loader",
            options: {
              resourceQuery: "srcset", // run only if the url query has "srcset"
              use: "webpack-image-resize-loader",
            },
          },
          {
            loader: "webpack-query-loader",
            options: {
              resourceQuery: "!srcset",
              use: "file-loader", // use "file-loader" when the url query does not have "srcset"
            },
          },
        ],
      },
    ],
  },
};

```

### Use without [webpack-query-loader](https://github.com/CoolCyberBrain/webpack-query-loader)

All image imports will be in the srcset format

```javascript
import jpg from "./some_pic.jpg";
```

#### webpack.config.js

```javascript
module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.(png|jpe?g)/i,
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
    ],
  },
};

```

## Options

| Name                                                | Type               | Default   | Description                                                            |
| --------------------------------------------------- | ------------------ | --------- | ---------------------------------------------------------------------- |
| **[`sizes`](#sizes)**                               | `(string\|null)[]` | undefined | Sizes in the output srcset.                                            |
| **[`customOptionsFactory`](#customoptionsfactory)** | `function`         | undefined | A function that returns the option to be passed on to the next loader. |

### `sizes`

An array containing strings in the format `"[number]w"`, `"[number]x"`, or `null`. The numbers cannot contain decimals.

Allowed: `["10w", "1x", "2x", null]`

Not allowed: `["10.0w", "1.5x", "2.0x"]`

When using `"[number]x"`, the original size of the image will be used for the greatest value. For example, if an image is `10×10` in size, and `sizes` is `["1x", "2x"]`, the output image will have sizes `5×5` for `"1x"` and `10×10` for `"2x"`.

### `customOptionsFactory`

If you wish to use a resize loader other than [webpack-image-resize-loader](https://github.com/CoolCyberBrain/webpack-image-resize-loader). You may customize how the width and scale is passed down to that loader`s options.

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
