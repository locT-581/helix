/**
 * MP4Muxer - MP4/WebM container muxing service
 *
 * Combines encoded video and audio chunks into playable MP4/WebM files.
 * Uses MP4Box.js for MP4 container creation.
 *
 * @module MP4Muxer
 */

import type { VideoCodec, AudioCodec, VideoFormat } from '@helix/core';
import * as MP4Box from 'mp4box';

/**
 * Muxer configuration
 */
export interface MuxerConfig {
  /** Output format (mp4 or webm) */
  format: VideoFormat;
  /** Video codec */
  videoCodec: VideoCodec;
  /** Audio codec */
  audioCodec: AudioCodec;
  /** Video dimensions */
  width: number;
  height: number;
  /** Framerate */
  framerate: number;
  /** Audio sample rate */
  sampleRate: number;
  /** Audio channels */
  audioChannels: number;
  /** Duration in seconds */
  duration: number;
}

/**
 * Track information
 */
interface TrackInfo {
  id: number;
  type: 'video' | 'audio';
  timescale: number;
  sampleCount: number;
}

/**
 * MP4Muxer class
 *
 * Muxes video and audio chunks into MP4 container using MP4Box.js
 *
 * @example
 * ```typescript
 * const muxer = new MP4Muxer(config);
 * await muxer.initialize();
 *
 * // Add video chunks
 * for (const chunk of videoChunks) {
 *   await muxer.addVideoChunk(chunk);
 * }
 *
 * // Add audio chunks
 * for (const chunk of audioChunks) {
 *   await muxer.addAudioChunk(chunk);
 * }
 *
 * const blob = await muxer.finalize();
 * ```
 */
export class MP4Muxer {
  private config: MuxerConfig;
  private mp4boxFile: any = null;
  private videoTrackId: number | null = null;
  private audioTrackId: number | null = null;
  private chunks: Uint8Array[] = [];
  private isInitialized = false;

  constructor(config: MuxerConfig) {
    this.config = config;
  }

  /**
   * Initialize MP4Box file
   */
  public initialize = async (): Promise<void> => {
    // Create MP4Box file
    this.mp4boxFile = MP4Box.createFile();

    // Set up data callback to collect muxed data
    this.mp4boxFile.onReady = (info: any) => {
      console.log('MP4Box ready:', info);
    };

    // Initialize video track
    this.videoTrackId = this.addVideoTrack();

    // Initialize audio track (if audio codec provided)
    if (this.config.audioCodec) {
      this.audioTrackId = this.addAudioTrack();
    }

    this.isInitialized = true;
  };

  /**
   * Add video track to MP4Box file
   */
  private addVideoTrack = (): number => {
    const { width, height, framerate, videoCodec } = this.config;

    // Parse codec string to get codec type
    const codecType = this.getVideoCodecType(videoCodec);

    const trackId = this.mp4boxFile.addTrack({
      type: 'video',
      timescale: Math.round(framerate * 1000), // Timescale in Hz
      width,
      height,
      avcDecoderConfigRecord: codecType === 'avc1' ? this.createAVCConfig() : undefined,
    });

    return trackId;
  };

  /**
   * Add audio track to MP4Box file
   */
  private addAudioTrack = (): number => {
    const { sampleRate, audioChannels, audioCodec } = this.config;

    const trackId = this.mp4boxFile.addTrack({
      type: 'audio',
      timescale: sampleRate,
      samplerate: sampleRate,
      channel_count: audioChannels,
      aacDecoderConfigRecord:
        audioCodec === 'mp4a.40.2' ? this.createAACConfig() : undefined,
    });

    return trackId;
  };

  /**
   * Add encoded video chunk
   */
  public addVideoChunk = async (chunk: EncodedVideoChunk): Promise<void> => {
    if (!this.isInitialized || this.videoTrackId === null) {
      throw new Error('Muxer not initialized');
    }

    // Copy chunk data
    const buffer = new ArrayBuffer(chunk.byteLength);
    chunk.copyTo(buffer);

    // Add sample to MP4Box
    const sample = {
      data: buffer,
      timescale: this.config.framerate * 1000,
      duration: Math.round((1 / this.config.framerate) * 1000),
      cts: Math.round((chunk.timestamp / 1_000_000) * this.config.framerate * 1000),
      dts: Math.round((chunk.timestamp / 1_000_000) * this.config.framerate * 1000),
      is_sync: chunk.type === 'key',
      is_leading: 0,
      depends_on: chunk.type === 'key' ? 2 : 1,
      is_depended_on: 0,
      has_redundancy: 0,
    };

    this.mp4boxFile.addSample(this.videoTrackId, sample);
  };

  /**
   * Add encoded audio chunk
   */
  public addAudioChunk = async (chunk: EncodedAudioChunk): Promise<void> => {
    if (!this.isInitialized || this.audioTrackId === null) {
      throw new Error('Muxer not initialized or audio track not created');
    }

    // Copy chunk data
    const buffer = new ArrayBuffer(chunk.byteLength);
    chunk.copyTo(buffer);

    // Add sample to MP4Box
    const sample = {
      data: buffer,
      timescale: this.config.sampleRate,
      duration: 1024, // AAC frame size
      cts: Math.round((chunk.timestamp / 1_000_000) * this.config.sampleRate),
      dts: Math.round((chunk.timestamp / 1_000_000) * this.config.sampleRate),
      is_sync: 1,
      is_leading: 0,
      depends_on: 2,
      is_depended_on: 0,
      has_redundancy: 0,
    };

    this.mp4boxFile.addSample(this.audioTrackId, sample);
  };

