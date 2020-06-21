import loaderUtils from "loader-utils";
import validateOptions from "schema-utils";
import { JSONSchema7 } from "schema-utils/declarations/validate";
import { loader } from "webpack";

import { getMaxDensity, getOptionFromSize } from "./helpers/sizes";
import { validateSizes } from "./helpers/validation";
import schema from "./options.json";

export interface OPTIONS {
  sizes: (string | null)[];
}

export const raw = true;

export function pitch(
  this: loader.LoaderContext,
  remainingRequest: string,
  precedingRequest: string,
  data: any
) {
  // if (this.data.processed) return;
  // this.data.processed = true;

  const options = loaderUtils.getOptions(this) as Partial<OPTIONS> | null;
  const queryObject = this.resourceQuery
    ? (loaderUtils.parseQuery(this.resourceQuery) as Partial<OPTIONS>)
    : {};
  const fullOptions = ({
    ...options,
    ...queryObject,
  } as unknown) as OPTIONS;

  validateOptions(schema as JSONSchema7, fullOptions, {
    name: "Image SrcSet Loader",
    baseDataPath: "options",
  });

  validateSizes(fullOptions.sizes);
  console.log(
    `module.exports = \`${generateSrcSetString(
      remainingRequest,
      this.loaders,
      this.loaderIndex,
      fullOptions
    )}\`;`
  );
  return `module.exports = \`${generateSrcSetString(
    remainingRequest,
    this.loaders,
    this.loaderIndex,
    fullOptions
  )}\`;`;
}

export default function (this: loader.LoaderContext, source: Buffer) {
  return source;
}

function generateSrcSetString(
  remainingRequest: string,
  loaders: any[],
  loaderIndex: number,
  options: OPTIONS
) {
  let result = "";

  const sizes = options.sizes;
  const maxDensity = getMaxDensity(sizes);
  const separator = ", ";
  const requireStart = "${require('-!";
  const requireEnd = "')}";

  for (const size of sizes) {
    if (!size) {
      result += `${requireStart}${addOptionsToResizeLoader(
        remainingRequest,
        loaders,
        loaderIndex,
        {}
      )}${requireEnd}${separator}`;

      continue;
    }

    const resizeLoaderOption = getOptionFromSize(size, maxDensity);

    result += `${requireStart}${addOptionsToResizeLoader(
      remainingRequest,
      loaders,
      loaderIndex,
      resizeLoaderOption
    )}${requireEnd} ${size}${separator}`;
  }

  result = result.substring(0, result.length - 2);

  return result;
}

function addOptionsToResizeLoader(
  remainingRequest: string,
  loaders: any[],
  loaderIndex: number,
  options: object
) {
  const {
    index: resizeLoaderIndex,
    resizeLoaderOptions,
    queryLoaderOptions,
  } = getResizeLoader(loaders);

  if (resizeLoaderIndex < loaderIndex)
    throw "webpack-image-resize-loader should be placed after webpack-image-srcset-loader";

  const resizeLoaderRequest = loaders[resizeLoaderIndex].request;
  const resizeLoaderPath = loaders[resizeLoaderIndex].path;

  if (resizeLoaderOptions)
    return remainingRequest.replace(
      resizeLoaderRequest,
      resizeLoaderPath +
        "?" +
        JSON.stringify({ ...resizeLoaderOptions, ...options })
    );
  if (queryLoaderOptions)
    return remainingRequest.replace(
      resizeLoaderRequest,
      resizeLoaderPath +
        "?" +
        JSON.stringify({
          queryLoaderOptions,
          use: { ...queryLoaderOptions.use, ...options },
        })
    );
}

function getResizeLoader(loaders: any[]) {
  for (let i = 0; i < loaders.length; i++) {
    const loader = loaders[i];

    if ((loader.path as string).includes("webpack-image-resize-loader")) {
      return { index: i, resizeLoaderOptions: loader.options };
    } else if (
      (loader.options?.use as string) === "webpack-image-resize-loader"
    ) {
      return {
        index: i,
        queryLoaderOptions: {
          ...loader.options,
          use: { loader: "webpack-image-resize-loader" },
        },
      };
    } else if (
      (loader.options?.use?.loader as string) === "webpack-image-resize-loader"
    ) {
      return {
        index: i,
        queryLoaderOptions: loader.options,
      };
    }
  }

  throw "webpack-image-resize-loader not found";
}
