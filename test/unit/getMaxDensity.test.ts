import getMaxDensity from "../../src/helpers/getMaxDensity";

it('should work with ["1x", "2x"]', () => {
  expect(getMaxDensity(["1x", "2x"])).toBe(2);
});

it('should work with ["1x", "0.5x"]', () => {
  expect(getMaxDensity(["1x", "0.5x"])).toBe(1);
});

it('should work with ["1x", "2x", "100w"]', () => {
  expect(getMaxDensity(["1x", "2x", "100w"])).toBe(2);
});

it('should work with ["1x", "2x", "original"]', () => {
  expect(getMaxDensity(["1x", "2x", "original"])).toBe(2);
});

it('should work with ["100w", "200w", "original"]', () => {
  expect(getMaxDensity(["100w", "200w", "original"])).toBe(undefined);
});