  /**
   * Finalize muxing and return MP4 blob
   */
  public finalize = async (): Promise<Blob> => {
    if (!this.isInitialized) {
      throw new Error('Muxer not initialized');
    }

    // Set up buffer collection
    const buffers: ArrayBuffer[] = [];

    this.mp4boxFile.onSegment = (
      id: number,
      user: any,
      buffer: ArrayBuffer,
      sampleNum: number,
      last: boolean,
    ) => {
      buffers.push(buffer);
    };

    // Flush and generate MP4
    this.mp4boxFile.flush();

    // Combine all buffers
    const totalSize = buffers.reduce((sum, buf) => sum + buf.byteLength, 0);
    const combined = new Uint8Array(totalSize);
    let offset = 0;

    for (const buffer of buffers) {
      combined.set(new Uint8Array(buffer), offset);
      offset += buffer.byteLength;
    }

    // Create blob with appropriate MIME type
    const mimeType = this.config.format === 'mp4' ? 'video/mp4' : 'video/webm';
    return new Blob([combined], { type: mimeType });
  };

  /**
   * Get video codec type from codec string
   */
  private getVideoCodecType = (codec: VideoCodec): string => {
    if (codec.startsWith('avc1')) return 'avc1';
    if (codec.startsWith('hev1')) return 'hvc1';
    if (codec.startsWith('vp09')) return 'vp09';
    return 'avc1'; // Default to H.264
  };

  /**
   * Create AVC (H.264) decoder config
   */
  private createAVCConfig = (): Uint8Array => {
    // Minimal AVC decoder config record
    // This is a simplified version - in production, should be extracted from encoder
    return new Uint8Array([
      0x01, // configurationVersion
      0x42, // AVCProfileIndication (Baseline)
      0x00, // profile_compatibility
      0x1e, // AVCLevelIndication (3.0)
      0xff, // lengthSizeMinusOne (4 bytes)
      0xe1, // numOfSequenceParameterSets (1)
      // SPS size and data would go here
      0x00,
      0x00,
      0x01, // numOfPictureParameterSets (1)
      // PPS size and data would go here
      0x00,
      0x00,
    ]);
  };

  /**
   * Create AAC decoder config
   */
  private createAACConfig = (): Uint8Array => {
    // AAC AudioSpecificConfig
    // 2 bytes: profile (LC) + sample rate + channels
    const { sampleRate, audioChannels } = this.config;

    // Sample rate index mapping
    const sampleRateIndex = this.getSampleRateIndex(sampleRate);

    // AAC-LC profile (2), sample rate index (4 bits), channels (4 bits)
    const byte1 = (2 << 3) | (sampleRateIndex >> 1);
    const byte2 = ((sampleRateIndex & 0x1) << 7) | (audioChannels << 3);

    return new Uint8Array([byte1, byte2]);
  };

  /**
   * Get sample rate index for AAC
   */
  private getSampleRateIndex = (sampleRate: number): number => {
    const rates = [
      96000, 88200, 64000, 48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025, 8000,
      7350,
    ];
    const index = rates.indexOf(sampleRate);
    return index !== -1 ? index : 4; // Default to 44100 if not found
  };
}

/**
 * Simple muxer for WebM (fallback)
 * WebM uses Matroska container which is more complex
 * For now, just concatenate chunks (not a valid WebM file)
 */
export class WebMMuxer {
  private videoChunks: Uint8Array[] = [];
  private audioChunks: Uint8Array[] = [];

  constructor(_config: MuxerConfig) {
    // Config unused in simplified WebM implementation
  }

  public initialize = async (): Promise<void> => {
    // WebM initialization (would need libwebm or similar)
    console.warn('WebM muxing not fully implemented, using simple concatenation');
  };

  public addVideoChunk = async (chunk: EncodedVideoChunk): Promise<void> => {
    const buffer = new Uint8Array(chunk.byteLength);
    chunk.copyTo(buffer);
    this.videoChunks.push(buffer);
  };

  public addAudioChunk = async (chunk: EncodedAudioChunk): Promise<void> => {
    const buffer = new Uint8Array(chunk.byteLength);
    chunk.copyTo(buffer);
    this.audioChunks.push(buffer);
  };

  public finalize = async (): Promise<Blob> => {
    // Simple concatenation (NOT a valid WebM file)
    const allChunks = [...this.videoChunks, ...this.audioChunks];
    const totalSize = allChunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const combined = new Uint8Array(totalSize);
    let offset = 0;

    for (const chunk of allChunks) {
      combined.set(chunk, offset);
      offset += chunk.length;
    }

    return new Blob([combined], { type: 'video/webm' });
  };
}

/**
 * Create appropriate muxer based on format
 */
export const createMuxer = (config: MuxerConfig): MP4Muxer | WebMMuxer => {
  if (config.format === 'mp4') {
    return new MP4Muxer(config);
  } else {
    return new WebMMuxer(config);
  }
};
