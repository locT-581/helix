import { useState, useCallback, useRef } from 'react';
import { ExportEngine, type TimelineData } from '../services/export-engine';
import type { ExportConfig, ExportProgress, ExportResult, ExportEvent } from '@helix/core';

/**
 * useExportManager Hook
 * 
 * Manages video export workflow integration with timeline and canvas.
 * Handles ExportEngine lifecycle, progress tracking, and result handling.
 * 
 * @example
 * ```tsx
 * const { startExport, cancelExport, exportProgress, exportResult } = useExportManager({
 *   timelineData: timeline,
 *   canvasRef: canvasRef,
 *   onComplete: (result) => downloadVideo(result),
 * });
 * 
 * <Button onClick={() => startExport(config)}>Export Video</Button>
 * ```
 */

export interface UseExportManagerOptions {
  /** Timeline data (tracks, elements) */
  timelineData?: TimelineData;
  
  /** Canvas reference for rendering */
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  
  /** Callback when export completes successfully */
  onComplete?: (result: ExportResult) => void;
  
  /** Callback when export fails */
  onError?: (error: Error) => void;
  
  /** Callback when export is cancelled */
  onCancel?: () => void;
}

export interface UseExportManagerReturn {
  /** Start export with configuration */
  startExport: (config: ExportConfig) => Promise<void>;
  
  /** Cancel ongoing export */
  cancelExport: () => void;
  
  /** Retry failed export */
  retryExport: () => Promise<void>;
  
  /** Current export progress */
  exportProgress: ExportProgress | undefined;
  
  /** Export result (when completed) */
  exportResult: ExportResult | undefined;
  
  /** Whether export is in progress */
  isExporting: boolean;
  
  /** Download exported video */
  downloadVideo: (filename?: string) => void;
}

export const useExportManager = ({
  timelineData,
  canvasRef,
  onComplete,
  onError,
  onCancel,
}: UseExportManagerOptions = {}): UseExportManagerReturn => {
  const [exportProgress, setExportProgress] = useState<ExportProgress | undefined>();
  const [exportResult, setExportResult] = useState<ExportResult | undefined>();
  const [lastConfig, setLastConfig] = useState<ExportConfig | null>(null);
  const exportEngineRef = useRef<ExportEngine | null>(null);
  
  const isExporting = exportProgress?.state === 'initializing' ||
    exportProgress?.state === 'encoding' ||
    exportProgress?.state === 'muxing';
  
  /**
   * Start export with configuration
   */
  const startExport = useCallback(async (config: ExportConfig) => {
    try {
      // Validate prerequisites
      if (!timelineData) {
        throw new Error('Timeline data is required for export');
      }
      
      if (!canvasRef?.current) {
        throw new Error('Canvas reference is required for rendering');
      }
      
      // Save config for retry
      setLastConfig(config);
      
      // Reset previous result
      setExportResult(undefined);
      setExportProgress({
        state: 'idle',
        progress: 0,
      });
      
      // Create ExportEngine instance
      const engine = new ExportEngine(config, timelineData);
      exportEngineRef.current = engine;
      
      // Register progress event handler
      engine.on('progress', (event) => {
        if (event.progress) {
          setExportProgress(event.progress);
        }
      });
      
      // Register complete event handler
      engine.on('complete', (event) => {
        if (event.result) {
          setExportProgress({
            state: 'completed',
            progress: 1,
          });
          setExportResult(event.result);
          onComplete?.(event.result);
        }
      });
      
      // Register error event handler
      engine.on('error', (event) => {
        if (event.error) {
          setExportProgress({
            state: 'error',
            progress: exportProgress?.progress || 0,
            error: event.error,
          });
          onError?.(event.error);
        }
      });
      
      // Start export
      const result = await engine.export();
      
      // If successful, result is returned
      if (result) {
        setExportResult(result);
      }
      
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error occurred');
      setExportProgress({
        state: 'error',
        progress: exportProgress?.progress || 0,
        error: err,
      });
      onError?.(err);
    }
  }, [timelineData, canvasRef, exportProgress, onComplete, onError]);
  
  /**
   * Cancel ongoing export
   */
  const cancelExport = useCallback(() => {
    if (exportEngineRef.current && isExporting) {
      exportEngineRef.current.cancel();
      setExportProgress({
        state: 'cancelled',
        progress: exportProgress?.progress || 0,
      });
      onCancel?.();
    }
  }, [isExporting, exportProgress, onCancel]);
  
  /**
   * Retry failed export with last configuration
   */
  const retryExport = useCallback(async () => {
    if (lastConfig) {
      await startExport(lastConfig);
    }
  }, [lastConfig, startExport]);
  
  /**
   * Download exported video
   */
  const downloadVideo = useCallback((filename?: string) => {
    if (!exportResult?.url) {
      console.warn('No export result available for download');
      return;
    }
    
    const link = document.createElement('a');
    link.href = exportResult.url;
    link.download = filename || `helix-video-${Date.now()}.${exportResult.config.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [exportResult]);
  
  return {
    startExport,
    cancelExport,
    retryExport,
    exportProgress,
    exportResult,
    isExporting,
    downloadVideo,
  };
};
