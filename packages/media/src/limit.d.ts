/**
 * Wraps an async function to enforce concurrency limits.
 * If the concurrency limit is reached, the function is queued and executed later
 * when a slot becomes available. This prevents overwhelming the system with too
 * many concurrent operations, which is useful for resource-intensive tasks like
 * media processing or API calls.
 *
 * @param fn - Async function returning a Promise that should be executed with concurrency control
 * @returns Promise resolving with the result of the wrapped function
 *
 * @example
 * ```js
 * // Limit concurrent image processing operations
 * const processImage = async (imageUrl) => {
 *   // Expensive image processing operation
 *   return await someImageProcessing(imageUrl);
 * };
 *
 * // Process multiple images with concurrency limit
 * const results = await Promise.all([
 *   limit(() => processImage("image1.jpg")),
 *   limit(() => processImage("image2.jpg")),
 *   limit(() => processImage("image3.jpg")),
 *   limit(() => processImage("image4.jpg")),
 *   limit(() => processImage("image5.jpg")),
 *   limit(() => processImage("image6.jpg")), // This will be queued until a slot opens
 * ]);
 * ```
 */
export declare function limit<T>(fn: () => Promise<T>): Promise<T>;
//# sourceMappingURL=limit.d.ts.map