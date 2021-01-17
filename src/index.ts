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

  generateSrcSetString(this, remainingRequest, options)
    .then((srcSetString) => {
      callback(
        null,
        `${
          options.esModule ? "export default" : "module.exports ="
        }  \`${srcSetString}\`;`
      );
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
    // since we filtered out all the width that are too wide,
    // nothing to worry about there, need this to make sure
    // scales larger than 1x works
    scaleUp: true,
    width,
    scale,
  };
}

// return require('-!some-loader?{...}!resize-loader?{...}!file.png')
async function generateSrcSetString(
  context: loader.LoaderContext,
  remainingRequest: string,
  options: FullOptions
): Promise<string> {
  const { fs, resourcePath } = context;

  let result = "";
  let width: number | undefined;

  const sizes = options.sizes;
  const maxDensity = getMaxDensity(sizes);
  const separator = ", ";
  const requireStart = "${require('-!";
  const requireEnd = "').default}";

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

      result += `${requireStart}${requireString}${requireEnd}${separator}`;

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

    result += `${requireStart}${requireString}${requireEnd} ${size}${separator}`;
  }

  result = result.substring(0, result.length - 2);

  return result;
}
