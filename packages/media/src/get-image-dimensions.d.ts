import type { Dimensions } from "./types";
/**
 * Gets the dimensions (width and height) of an image from the given URL.
 * Uses a cache to avoid reloading the image if already fetched, and employs
 * a concurrency limiter to control resource usage and prevent overwhelming
 * the browser with too many simultaneous image loads.
 *
 * @param url - The URL of the image to analyze
 * @returns Promise resolving to an object containing width and height
 *
 * @example
 * ```js
 * // Get dimensions of a remote image
 * const dimensions = await getImageDimensions("https://example.com/image.jpg");
 * // dimensions = { width: 1920, height: 1080 }
 *
 * // Get dimensions of a local blob URL
 * const dimensions = await getImageDimensions("blob:http://localhost:3000/abc123");
 * // dimensions = { width: 800, height: 600 }
 *
 * // Subsequent calls for the same URL will use cache
 * const cachedDimensions = await getImageDimensions("https://example.com/image.jpg");
 * // Returns immediately from cache without reloading
 * ```
 */
export declare const getImageDimensions: (url: string) => Promise<Dimensions>;
//# sourceMappingURL=get-image-dimensions.d.ts.map