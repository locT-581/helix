/**
 * Audio utilities for Helix - Copied from @twick/media-utils
 * 
 * Code reuse: 95% from Twick
 * Modified: Removed lamejs dependency (will use WASM encoder)
 */

/**
 * Audio segment interface for stitching
 */
export interface AudioSegment {
  src: string;
  s: number; // start time in seconds
  e: number; // end time in seconds
  volume?: number; // volume level (0-1), defaults to 1, 0 = muted
}

/**
 * Extracts an audio segment from a media source between start and end times,
 * rendered at the specified playback rate, and returns a Blob URL to an MP3 file.
 *
 * @param src - The source URL of the media file
 * @param playbackRate - The playback rate for the extracted segment
 * @param start - The start time in seconds
 * @param end - The end time in seconds
 * @returns Promise resolving to a Blob URL to the extracted MP3 file
 */
export const extractAudio = async ({
  src,
  playbackRate = 1,
  start = 0,
  end,
}: {
  src: string;
  playbackRate?: number;
  start?: number;
  end?: number;
}): Promise<string> => {
  if (!src) throw new Error("src is required");
  if (playbackRate <= 0) throw new Error("playbackRate must be > 0");

  // Basic URL safety check
  const isSafeUrl = /^(https?:|blob:|data:)/i.test(src);
  if (!isSafeUrl) throw new Error("Unsafe media source URL");

  // Fetch and decode audio
  const audioBuffer = await fetchAndDecodeAudio(src);

  // Normalize time range
  const clampedStart = Math.max(0, start || 0);
  const fullDuration = audioBuffer.duration;
  const clampedEnd = Math.min(
    typeof end === "number" ? end : fullDuration,
    fullDuration
  );
  if (clampedEnd <= clampedStart)
    throw new Error("Invalid range: end must be greater than start");

  // Render segment with playback rate
  const renderedBuffer = await renderAudioSegment(
    audioBuffer,
    clampedStart,
    clampedEnd,
    playbackRate
  );

  // Convert to MP3 and return URL
  const mp3Blob = await audioBufferToMp3(renderedBuffer);
  return URL.createObjectURL(mp3Blob);
};

/**
 * Stitches multiple audio segments into a single MP3 file.
 *
 * @param segments - Array of audio segments with source, start, and end times
 * @param totalDuration - Total duration of the output audio
 * @returns Promise resolving to a Blob URL to the stitched MP3 file
 */
export const stitchAudio = async (
  segments: AudioSegment[],
  totalDuration?: number
): Promise<string> => {
  if (!segments || segments.length === 0) {
    throw new Error("At least one audio segment is required");
  }

  // Calculate total duration if not provided
  const duration = totalDuration || Math.max(...segments.map((s) => s.e));

  // Create timeline and render segments
  const renderedBuffer = await createAudioTimeline(segments, duration);

  // Convert to MP3 and return URL
  const mp3Blob = await audioBufferToMp3(renderedBuffer);
  return URL.createObjectURL(mp3Blob);
};

// ===== SHARED UTILITIES =====

/**
 * Fetches and decodes audio from a URL.
 */
const fetchAndDecodeAudio = async (src: string): Promise<AudioBuffer> => {
  const response = await fetch(src);
  if (!response.ok)
    throw new Error(`Failed to fetch source: ${response.status}`);

  const arrayBuffer = await response.arrayBuffer();
  return decodeAudioData(arrayBuffer);
};

/**
 * Decodes audio data using Web Audio API
 */
const decodeAudioData = async (
  arrayBuffer: ArrayBuffer
): Promise<AudioBuffer> => {
  const AudioContextCtor: typeof AudioContext =
    (window as any).AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextCtor) throw new Error("Web Audio API not supported");

  const audioContext = new AudioContextCtor();
  try {
    return await new Promise<AudioBuffer>((resolve, reject) => {
      audioContext.decodeAudioData(
        arrayBuffer.slice(0),
        (buf) => resolve(buf),
        (err) => reject(err || new Error("Failed to decode audio"))
      );
    });
  } finally {
    audioContext.close();
  }
};

/**
 * Renders an audio segment with playback rate
 */
const renderAudioSegment = async (
  audioBuffer: AudioBuffer,
  start: number,
  end: number,
  playbackRate: number
): Promise<AudioBuffer> => {
  const OfflineAudioContextCtor: typeof OfflineAudioContext =
    (window as any).OfflineAudioContext ||
    (window as any).webkitOfflineAudioContext;
  if (!OfflineAudioContextCtor)
    throw new Error("OfflineAudioContext not supported");

  const sampleRate = audioBuffer.sampleRate;
  const numChannels = audioBuffer.numberOfChannels;
  const sourceDuration = end - start;
  const renderedFrames = Math.max(
    1,
    Math.ceil((sourceDuration / playbackRate) * sampleRate)
  );

  const offline = new OfflineAudioContextCtor(
    numChannels,
    renderedFrames,
    sampleRate
  );
  const sourceNode = offline.createBufferSource();
  sourceNode.buffer = audioBuffer;
  sourceNode.playbackRate.value = playbackRate;
  sourceNode.connect(offline.destination);
  sourceNode.start(0, start, sourceDuration);

  return await offline.startRendering();
};

/**
 * Creates an audio timeline with multiple segments
 */
