import { parseQuery } from "loader-utils";
import { loader } from "webpack";

import { FullOptions } from "..";

import resolveLoader from "./resolveLoader";

// look through remaining loaders and add options to resize loader
export default async function getRequireStringWithModifiedResizeLoaderOptions(
  context: Omit<loader.LoaderContext, "loaders"> & {
    loaders: {
      path: string;
      request: string;
      options?: Record<string, any> | string;
    }[];
  },
  remainingRequest: string,
  options: { width?: number; scale?: number },
  resizeLoaderName: string,
  resizeLoaderOptionsGenerator: FullOptions["resizeLoaderOptionsGenerator"]
): Promise<string> {
  const { loaders, loaderIndex } = context;

  const resizeLoaderResolvedPath = await resolveLoader(
    context,
    resizeLoaderName
  );
  const resizeLoader = loaders.find(
    ({ path }, index) =>
      index > loaderIndex && path === resizeLoaderResolvedPath
  );

  if (resizeLoader === undefined)
    throw new Error(
      `Can't find ${resizeLoaderName} in the list of loaders after webpack-image-srcset-loader`
    );

  const resizeLoaderOptions =
    typeof resizeLoader.options === "string"
      ? parseQuery("?" + resizeLoader.options)
      : resizeLoader.options;
  const resizeLoaderRequest = resizeLoader.request;
  const resizeLoaderPath = resizeLoader.path;

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
}

// needed so webpack doesn't mistake "!" for query operator "!"
function escapeJsonStringForLoader(s: string): string {
  return s.replace(/!/g, "\\\\x21");
}
