import { FullOptions } from "../index";

export default function getOptionFromSize(
  size: FullOptions["sizes"][number],
  baseDensity: number | undefined
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

  if (sizeDensityMatches && baseDensity)
    return { scale: Number.parseInt(sizeDensityMatches[1]) / baseDensity };

  throw new Error(`Invalid size ${size}`);
}
