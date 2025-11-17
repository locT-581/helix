/**
 * Get audio duration - Copied from @twick/media-utils
 * Code reuse: 100% from Twick
 */

// Simple in-memory cache for audio durations
const audioDurationCache: Record<string, number> = {};

/**
 * Retrieves the duration (in seconds) of an audio file from a given source URL.
 * Uses a cache to avoid reloading the same audio multiple times for better performance.
 *
 * @param audioSrc - The source URL of the audio file
 * @returns Promise resolving to the duration of the audio in seconds
 */
export const getAudioDuration = (audioSrc: string): Promise<number> => {
  // Return cached duration if available
  const cached = audioDurationCache[audioSrc];
  if (cached !== undefined) {
    return Promise.resolve(cached);
  }

  return new Promise((resolve, reject) => {
    const audio = document.createElement("audio");
    audio.preload = "metadata"; // Only load metadata (e.g., duration)
    
    // Sanitize the audioSrc to prevent XSS by only allowing safe URLs
    const isSafeUrl = /^(https?:|blob:|data:audio\/)/i.test(audioSrc);
    if (!isSafeUrl) {
      reject(new Error("Unsafe audio source URL"));
      return;
    }
    
    audio.src = audioSrc;

    // When metadata is loaded, store duration in cache and resolve
    audio.onloadedmetadata = () => {
      const duration = audio.duration;
      audioDurationCache[audioSrc] = duration;
      resolve(duration);
    };

    // Handle loading errors
    audio.onerror = () => {
      reject(new Error("Failed to load audio metadata"));
    };
  });
};

/**
 * Clears the audio duration cache
 */
export const clearAudioDurationCache = (): void => {
  for (const key in audioDurationCache) {
    delete audioDurationCache[key];
  }
};
