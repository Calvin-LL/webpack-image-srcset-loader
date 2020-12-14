import { FullOptions } from "../index";

export default function getMaxDensity(
  sizes: FullOptions["sizes"]
): number | undefined {
  const sizeDensityValueRegex = /^(\d+)(x)$/; // match more tha none digit followed by x

  const densities = sizes
    .map((size) => size?.match(sizeDensityValueRegex)?.[1])
    .filter((size) => size)
    .map((size) => Number.parseInt(size as string));

  if (densities.length === 0) return undefined;

  return Math.max(...densities);
}
