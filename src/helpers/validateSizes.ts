import { FullOptions } from "../index";

export default function validateSizes(sizes: FullOptions["sizes"]): void {
  const sizeValueValidationRegex = /^\d+(w|x)$/; // match more tha none digit followed by w or x

  if (
    !sizes.every(
      (size) => size === null || size.match(sizeValueValidationRegex)
    )
  )
    throw `Invalid options object. Image SrcSet Loader has been initialised using an options object that does not match the API schema.
      - options.sizes ${JSON.stringify(sizes)} is not a valid value.`;
}
