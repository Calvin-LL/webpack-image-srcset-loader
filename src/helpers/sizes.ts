import { OPTIONS } from "../index";

export function getMaxDensity(sizes: OPTIONS["sizes"]): number {
  const sizeDensityValueRegex = /^(\d+)(x)$/; // match more tha none digit followed by x

  const densities = sizes
    .map((size) => size?.match(sizeDensityValueRegex)?.[1])
    .filter((size) => size)
    .map((size) => Number.parseInt(size as string));

  return Math.max(...densities);
}

export function getOptionFromSize(
  size: OPTIONS["sizes"][number],
  baseDensity: number
): {
  width?: number;
  scale?: number;
} {
  if (!size) return {};

  const sizeWidthValueRegex = /^(\d+)(w)$/; // match more tha none digit followed by w
  const sizeDensityValueRegex = /^(\d+)(x)$/; // match more tha none digit followed by x

  const sizeWidthMatches = size.match(sizeWidthValueRegex);
  const sizeDensityMatches = size.match(sizeDensityValueRegex);

  if (sizeWidthMatches) return { width: Number.parseInt(sizeWidthMatches[1]) };

  if (sizeDensityMatches)
    return { scale: Number.parseInt(sizeDensityMatches[1]) / baseDensity };

  throw "Should never reach here";
}
