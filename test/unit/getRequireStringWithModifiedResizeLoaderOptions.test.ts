import getRequireStringWithModifiedResizeLoaderOptions from "../../src/helpers/getRequireStringWithModifiedResizeLoaderOptions";

it("should handle resizeLoaderPath options being string", () => {
  const urlLoaderPath = require.resolve("url-loader");
  const resizeLoaderName = "webpack-image-resize-loader";
  const resizeLoaderPath = require.resolve(resizeLoaderName);
  const remainingRequest = `${urlLoaderPath}??ruleSet[1].rules[1].use[0]!${resizeLoaderPath}??ruleSet[1].rules[1].use[1]!/home/username/project-name/src/assets/Macaca_nigra_self-portrait_large.jpg`;
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
      path: urlLoaderPath,
      request: `${urlLoaderPath}??ruleSet[1].rules[1].use[0]`,
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
  const resizeLoaderOptionsGenerator = undefined;

  const result = getRequireStringWithModifiedResizeLoaderOptions(
    remainingRequest,
    loaders,
    loaderIndex,
    options,
    resizeLoaderName,
    resizeLoaderOptionsGenerator
  );

  expect(result).toMatchInlineSnapshot(
    `"<rootDir>/node_modules/url-loader/dist/cjs.js??ruleSet[1].rules[1].use[0]!<rootDir>/node_modules/webpack-image-resize-loader/dist/cjs.js?{"scaleUp":true,"test":3,"fileLoaderOptions":{"esModule":false}}!/home/username/project-name/src/assets/Macaca_nigra_self-portrait_large.jpg"`
  );
});

it("should handle resizeLoaderPath options being object", () => {
  const urlLoaderPath = require.resolve("url-loader");
  const resizeLoaderName = "webpack-image-resize-loader";
  const resizeLoaderPath = require.resolve(resizeLoaderName);
  const remainingRequest = `${urlLoaderPath}??ruleSet[1].rules[1].use[0]!${resizeLoaderPath}??ruleSet[1].rules[1].use[1]!/home/username/project-name/src/assets/Macaca_nigra_self-portrait_large.jpg`;
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
      path: urlLoaderPath,
      request: `${urlLoaderPath}??ruleSet[1].rules[1].use[0]`,
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
  const resizeLoaderOptionsGenerator = undefined;

  const result = getRequireStringWithModifiedResizeLoaderOptions(
    remainingRequest,
    loaders,
    loaderIndex,
    options,
    resizeLoaderName,
    resizeLoaderOptionsGenerator
  );

  expect(result).toMatchInlineSnapshot(
    `"<rootDir>/node_modules/url-loader/dist/cjs.js??ruleSet[1].rules[1].use[0]!<rootDir>/node_modules/webpack-image-resize-loader/dist/cjs.js?{"scaleUp":true,"test":3,"fileLoaderOptions":{"esModule":false}}!/home/username/project-name/src/assets/Macaca_nigra_self-portrait_large.jpg"`
  );
});

it("should handle resizeLoaderPath options being undefined", () => {
  const urlLoaderPath = require.resolve("url-loader");
  const resizeLoaderName = "webpack-image-resize-loader";
  const resizeLoaderPath = require.resolve(resizeLoaderName);
  const remainingRequest = `${urlLoaderPath}??ruleSet[1].rules[1].use[0]!${resizeLoaderPath}??ruleSet[1].rules[1].use[1]!/home/username/project-name/src/assets/Macaca_nigra_self-portrait_large.jpg`;
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
      path: urlLoaderPath,
      request: `${urlLoaderPath}??ruleSet[1].rules[1].use[0]`,
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
  const resizeLoaderOptionsGenerator = undefined;

  const result = getRequireStringWithModifiedResizeLoaderOptions(
    remainingRequest,
    loaders,
    loaderIndex,
    options,
    resizeLoaderName,
    resizeLoaderOptionsGenerator
  );

  expect(result).toMatchInlineSnapshot(
    `"<rootDir>/node_modules/url-loader/dist/cjs.js??ruleSet[1].rules[1].use[0]!<rootDir>/node_modules/webpack-image-resize-loader/dist/cjs.js?{"scaleUp":true,"fileLoaderOptions":{"esModule":false}}!/home/username/project-name/src/assets/Macaca_nigra_self-portrait_large.jpg"`
  );
});

it("should throw if resizeLoader not found", () => {
  const urlLoaderPath = require.resolve("url-loader");
  const resizeLoaderName = "webpack-image-resize-loader";
  const resizeLoaderPath = require.resolve(resizeLoaderName);
  const remainingRequest = `${urlLoaderPath}??ruleSet[1].rules[1].use[0]!${resizeLoaderPath}??ruleSet[1].rules[1].use[1]!/home/username/project-name/src/assets/Macaca_nigra_self-portrait_large.jpg`;
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
      path: urlLoaderPath,
      request: `${urlLoaderPath}??ruleSet[1].rules[1].use[0]`,
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
  const resizeLoaderOptionsGenerator = undefined;

  expect(() =>
    getRequireStringWithModifiedResizeLoaderOptions(
      remainingRequest,
      loaders,
      loaderIndex,
      options,
      "file-loader",
      resizeLoaderOptionsGenerator
    )
  ).toThrowErrorMatchingInlineSnapshot(
    `"Can't find file-loader in the list of loaders"`
  );
});

it("should handle resizeLoaderOptionsGenerator", () => {
  const urlLoaderPath = require.resolve("url-loader");
  const resizeLoaderName = "webpack-image-resize-loader";
  const resizeLoaderPath = require.resolve(resizeLoaderName);
  const remainingRequest = `${urlLoaderPath}??ruleSet[1].rules[1].use[0]!${resizeLoaderPath}??ruleSet[1].rules[1].use[1]!/home/username/project-name/src/assets/Macaca_nigra_self-portrait_large.jpg`;
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
      path: urlLoaderPath,
      request: `${urlLoaderPath}??ruleSet[1].rules[1].use[0]`,
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

  const result = getRequireStringWithModifiedResizeLoaderOptions(
    remainingRequest,
    loaders,
    loaderIndex,
    options,
    resizeLoaderName,
    resizeLoaderOptionsGenerator
  );

  expect(result).toMatchInlineSnapshot(
    `"<rootDir>/node_modules/url-loader/dist/cjs.js??ruleSet[1].rules[1].use[0]!<rootDir>/node_modules/webpack-image-resize-loader/dist/cjs.js?{"test":"true"}!/home/username/project-name/src/assets/Macaca_nigra_self-portrait_large.jpg"`
  );
});
