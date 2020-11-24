import WISLWebpackTestCompiler from "./helpers/WISLWebpackTestCompiler";

describe.each([4, 5] as const)(
  'v%d "customOptionsFactory" option',
  (webpackVersion) => {
    test("should work with a function", async () => {
      const mockCustomOptionsFactory = jest.fn().mockReturnValue({
        fileLoaderOptions: {
          esModule: false,
        },
      });

      const compiler = new WISLWebpackTestCompiler({ webpackVersion });
      const bundle = await compiler.compile({
        loaderOptions: {
          sizes: ["2x", null, "1x", "300w"],
          customOptionsFactory: (
            width: number | undefined,
            scale: number | undefined,
            existingOptions: object
          ) => mockCustomOptionsFactory(width, scale, existingOptions),
        },
      });

      expect(bundle.execute("main.js")).toMatchSnapshot("result");

      expect(mockCustomOptionsFactory).toHaveBeenCalled();
      expect(mockCustomOptionsFactory).toMatchSnapshot();
    });
  }
);
