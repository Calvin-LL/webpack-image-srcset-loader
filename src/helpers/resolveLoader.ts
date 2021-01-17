import { loader } from "webpack";

export default function resolveLoader(
  context: loader.LoaderContext,
  path: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    // get internal `enhanced-resolve` resolver
    const resolver = context._compilation.resolverFactory.get("loader");

    resolver.resolve(
      {},
      context.rootContext,
      path,
      {},
      (err: null | Error, resolvedResource: string) => {
        if (err) reject(err);
        else resolve(resolvedResource);
      }
    );
  });
}
