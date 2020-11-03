import webpack from "webpack";

import compile from "./helpers/compile";
import execute from "./helpers/execute";
import getCompiler from "./helpers/getCompiler";
import readAsset from "./helpers/readAsset";

describe.each([4, 5] as const)(
  'v%d "customOptionsFactory" option',
  (webpackVersion) => {
    test("should work with a function", async () => {
      const mockCustomOptionsFactory = jest.fn().mockReturnValue({
        fileLoaderOptions: {
          esModule: false,
        },
      });
      const compiler = getCompiler(webpackVersion, {
        sizes: ["2x", null, "1x", "300w"],
        customOptionsFactory: (
          width: number | undefined,
          scale: number | undefined,
          existingOptions: object
        ) => mockCustomOptionsFactory(width, scale, existingOptions),
      });
      const stats = await compile(webpackVersion, compiler);

      expect(
        execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
      ).toMatchSnapshot("result");

      expect(mockCustomOptionsFactory).toHaveBeenCalled();
      expect(mockCustomOptionsFactory).toMatchSnapshot();
    });
  }
);
