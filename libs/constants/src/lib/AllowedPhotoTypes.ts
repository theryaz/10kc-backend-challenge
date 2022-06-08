/**
 * See documentation of common image types and browser support.
 * Our images will be served directly to the browser without being transcoded so we should only allow widely supported image types.
 * 
 * https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types
 * 
 */
export const ALLOWED_PHOTO_TYPES = [
	"image/png",
	"image/jpeg",
	"image/webp",
];