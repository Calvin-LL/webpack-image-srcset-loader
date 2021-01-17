import { loader } from "webpack";

import { defaultResizeLoaderOptionsGenerator } from "../../src";

beforeEach(() => {
  jest.resetModules();
});

it("should handle resizeLoaderPath options being string", async () => {
  const fileLoaderPath = require.resolve("file-loader");
  const resizeLoaderName = "webpack-image-resize-loader";
  const resizeLoaderPath = require.resolve(resizeLoaderName);
  const remainingRequest = `${fileLoaderPath}??ruleSet[1].rules[1].use[0]!${resizeLoaderPath}??ruleSet[1].rules[1].use[1]!/home/username/project-name/src/assets/Macaca_nigra_self-portrait_large.jpg`;
  const loaders: {
    path: string;
    request: string;
    options?: Record<string, any> | string;
  }[] = [
    {
      path: "webpack-image-srcset-loader",
      request: 'webpack-image-srcset-loader?{"test":5}',
      options: undefined,
    },
    {
      path: fileLoaderPath,
      request: `${fileLoaderPath}??ruleSet[1].rules[1].use[0]`,
      options: { test: 5 },
    },
    {
      path: resizeLoaderPath,
      request: `${resizeLoaderPath}??ruleSet[1].rules[1].use[1]`,
      options: '{"test":3}',
    },
  ];
  const loaderIndex = 0;
  const options = {};
  const resizeLoaderOptionsGenerator = defaultResizeLoaderOptionsGenerator;
  const context = { loaders, loaderIndex } as loader.LoaderContext;

  jest.doMock("../../src/helpers/resolveLoader", () => ({
    __esModule: true,
    default: async () => resizeLoaderPath,
  }));

  const getRequireString = require("../../src/helpers/getRequireStringWithModifiedResizeLoaderOptions")
    .default;

  const result = await getRequireString(
    context,
    remainingRequest,
    options,
    resizeLoaderName,
    resizeLoaderOptionsGenerator
  );

  expect(result).toMatchInlineSnapshot(
    `"<rootDir>/node_modules/file-loader/dist/cjs.js??ruleSet[1].rules[1].use[0]!<rootDir>/node_modules/webpack-image-resize-loader/dist/cjs.js?{"test":3,"scaleUp":true}!/home/username/project-name/src/assets/Macaca_nigra_self-portrait_large.jpg"`
  );
});

it("should handle resizeLoaderPath options being object", async () => {
  const fileLoaderPath = require.resolve("file-loader");
  const resizeLoaderName = "webpack-image-resize-loader";
  const resizeLoaderPath = require.resolve(resizeLoaderName);
  const remainingRequest = `${fileLoaderPath}??ruleSet[1].rules[1].use[0]!${resizeLoaderPath}??ruleSet[1].rules[1].use[1]!/home/username/project-name/src/assets/Macaca_nigra_self-portrait_large.jpg`;
  const loaders: {
    path: string;
    request: string;
    options?: Record<string, any> | string;
  }[] = [
    {
      path: "webpack-image-srcset-loader",
      request: 'webpack-image-srcset-loader?{"test":5}',
      options: undefined,
    },
    {
      path: fileLoaderPath,
      request: `${fileLoaderPath}??ruleSet[1].rules[1].use[0]`,
      options: { test: 5 },
    },
    {
      path: resizeLoaderPath,
      request: `${resizeLoaderPath}??ruleSet[1].rules[1].use[1]`,
      options: { test: 3 },
    },
  ];
  const loaderIndex = 0;
  const options = {};
  const resizeLoaderOptionsGenerator = defaultResizeLoaderOptionsGenerator;
  const context = { loaders, loaderIndex } as loader.LoaderContext;

  jest.doMock("../../src/helpers/resolveLoader", () => ({
    __esModule: true,
    default: async () => resizeLoaderPath,
  }));

  const getRequireString = require("../../src/helpers/getRequireStringWithModifiedResizeLoaderOptions")
    .default;

  const result = await getRequireString(
    context,
    remainingRequest,
    options,
    resizeLoaderName,
    resizeLoaderOptionsGenerator
  );

  expect(result).toMatchInlineSnapshot(
    `"<rootDir>/node_modules/file-loader/dist/cjs.js??ruleSet[1].rules[1].use[0]!<rootDir>/node_modules/webpack-image-resize-loader/dist/cjs.js?{"test":3,"scaleUp":true}!/home/username/project-name/src/assets/Macaca_nigra_self-portrait_large.jpg"`
  );
});

