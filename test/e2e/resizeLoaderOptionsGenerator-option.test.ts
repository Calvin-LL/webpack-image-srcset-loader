import WISLWebpackTestCompiler from "./helpers/WISLWebpackTestCompiler";

describe.each([4, 5] as const)(
  'v%d "resizeLoaderOptionsGenerator" option',
  (webpackVersion) => {
    it("should work with a function", async () => {
      const mockResizeLoaderOptionsGenerator: (
        width: number | undefined,
        scale: number | undefined,
        existingOptions: Record<string, any>
      ) => Record<string, any> = jest.fn().mockReturnValue({
        fileLoaderOptions: {
          esModule: false,
        },
      });

      const compiler = new WISLWebpackTestCompiler({ webpackVersion });
      const bundle = await compiler.compile({
        loaderOptions: {
          sizes: ["2x", "original", "1x", "300w"],
          resizeLoaderOptionsGenerator: (
            width: number | undefined,
            scale: number | undefined,
            existingOptions: Record<string, any>
          ) => mockResizeLoaderOptionsGenerator(width, scale, existingOptions),
        },
      });

      expect(bundle.execute("main.js")).toMatchSnapshot("result");

      expect(mockResizeLoaderOptionsGenerator).toHaveBeenCalled();
      expect(mockResizeLoaderOptionsGenerator).toMatchSnapshot();
    });
  }
);
