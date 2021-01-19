import { validate } from "schema-utils";
import { Schema } from "schema-utils/declarations/validate";
import sharp from "sharp";
import { loader } from "webpack";

import { getOptions } from "@calvin-l/webpack-loader-util";

import getMaxDensity from "./helpers/getMaxDensity";
import getOptionFromSize from "./helpers/getOptionFromSize";
import getRequireString from "./helpers/getRequireStringWithModifiedResizeLoaderOptions";
import validateSizes from "./helpers/validateSizes";
import schema from "./options.json";

export interface Options {
  readonly sizes?: (`${number}w` | `${number}x` | "original")[];
  readonly scaleUp?: boolean;
  readonly resizeLoader?: string;
  readonly resizeLoaderOptionsGenerator?: (
    width: number | undefined,
    scale: number | undefined,
    existingOptions: Record<string, any> | undefined
  ) => Record<string, any>;
  readonly esModule?: boolean;
}

export type FullOptions = Options &
  Required<
    Pick<
      Options,
      | "sizes"
      | "scaleUp"
      | "resizeLoader"
      | "resizeLoaderOptionsGenerator"
      | "esModule"
    >
  >;

export const raw = true;

export function pitch(
  this: loader.LoaderContext,
  remainingRequest: string
): void {
  const callback = this.async() as loader.loaderCallback;
  const defaultOptions: FullOptions = {
    // @ts-expect-error setting sizes as undefined and let validate throw error if it doesn't exist
    sizes: undefined,
    scaleUp: false,
    resizeLoader: "webpack-image-resize-loader",
    resizeLoaderOptionsGenerator: defaultResizeLoaderOptionsGenerator,
    esModule: true,
  };
  const options: FullOptions = {
    ...defaultOptions,
    ...getOptions<Options>(this),
  };

  validate(schema as Schema, options, {
    name: "webpack-image-srcset-loader",
    baseDataPath: "options",
  });

  validateSizes(options.sizes);

  generateVirtualModuleCode(this, remainingRequest, options)
    .then((code) => {
      callback(null, code);
    })
    .catch((error) => {
      callback(error, undefined);
    });
}

export default function (this: loader.LoaderContext, source: Buffer): Buffer {
  return source;
}

export function defaultResizeLoaderOptionsGenerator(
  width: number | undefined,
  scale: number | undefined,
  existingOptions: Record<string, any> | undefined
): Record<string, any> {
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

/**
 * generate
 *
 * const import_0 = require('-!/Users/Calvin/GitHub/webpack-image-srcset-loader/node_modules/file-loader/dist/cjs.js!/Users/Calvin/GitHub/webpack-image-srcset-loader/node_modules/webpack-image-resize-loader/dist/cjs.js?{"scaleUp":true,"scale":0.5}!/Users/Calvin/GitHub/webpack-image-srcset-loader/test/e2e/fixtures/Macaca_nigra_self-portrait_large.jpg');
 * const import_1 = require('-!/Users/Calvin/GitHub/webpack-image-srcset-loader/node_modules/file-loader/dist/cjs.js!/Users/Calvin/GitHub/webpack-image-srcset-loader/node_modules/webpack-image-resize-loader/dist/cjs.js?{"scaleUp":true,"width":300}!/Users/Calvin/GitHub/webpack-image-srcset-loader/test/e2e/fixtures/Macaca_nigra_self-portrait_large.jpg');
 * const import_2 = require('-!/Users/Calvin/GitHub/webpack-image-srcset-loader/node_modules/file-loader/dist/cjs.js!/Users/Calvin/GitHub/webpack-image-srcset-loader/node_modules/webpack-image-resize-loader/dist/cjs.js?{"scaleUp":true}!/Users/Calvin/GitHub/webpack-image-srcset-loader/test/e2e/fixtures/Macaca_nigra_self-portrait_large.jpg');
 * const import_3 = require('-!/Users/Calvin/GitHub/webpack-image-srcset-loader/node_modules/file-loader/dist/cjs.js!/Users/Calvin/GitHub/webpack-image-srcset-loader/node_modules/webpack-image-resize-loader/dist/cjs.js?{"scaleUp":true,"scale":1}!/Users/Calvin/GitHub/webpack-image-srcset-loader/test/e2e/fixtures/Macaca_nigra_self-portrait_large.jpg');
 *
 * export default `${import_0.default || import_0} 1x, ${import_1.default || import_1} 300w, ${import_2.default || import_2}, ${import_3.default || import_3} 2x`;
 */
async function generateVirtualModuleCode(
  context: loader.LoaderContext,
  remainingRequest: string,
  options: FullOptions
): Promise<string> {
  const { fs, resourcePath } = context;

  let importBlock = "";
  let exportBlock = "";
  let importCount = 0;
  let width: number | undefined;

  const sizes = options.sizes;
  const maxDensity = getMaxDensity(sizes);
  const separator = ", ";
  const tsStart = "${";
  const tsEnd = "}";

  for (const size of sizes) {
    // no need for options.scale or options.width if size === "orignal"
    if (size === "original") {
      const requireString = await getRequireString(
        context,
        remainingRequest,
        {},
        options.resizeLoader,
        options.resizeLoaderOptionsGenerator
      );

      importBlock += `const import_${importCount} = require('-!${requireString}');\n`;
      exportBlock += `${tsStart}import_${importCount}.default || import_${importCount}${tsEnd}${separator}`;

      importCount++;
      continue;
    }

    const resizeLoaderOption = getOptionFromSize(size, maxDensity);

    if (!options.scaleUp && resizeLoaderOption.width !== undefined) {
      if (width === undefined) {
        const buffer = fs.readFileSync(resourcePath);
        width = (await sharp(buffer).metadata()).width;
      }

      if (width !== undefined && resizeLoaderOption.width > width) continue;
    }

    const requireString = await getRequireString(
      context,
      remainingRequest,
      resizeLoaderOption,
      options.resizeLoader,
      options.resizeLoaderOptionsGenerator
    );

    importBlock += `const import_${importCount} = require('-!${requireString}');\n`;
    exportBlock += `${tsStart}import_${importCount}.default || import_${importCount}${tsEnd} ${size}${separator}`;

    importCount++;
  }

  exportBlock = exportBlock.substring(0, exportBlock.length - 2);

  const result = `
  ${importBlock}
  ${
    options.esModule ? "export default `" : "module.exports = `"
  }${exportBlock}\`;`.trim();

  return result;
}