it("should handle resizeLoaderPath options being undefined", async () => {
  const fileLoaderPath = require.resolve("file-loader");
  const resizeLoaderName = "webpack-image-resize-loader";
  const resizeLoaderPath = require.resolve(resizeLoaderName);
  const remainingRequest = `${fileLoaderPath}??ruleSet[1].rules[1].use[0]!${resizeLoaderPath}??ruleSet[1].rules[1].use[1]!/home/username/project-name/src/assets/Macaca_nigra_self-portrait_large.jpg`;
  const loaders: {
    path: string;
    request: string;
    options?: Record<string, any> | string;
  }[] = [
    {
      path: "webpack-image-srcset-loader",
      request: 'webpack-image-srcset-loader?{"test":5}',
      options: undefined,
    },
    {
      path: fileLoaderPath,
      request: `${fileLoaderPath}??ruleSet[1].rules[1].use[0]`,
      options: { test: 5 },
    },
    {
      path: resizeLoaderPath,
      request: `${resizeLoaderPath}??ruleSet[1].rules[1].use[1]`,
      options: undefined,
    },
  ];
  const loaderIndex = 0;
  const options = {};
  const resizeLoaderOptionsGenerator = defaultResizeLoaderOptionsGenerator;
  const context = { loaders, loaderIndex } as loader.LoaderContext;

  jest.doMock("../../src/helpers/resolveLoader", () => ({
    __esModule: true,
    default: async () => resizeLoaderPath,
  }));

  const getRequireString = require("../../src/helpers/getRequireStringWithModifiedResizeLoaderOptions")
    .default;

  const result = await getRequireString(
    context,
    remainingRequest,
    options,
    resizeLoaderName,
    resizeLoaderOptionsGenerator
  );

  expect(result).toMatchInlineSnapshot(
    `"<rootDir>/node_modules/file-loader/dist/cjs.js??ruleSet[1].rules[1].use[0]!<rootDir>/node_modules/webpack-image-resize-loader/dist/cjs.js?{"scaleUp":true}!/home/username/project-name/src/assets/Macaca_nigra_self-portrait_large.jpg"`
  );
});

it("should throw if resizeLoader not found", async () => {
  const fileLoaderPath = require.resolve("file-loader");
  const resizeLoaderName = "webpack-image-resize-loader";
  const resizeLoaderPath = require.resolve(resizeLoaderName);
  const remainingRequest = `${fileLoaderPath}??ruleSet[1].rules[1].use[0]!${resizeLoaderPath}??ruleSet[1].rules[1].use[1]!/home/username/project-name/src/assets/Macaca_nigra_self-portrait_large.jpg`;
  const loaders: {
    path: string;
    request: string;
    options?: Record<string, any> | string;
  }[] = [
    {
      path: "webpack-image-srcset-loader",
      request: 'webpack-image-srcset-loader?{"test":5}',
      options: undefined,
    },
    {
      path: fileLoaderPath,
      request: `${fileLoaderPath}??ruleSet[1].rules[1].use[0]`,
      options: { test: 5 },
    },
    {
      path: resizeLoaderPath,
      request: `${resizeLoaderPath}??ruleSet[1].rules[1].use[1]`,
      options: undefined,
    },
  ];
  const loaderIndex = 0;
  const options = {};
  const resizeLoaderOptionsGenerator = defaultResizeLoaderOptionsGenerator;
  const context = { loaders, loaderIndex } as loader.LoaderContext;

  jest.doMock("../../src/helpers/resolveLoader", () => ({
    __esModule: true,
    default: async () => "test",
  }));

  const getRequireString = require("../../src/helpers/getRequireStringWithModifiedResizeLoaderOptions")
    .default;

  await expect(
    getRequireString(
      context,
      remainingRequest,
      options,
      "file-loader",
      resizeLoaderOptionsGenerator
    )
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `"Can't find file-loader in the list of loaders after webpack-image-srcset-loader"`
  );
});

it("should handle resizeLoaderOptionsGenerator", async () => {
  const fileLoaderPath = require.resolve("file-loader");
  const resizeLoaderName = "webpack-image-resize-loader";
  const resizeLoaderPath = require.resolve(resizeLoaderName);
  const remainingRequest = `${fileLoaderPath}??ruleSet[1].rules[1].use[0]!${resizeLoaderPath}??ruleSet[1].rules[1].use[1]!/home/username/project-name/src/assets/Macaca_nigra_self-portrait_large.jpg`;
  const loaders: {
    path: string;
    request: string;
    options?: Record<string, any> | string;
  }[] = [
    {
      path: "webpack-image-srcset-loader",
      request: 'webpack-image-srcset-loader?{"test":5}',
      options: undefined,
    },
    {
      path: fileLoaderPath,
      request: `${fileLoaderPath}??ruleSet[1].rules[1].use[0]`,
      options: { test: 5 },
    },
    {
      path: resizeLoaderPath,
      request: `${resizeLoaderPath}??ruleSet[1].rules[1].use[1]`,
      options: undefined,
    },
  ];
  const loaderIndex = 0;
  const options = {};
  const resizeLoaderOptionsGenerator = (): Record<string, any> => ({
    test: "true",
  });
  const context = { loaders, loaderIndex } as loader.LoaderContext;

  jest.doMock("../../src/helpers/resolveLoader", () => ({
    __esModule: true,
    default: async () => resizeLoaderPath,
  }));

  const getRequireString = require("../../src/helpers/getRequireStringWithModifiedResizeLoaderOptions")
    .default;

  const result = await getRequireString(
    context,
    remainingRequest,
    options,
    resizeLoaderName,
    resizeLoaderOptionsGenerator
  );

  expect(result).toMatchInlineSnapshot(
    `"<rootDir>/node_modules/file-loader/dist/cjs.js??ruleSet[1].rules[1].use[0]!<rootDir>/node_modules/webpack-image-resize-loader/dist/cjs.js?{"test":"true"}!/home/username/project-name/src/assets/Macaca_nigra_self-portrait_large.jpg"`
  );
});
