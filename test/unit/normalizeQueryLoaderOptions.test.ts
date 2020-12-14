import normalizeQueryLoaderOptions from "../../src/helpers/normalizeQueryLoaderOptions";

it("should normalize { use: string; ...}", () => {
  expect(normalizeQueryLoaderOptions({ use: "test" })).toMatchObject({
    use: { loader: "test" },
  });
  expect(
    normalizeQueryLoaderOptions({ use: "test", test: true })
  ).toMatchObject({
    use: { loader: "test" },
    test: true,
  });
});

it("should normalize { use: { ... }; ...}", () => {
  expect(
    normalizeQueryLoaderOptions({
      use: { loader: "test", options: { test: true } },
    })
  ).toMatchObject({ use: { loader: "test", options: { test: true } } });
});
