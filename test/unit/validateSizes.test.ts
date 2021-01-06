import validateSizes from "../../src/helpers/validateSizes";

it('should validate ["original"]', () => {
  expect(validateSizes(["original"])).toBeUndefined();
});

it('should validate ["original", "2x", "200w"]', () => {
  expect(validateSizes(["original", "2x", "200w"])).toBeUndefined();
});

it("should not validate decimal", () => {
  expect(() => validateSizes(["2.0x"])).toThrow();
  expect(() => validateSizes(["0.2x"])).toThrow();
  expect(() => validateSizes(["20.0w"])).toThrow();
  // @ts-expect-error violating typing to test throw
  expect(() => validateSizes(["200h"])).toThrow();
});
