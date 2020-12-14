import validateSizes from "../../src/helpers/validateSizes";

it("should validate [null]", () => {
  expect(validateSizes([null])).toBeUndefined();
});

it('should validate [null, "2x", "200w"]', () => {
  expect(validateSizes([null, "2x", "200w"])).toBeUndefined();
});

it("should not validate decimal", () => {
  expect(() => validateSizes(["2.0x"])).toThrow();
  expect(() => validateSizes(["0.2x"])).toThrow();
  expect(() => validateSizes(["20.0w"])).toThrow();
  expect(() => validateSizes(["200h"])).toThrow();
});
