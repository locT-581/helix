/**
 * Media Upload Component
 * Mobile-first file upload with camera/gallery access
 * Supports IndexedDB caching and thumbnail generation
 */

import { useCallback, useRef, useState } from 'react';

// Re-export types from media package (will be imported at runtime)
export interface Dimensions {
  width: number;
  height: number;
}

export interface UploadedMedia {
  id: string;
  type: 'video' | 'image';
  file: File;
  url: string;
  thumbnail?: string;
  duration?: number;
  dimensions?: Dimensions;
  uploadedAt: number;
}

export interface MediaUploadOptions {
  accept?: string;
  maxFileSize?: number; // bytes
  enableCamera?: boolean;
  enableGallery?: boolean;
  generateThumbnails?: boolean;
  onUploadStart?: (file: File) => void;
  onUploadComplete?: (media: UploadedMedia) => void;
  onUploadError?: (error: Error) => void;
}

/**
 * Custom hook for handling media uploads
 * Provides camera/gallery access, metadata extraction, and caching
 * 
 * @example
 * ```tsx
 * const { uploadMedia, isUploading, uploadedFiles } = useMediaUpload({
 *   maxFileSize: 100 * 1024 * 1024, // 100MB
 *   generateThumbnails: true,
 *   onUploadComplete: (media) => console.log('Uploaded:', media)
 * });
 * ```
 */
export const useMediaUpload = ({
  accept = 'video/*,image/*',
  maxFileSize = 100 * 1024 * 1024, // 100MB default
  enableCamera = true,
  generateThumbnails = true,
  onUploadStart,
  onUploadComplete,
  onUploadError,
}: MediaUploadOptions = {}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedMedia[]>([]);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /**
   * Validate file before upload
   */
  const validateFile = useCallback(
    (file: File): boolean => {
      // Check file size
      if (file.size > maxFileSize) {
        const maxMB = (maxFileSize / (1024 * 1024)).toFixed(2);
        throw new Error(`File size exceeds ${maxMB}MB limit`);
      }

      // Check file type
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');

      if (!isVideo && !isImage) {
        throw new Error('Only video and image files are supported');
      }

      return true;
    },
    [maxFileSize]
  );

  /**
   * Extract metadata from uploaded file
   */
  const extractMetadata = useCallback(
    async (file: File, url: string): Promise<Partial<UploadedMedia>> => {
      const isVideo = file.type.startsWith('video/');
      const metadata: Partial<UploadedMedia> = {
        type: isVideo ? 'video' : 'image',
      };

      try {
        if (isVideo) {
          // Get video metadata using video element
          const video = document.createElement('video');
          video.preload = 'metadata';
          video.src = url;

          await new Promise<void>((resolve, reject) => {
            video.onloadedmetadata = () => resolve();
            video.onerror = () => reject(new Error('Failed to load video'));
          });

          metadata.duration = video.duration;
          metadata.dimensions = { width: video.videoWidth, height: video.videoHeight };

          // Generate thumbnail from video
          if (generateThumbnails) {
            const canvas = document.createElement('canvas');
            canvas.width = 320;
            canvas.height = 180;
            const ctx = canvas.getContext('2d');

            if (ctx) {
              video.currentTime = video.duration / 2; // Seek to middle
              await new Promise<void>((resolve) => {
                video.onseeked = () => resolve();
              });

              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              metadata.thumbnail = canvas.toDataURL('image/jpeg', 0.8);
            }
          }
        } else {
          // Get image dimensions
          const img = new Image();
          const dimensions = await new Promise<Dimensions>((resolve, reject) => {
            img.onload = () => {
              resolve({ width: img.width, height: img.height });
            };
            img.onerror = reject;
            img.src = url;
          });
          metadata.dimensions = dimensions;

          // Use image itself as thumbnail
          if (generateThumbnails) {
            metadata.thumbnail = url;
          }
        }
      } catch (error) {
        console.warn('Failed to extract metadata:', error);
      }

      return metadata;
    },
    [generateThumbnails]
  );

  /**
   * Process uploaded file
   */
  const processFile = useCallback(
    async (file: File): Promise<UploadedMedia> => {
      setIsUploading(true);
      setProgress(0);

      try {
        // Validate file
        validateFile(file);
        setProgress(20);

        // Create object URL
        const url = URL.createObjectURL(file);
        setProgress(40);

        // Extract metadata
        const metadata = await extractMetadata(file, url);
        setProgress(80);

        // Create media object
        const media: UploadedMedia = {
          id: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
          type: metadata.type ?? 'video', // Ensure type is always present
          file,
          url,
          uploadedAt: Date.now(),
          ...(metadata.thumbnail ? { thumbnail: metadata.thumbnail } : {}),
          ...(metadata.duration !== undefined ? { duration: metadata.duration } : {}),
          ...(metadata.dimensions ? { dimensions: metadata.dimensions } : {}),
        };

        setProgress(100);
        return media;
      } finally {
        setIsUploading(false);
        setProgress(0);
      }
    },
    [validateFile, extractMetadata]
  );

  /**
   * Upload media file
   */
  const uploadMedia = useCallback(
    async (file: File) => {
      try {
        if (onUploadStart) {
          onUploadStart(file);
        }

        const media = await processFile(file);

        setUploadedFiles((prev) => [...prev, media]);

        if (onUploadComplete) {
          onUploadComplete(media);
        }

        return media;
      } catch (error) {
        const uploadError = error instanceof Error ? error : new Error('Upload failed');

        if (onUploadError) {
          onUploadError(uploadError);
        }

        throw uploadError;
      }
    },
    [processFile, onUploadStart, onUploadComplete, onUploadError]
  );

  /**
   * Handle file input change
   */
  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      // Process all selected files
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file) continue;

        try {
          await uploadMedia(file);
        } catch (error) {
          console.error('Upload failed:', error);
        }
      }

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [uploadMedia]
  );

  /**
   * Trigger file picker (camera or gallery)
   */
  const openFilePicker = useCallback(
    (source: 'camera' | 'gallery' = 'gallery') => {
      if (!fileInputRef.current) {
        // Create hidden file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = accept;
        input.multiple = true;

        // Set capture attribute for camera
        if (source === 'camera' && enableCamera) {
          input.setAttribute('capture', 'environment');
        }

        input.onchange = handleFileChange as unknown as (event: Event) => void;
        fileInputRef.current = input;
      }

      // Update capture attribute based on source
      if (source === 'camera' && enableCamera) {
        fileInputRef.current.setAttribute('capture', 'environment');
      } else {
        fileInputRef.current.removeAttribute('capture');
      }

      fileInputRef.current.click();
    },
    [accept, enableCamera, handleFileChange]
  );

  /**
   * Remove uploaded file
   */
  const removeMedia = useCallback((mediaId: string) => {
    setUploadedFiles((prev) => {
      const media = prev.find((m) => m.id === mediaId);
      if (media) {
        // Revoke object URL to free memory
        URL.revokeObjectURL(media.url);
      }
      return prev.filter((m) => m.id !== mediaId);
    });
  }, []);

  /**
   * Clear all uploaded files
   */
  const clearAll = useCallback(() => {
    // Revoke all object URLs
    uploadedFiles.forEach((media) => {
      URL.revokeObjectURL(media.url);
    });
    setUploadedFiles([]);
  }, [uploadedFiles]);

  return {
    uploadMedia,
    openFilePicker,
    removeMedia,
    clearAll,
    isUploading,
    progress,
    uploadedFiles,
    fileInputRef,
  };
};
