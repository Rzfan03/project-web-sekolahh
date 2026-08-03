export const placeholderImage = (
  width: number,
  height: number,
  text = "Template Foto"
): string =>
  `https://placehold.co/${width}x${height}/e7e5e4/78716c?text=${encodeURIComponent(text)}`

export const PLACEHOLDER_IMAGE = placeholderImage(800, 600)
