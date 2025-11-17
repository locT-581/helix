import type { VideoMeta } from "./types";
/**
 * Fetches metadata (width, height, duration) for a given video source.
 * Uses a cache to avoid reloading the same video multiple times for better performance.
 * The function creates a temporary video element, loads only metadata, and extracts
 * the video properties without downloading the entire file.
 *
 * @param videoSrc - The URL or path to the video file
 * @returns Promise resolving to an object containing video metadata
 *
 * @example
 * ```js
 * // Get metadata for a video
 * const metadata = await getVideoMeta("https://example.com/video.mp4");
 * // metadata = { width: 1920, height: 1080, duration: 120.5 }
 *
 * // Get metadata for a local blob URL
 * const metadata = await getVideoMeta("blob:http://localhost:3000/abc123");
 * // metadata = { width: 1280, height: 720, duration: 30.0 }
 * ```
 */
export declare const getVideoMeta: (videoSrc: string) => Promise<VideoMeta>;
//# sourceMappingURL=get-video-metadata.d.ts.map