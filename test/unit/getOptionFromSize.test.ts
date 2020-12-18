import getOptionFromSize from "../../src/helpers/getOptionFromSize";

it('should work with "original", 1', () => {
  expect(getOptionFromSize("original", 1)).toMatchObject({});
});

it('should work with "1x", 3', () => {
  expect(getOptionFromSize("1x", 3)).toMatchObject({
    scale: 0.3333333333333333,
  });
});

it('should work with "100w", 1', () => {
  expect(getOptionFromSize("100w", 1)).toMatchObject({ width: 100 });
});

it('should work with "100w", undefined', () => {
  expect(getOptionFromSize("100w", undefined)).toMatchObject({ width: 100 });
});

it('should throw with "0.5x", 1', () => {
  expect(() => getOptionFromSize("0.5x", 1)).toThrow();
});

it('should throw with "1x", undefined', () => {
  expect(() => getOptionFromSize("1x", undefined)).toThrow();
});
