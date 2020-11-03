import JSON5 from "json5";
import loaderUtils from "loader-utils";
import { validate } from "schema-utils";
import { Schema } from "schema-utils/declarations/validate";
import sharp from "sharp";
import { InputFileSystem, loader } from "webpack";

import { getMaxDensity, getOptionFromSize } from "./helpers/sizes";
import { validateSizes } from "./helpers/validation";
import schema from "./options.json";

export interface OPTIONS {
  sizes: (string | null)[];
  scaleUp: boolean;
  customOptionsFactory?: (
    width: number | undefined,
    scale: number | undefined,
    existingOptions: object | undefined
  ) => string;
  esModule: boolean;
}

export const raw = true;

export function pitch(this: loader.LoaderContext, remainingRequest: string) {
  const callback = this.async();
  const options = loaderUtils.getOptions(this) as Partial<OPTIONS> | null;
  const queryObject = this.resourceQuery
    ? (loaderUtils.parseQuery(this.resourceQuery) as Partial<OPTIONS>)
    : {};
  const fullOptions = ({
    ...options,
    ...queryObject,
  } as unknown) as OPTIONS;

  validate(schema as Schema, fullOptions, {
    name: "Image SrcSet Loader",
    baseDataPath: "options",
  });

  validateSizes(fullOptions.sizes);

  const esModule = fullOptions.esModule ?? true;

  generateSrcSetString(
    remainingRequest,
    this.loaders,
    this.loaderIndex,
    fullOptions,
    this.fs,
    this.resourcePath
  )
    .then((srcSetString) => {
      callback?.(
        null,
        `${
          esModule ? "export default" : "module.exports ="
        }  \`${srcSetString}\`;`
      );
    })
    .catch((e) => {
      callback?.(e);
    });
}

export default function (this: loader.LoaderContext, source: Buffer) {
  return source;
}

async function generateSrcSetString(
  remainingRequest: string,
  loaders: any[],
  loaderIndex: number,
  options: OPTIONS,
  fs: InputFileSystem,
  resourcePath: string
) {
  let result = "";
  let width: number | undefined;

  const sizes = options.sizes;
  const maxDensity = getMaxDensity(sizes);
  const separator = ", ";
  const requireStart = '${require("-!';
  const requireEnd = '")}';

  for (const size of sizes) {
    if (!size) {
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
  customOptionsFactory: OPTIONS["customOptionsFactory"]
) {
  const nextLoader = loaders[loaderIndex + 1];
  const isNextLoaderQueryLoader = getIsLoaderQueryLoader(nextLoader);

  const resizeLoaderOptions = nextLoader.options;
  const resizeLoaderRequest = nextLoader.request;
  const resizeLoaderPath = nextLoader.path;

  if (customOptionsFactory)
    return remainingRequest.replace(
      resizeLoaderRequest,
      resizeLoaderPath +
        "?" +
        escapeJsonStringForLoader(
          JSON5.stringify(
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
          JSON5.stringify({
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
        JSON5.stringify({
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

function normalizeQueryLoaderOptions(
  options: any
): { use: { loader: string; options?: any } } {
  if (typeof options.use === "string")
    return {
      ...options,
      use: { loader: options.use },
    };

  return options;
}

function getIsLoaderQueryLoader(nextLoader: any) {
  if (nextLoader === undefined)
    throw "webpack-image-srcset-loader must be placed at the beginning and followed by a resize loader";

  if ((nextLoader.path as string).includes("webpack-query-loader")) return true;

  return false;
}

function escapeJsonStringForLoader(s: string) {
  return s.replace(/\!/g, "\\\\x21");
}
