import { validate } from "schema-utils";
import { Schema } from "schema-utils/declarations/validate";
import sharp from "sharp";
import { InputFileSystem, loader } from "webpack";

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
  Required<Pick<Options, "sizes" | "scaleUp" | "resizeLoader" | "esModule">>;

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

  generateSrcSetString(
    remainingRequest,
    this.loaders,
    this.loaderIndex,
    options,
    this.fs,
    this.resourcePath
  )
    .then((srcSetString) => {
      callback(
        null,
        `${
          options.esModule ? "export default" : "module.exports ="
        }  \`${srcSetString}\`;`
      );
    })
    .catch((e) => {
      throw e;
    });
}

export default function (this: loader.LoaderContext, source: Buffer): Buffer {
  return source;
}

// return require('-!some-loader?{...}!resize-loader?{...}!file.png')
async function generateSrcSetString(
  remainingRequest: string,
  loaders: any[],
  loaderIndex: number,
  options: FullOptions,
  fs: InputFileSystem,
  resourcePath: string
): Promise<string> {
  let result = "";
  let width: number | undefined;

  const sizes = options.sizes;
  const maxDensity = getMaxDensity(sizes);
  const separator = ", ";
  const requireStart = "${require('-!";
  const requireEnd = "')}";

  for (const size of sizes) {
    // no need for options.scale or options.width if size === "orignal"
    if (size === "original") {
      result += `${requireStart}${getRequireString(
        remainingRequest,
        loaders,
        loaderIndex,
        {},
        options.resizeLoader,
        options.resizeLoaderOptionsGenerator
      )}${requireEnd}${separator}`;

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

    result += `${requireStart}${getRequireString(
      remainingRequest,
      loaders,
      loaderIndex,
      resizeLoaderOption,
      options.resizeLoader,
      options.resizeLoaderOptionsGenerator
    )}${requireEnd} ${size}${separator}`;
  }

  result = result.substring(0, result.length - 2);

  return result;
}