const createAudioTimeline = async (
  segments: AudioSegment[],
  duration: number
): Promise<AudioBuffer> => {
  const OfflineAudioContextCtor: typeof OfflineAudioContext =
    (window as any).OfflineAudioContext ||
    (window as any).webkitOfflineAudioContext;
  if (!OfflineAudioContextCtor)
    throw new Error("OfflineAudioContext not supported");

  const sampleRate = 44100; // Standard sample rate
  const totalFrames = Math.ceil(duration * sampleRate);
  const offline = new OfflineAudioContextCtor(2, totalFrames, sampleRate); // Stereo output

  // Process each segment
  for (const segment of segments) {
    if (segment.s >= segment.e) {
      console.warn(
        `Invalid segment: start (${segment.s}) >= end (${segment.e})`
      );
      continue;
    }

    // Skip segments with volume 0 (muted)
    const volume = segment.volume ?? 1;
    if (volume <= 0) {
      console.warn(`Skipping muted segment: ${segment.src}`);
      continue;
    }

    try {
      const audioBuffer = await fetchAndDecodeAudio(segment.src);
      const segmentDuration = segment.e - segment.s;
      const sourceDuration = Math.min(segmentDuration, audioBuffer.duration);

      const source = offline.createBufferSource();
      source.buffer = audioBuffer;

      // Apply volume control if not 1.0
      if (volume !== 1) {
        const gainNode = offline.createGain();
        gainNode.gain.value = volume;
        source.connect(gainNode);
        gainNode.connect(offline.destination);
      } else {
        source.connect(offline.destination);
      }

      source.start(segment.s, 0, sourceDuration);
    } catch (error) {
      console.warn(`Failed to process segment: ${segment.src}`, error);
    }
  }

  return await offline.startRendering();
};

/**
 * Converts an AudioBuffer to an MP3 Blob
 * 
 * TODO: Replace with WASM encoder for 20-50x speedup
 * For now, falls back to WAV format
 */
const audioBufferToMp3 = async (buffer: AudioBuffer): Promise<Blob> => {
  // TODO Week 9-10: Implement WASM MP3 encoder
  // For now, fallback to WAV
  console.warn("WASM MP3 encoder not yet implemented, using WAV fallback");
  return audioBufferToWavBlob(buffer);
};

/**
 * Converts an AudioBuffer to a WAV Blob (fallback)
 */
const audioBufferToWavBlob = (buffer: AudioBuffer): Blob => {
  const arrayBuffer = audioBufferToWavArrayBuffer(buffer);
  return new Blob([arrayBuffer], { type: "audio/wav" });
};

/**
 * Converts AudioBuffer to WAV ArrayBuffer
 */
const audioBufferToWavArrayBuffer = (buffer: AudioBuffer): ArrayBuffer => {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const numFrames = buffer.length;

  // Interleave channels
  const interleaved = interleave(buffer, numChannels, numFrames);

  // Create WAV ArrayBuffer
  const bytesPerSample = 2; // 16-bit
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = interleaved.length * bytesPerSample;
  const bufferSize = 44 + dataSize;
  const arrayBuffer = new ArrayBuffer(bufferSize);
  const view = new DataView(arrayBuffer);

  // RIFF header
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");

  // fmt chunk
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true); // PCM
  view.setUint16(20, 1, true); // audio format = 1 (PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true); // bits per sample

  // data chunk
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  // PCM samples
  floatTo16BitPCM(view, 44, interleaved);

  return arrayBuffer;
};

/**
 * Downsamples an AudioBuffer to a lower sample rate for smaller file size
 */
export const downsampleAudioBuffer = (
  buffer: AudioBuffer,
  targetSampleRate: number
): AudioBuffer => {
  if (buffer.sampleRate === targetSampleRate) {
    return buffer;
  }

  const ratio = buffer.sampleRate / targetSampleRate;
  const newLength = Math.round(buffer.length / ratio);
  const newBuffer = new AudioContext().createBuffer(
    buffer.numberOfChannels,
    newLength,
    targetSampleRate
  );

  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const oldData = buffer.getChannelData(channel);
    const newData = newBuffer.getChannelData(channel);

    for (let i = 0; i < newLength; i++) {
      const oldIndex = Math.floor(i * ratio);
      const sample = oldData[oldIndex];
      if (sample !== undefined) {
        newData[i] = sample;
      }
    }
  }

  return newBuffer;
};

/**
 * Interleaves audio channels
 */
const interleave = (
  buffer: AudioBuffer,
  numChannels: number,
  numFrames: number
): Float32Array => {
  if (numChannels === 1) {
    return buffer.getChannelData(0).slice(0, numFrames);
  }
  const result = new Float32Array(numFrames * numChannels);
  const channelData: Float32Array[] = [];
  for (let ch = 0; ch < numChannels; ch++) {
    channelData[ch] = buffer.getChannelData(ch);
  }
  let writeIndex = 0;
  for (let i = 0; i < numFrames; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const channelArray = channelData[ch];
      const sample = channelArray?.[i];
      if (sample !== undefined) {
        result[writeIndex++] = sample;
      }
    }
  }
  return result;
};

/**
 * Converts float32 audio data to 16-bit PCM
 */
const floatTo16BitPCM = (
  view: DataView,
  offset: number,
  input: Float32Array
): void => {
  let pos = offset;
  for (let i = 0; i < input.length; i++, pos += 2) {
    const sample = input[i] ?? 0;
    const s = Math.max(-1, Math.min(1, sample));
    view.setInt16(pos, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
};

/**
 * Writes string to DataView
 */
const writeString = (view: DataView, offset: number, str: string): void => {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
};
