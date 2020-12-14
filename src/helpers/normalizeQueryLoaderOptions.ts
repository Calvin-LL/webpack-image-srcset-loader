export default function normalizeQueryLoaderOptions(options: {
  use: string | { loader: string; options?: Record<string, any> };
  [key: string]: any;
}): { use: { loader: string; options?: Record<string, any> } } {
  if (typeof options.use === "string")
    return {
      ...options,
      use: { loader: options.use },
    };

  return options as any;
}
