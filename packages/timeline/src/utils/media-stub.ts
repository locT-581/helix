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
export const getVideoMeta = async (src: string): Promise<VideoMetadata> => {
  // TODO: Replace with WASM implementation
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.src = src;
    video.onloadedmetadata = () => {
      resolve({
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
        fps: 30, // Default FPS
      });
    };
  });
};

/**
 * Get audio duration (STUB - will be replaced with WASM)
 * @param src - Audio source URL
 * @returns Promise with duration in seconds
 */
export const getAudioDuration = async (src: string): Promise<number> => {
  // TODO: Replace with WASM implementation
  return new Promise((resolve) => {
    const audio = document.createElement('audio');
    audio.src = src;
    audio.onloadedmetadata = () => {
      resolve(audio.duration);
    };
  });
};

/**
 * Calculate object-fit size (REUSED from Twick)
 * @param baseSize - Original media size
 * @param parentSize - Container size
 * @param objectFit - Fit mode
 * @returns Calculated size
 */
export const getObjectFitSize = (
  baseSize: Size,
  parentSize: Size,
  objectFit: ObjectFit = 'contain'
): Size => {
  if (objectFit === 'none') {
    return baseSize;
  }

  if (objectFit === 'fill') {
    return parentSize;
  }

  const baseRatio = baseSize.width / baseSize.height;
  const parentRatio = parentSize.width / parentSize.height;

  let width: number;
  let height: number;

  if (objectFit === 'contain') {
    if (baseRatio > parentRatio) {
      width = parentSize.width;
      height = parentSize.width / baseRatio;
    } else {
      height = parentSize.height;
      width = parentSize.height * baseRatio;
    }
  } else {
    // objectFit === 'cover'
    if (baseRatio > parentRatio) {
      height = parentSize.height;
      width = parentSize.height * baseRatio;
    } else {
      width = parentSize.width;
      height = parentSize.width / baseRatio;
    }
  }

  return { width, height };
};

/**
 * Get image metadata (STUB - will be replaced with WASM)
 * @param src - Image source URL
 * @returns Promise with image metadata
 */
export const getImageMeta = async (src: string): Promise<Size> => {
  // TODO: Replace with WASM implementation
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
    };
  });
};
