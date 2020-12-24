import { parseQuery } from "loader-utils";
import { validate } from "schema-utils";
import { Schema } from "schema-utils/declarations/validate";
import sharp from "sharp";
import { InputFileSystem, loader } from "webpack";

import { getOptions } from "@calvin-l/webpack-loader-util";

import getMaxDensity from "./helpers/getMaxDensity";
import getOptionFromSize from "./helpers/getOptionFromSize";
import normalizeQueryLoaderOptions from "./helpers/normalizeQueryLoaderOptions";
import validateSizes from "./helpers/validateSizes";
import schema from "./options.json";

export interface Options {
  // Waiting for typescript 4.2.0 to fix https://github.com/microsoft/TypeScript/issues/41651
  // readonly sizes?: (`${number}w` | `${number}x` | "original")[];
  readonly sizes?: string[];
  readonly scaleUp?: boolean;
  readonly customOptionsFactory?: (
    width: number | undefined,
    scale: number | undefined,
    existingOptions: Record<string, any> | undefined
  ) => string;
  readonly esModule?: boolean;
}

export type FullOptions = Options &
  Required<Pick<Options, "sizes" | "scaleUp" | "esModule">>;

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
    if (size === "original") {
      result += `${requireStart}${addOptionsToResizeLoader(
        remainingRequest,
        loaders,
        loaderIndex,
        {},
        options.customOptionsFactory
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

    result += `${requireStart}${addOptionsToResizeLoader(
      remainingRequest,
      loaders,
      loaderIndex,
      resizeLoaderOption,
      options.customOptionsFactory
    )}${requireEnd} ${size}${separator}`;
  }

  result = result.substring(0, result.length - 2);

  return result;
}

function addOptionsToResizeLoader(
  remainingRequest: string,
  loaders: any[],
  loaderIndex: number,
  options: { width?: number; scale?: number },
  customOptionsFactory: FullOptions["customOptionsFactory"]
): string {
  const nextLoader = loaders[loaderIndex + 1];
  const isNextLoaderQueryLoader = getIsLoaderQueryLoader(nextLoader);

  const resizeLoaderOptions =
    typeof nextLoader.options === "string"
      ? parseQuery("?" + nextLoader.options)
      : nextLoader.options;
  const resizeLoaderRequest = nextLoader.request;
  const resizeLoaderPath = nextLoader.path;

  if (customOptionsFactory)
    return remainingRequest.replace(
      resizeLoaderRequest,
      resizeLoaderPath +
        "?" +
        escapeJsonStringForLoader(
          JSON.stringify(
            customOptionsFactory(
              options.width,
              options.scale,
              resizeLoaderOptions
            )
          )
        )
    );

  if (isNextLoaderQueryLoader) {
    const queryLoaderOptions = normalizeQueryLoaderOptions(resizeLoaderOptions);

    return remainingRequest.replace(
      resizeLoaderRequest,
      resizeLoaderPath +
        "?" +
        escapeJsonStringForLoader(
          JSON.stringify({
            ...queryLoaderOptions,
            use: {
              loader: queryLoaderOptions.use.loader,
              options: {
                scaleUp: true,
                ...queryLoaderOptions.use.options,
                ...options,
                fileLoaderOptions: {
                  ...queryLoaderOptions.use.options?.fileLoaderOptions,
                  esModule: false, // because we're using require in pitch
                },
              },
            },
          })
        )
    );
  }

  return remainingRequest.replace(
    resizeLoaderRequest,
    resizeLoaderPath +
      "?" +
      escapeJsonStringForLoader(
        JSON.stringify({
          scaleUp: true,
          ...resizeLoaderOptions,
          ...options,
          fileLoaderOptions: {
            ...resizeLoaderOptions?.fileLoaderOptions,
            esModule: false, // because we're using require in pitch
          },
        })
      )
  );
}

function getIsLoaderQueryLoader(nextLoader: any): boolean {
  if (nextLoader === undefined)
    throw "webpack-image-srcset-loader must be placed at the beginning and followed by a resize loader";

  if ((nextLoader.path as string).includes("webpack-query-loader")) return true;

  return false;
}

// needed so webpack doesn't mistake "!" for query operator "!"
function escapeJsonStringForLoader(s: string): string {
  return s.replace(/!/g, "\\\\x21");
}
