/**
 * Extracts a thumbnail from a video at a specific seek time and playback rate.
 * Creates a hidden video element in the browser, seeks to the specified time,
 * and captures the frame into a canvas, which is then exported as a JPEG data URL or Blob URL.
 * The function handles video loading, seeking, frame capture, and cleanup automatically.
 *
 * @param videoUrl - The URL of the video to extract the thumbnail from
 * @param seekTime - The time in seconds at which to capture the frame
 * @param playbackRate - Playback speed for the video
 * @returns Promise resolving to a thumbnail image URL
 *
 * @example
 * ```js
 * // Extract thumbnail at 5 seconds
 * const thumbnail = await getThumbnail("https://example.com/video.mp4", 5);
 * // thumbnail is a data URL like "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
 *
 * // Extract thumbnail with custom playback rate
 * const thumbnail = await getThumbnail("https://example.com/video.mp4", 2.5, 1.5);
 * ```
 */
export declare const getThumbnail: (videoUrl: string, seekTime?: number, playbackRate?: number) => Promise<string>;
//# sourceMappingURL=get-thumbnail.d.ts.map