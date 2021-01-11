import { parseQuery } from "loader-utils";

import { FullOptions } from "..";

// look through remaining loaders and add options to resize loader
export default function getRequireStringWithModifiedResizeLoaderOptions(
  remainingRequest: string,
  loaders: {
    path: string;
    request: string;
    options?: Record<string, any> | string;
  }[],
  loaderIndex: number,
  options: { width?: number; scale?: number },
  resizeLoaderName: string,
  resizeLoaderOptionsGenerator: FullOptions["resizeLoaderOptionsGenerator"]
): string {
  const resizeLoaderResolvedPath = require.resolve(resizeLoaderName);
  const resizeLoader = loaders.find(
    ({ path }, index) =>
      index > loaderIndex && path === resizeLoaderResolvedPath
  );

  if (resizeLoader === undefined)
    throw new Error(`Can't find ${resizeLoaderName} in the list of loaders`);

  const resizeLoaderOptions =
    typeof resizeLoader.options === "string"
      ? parseQuery("?" + resizeLoader.options)
      : resizeLoader.options;
  const resizeLoaderRequest = resizeLoader.request;
  const resizeLoaderPath = resizeLoader.path;

  if (resizeLoaderOptionsGenerator)
    return remainingRequest.replace(
      resizeLoaderRequest,
      resizeLoaderPath +
        "?" +
        escapeJsonStringForLoader(
          JSON.stringify(
            resizeLoaderOptionsGenerator(
              options.width,
              options.scale,
              resizeLoaderOptions
            )
          )
        )
    );

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

// needed so webpack doesn't mistake "!" for query operator "!"
function escapeJsonStringForLoader(s: string): string {
  return s.replace(/!/g, "\\\\x21");
}
