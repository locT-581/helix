/**
 * @helix/timeline - Media Utilities (Stub)
 *
 * TEMPORARY: These are placeholder functions.
 * Will be replaced with @helix/media-utils (Week 7-8) or WASM implementations.
 * REUSED structure from @twick/media-utils.
 */
export interface Size {
    width: number;
    height: number;
}
export interface VideoMetadata {
    duration: number;
    width: number;
    height: number;
    fps?: number;
}
export type ObjectFit = 'contain' | 'cover' | 'fill' | 'none';
/**
 * Get video metadata (STUB - will be replaced with WASM)
 * @param src - Video source URL
 * @returns Promise with video metadata
 */
export declare const getVideoMeta: (src: string) => Promise<VideoMetadata>;
/**
 * Get audio duration (STUB - will be replaced with WASM)
 * @param src - Audio source URL
 * @returns Promise with duration in seconds
 */
export declare const getAudioDuration: (src: string) => Promise<number>;
/**
 * Calculate object-fit size (REUSED from Twick)
 * @param baseSize - Original media size
 * @param parentSize - Container size
 * @param objectFit - Fit mode
 * @returns Calculated size
 */
export declare const getObjectFitSize: (baseSize: Size, parentSize: Size, objectFit?: ObjectFit) => Size;
/**
 * Get image metadata (STUB - will be replaced with WASM)
 * @param src - Image source URL
 * @returns Promise with image metadata
 */
export declare const getImageMeta: (src: string) => Promise<Size>;
/**
 * Get image dimensions (alias for getImageMeta)
 * @param src - Image source URL
 * @returns Promise with image dimensions
 */
export declare const getImageDimensions: (src: string) => Promise<Size>;
//# sourceMappingURL=media-stub.d.ts.map