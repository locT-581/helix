import { useState, useEffect } from 'react';
import { styled } from '@helix/ui';
import { Select, SelectItem, SelectGroup, SelectGroupLabel } from '@helix/ui';
import { Button } from '@helix/ui';
import { Switch } from '@helix/ui';
import { BottomSheet } from '../BottomSheet';
import type { ExportConfig, ExportQuality, VideoFormat, ExportProgress, ExportState } from '@helix/core';
import { QUALITY_PRESETS, RESOLUTION_DIMENSIONS } from '@helix/core';

/**
 * ExportBottomSheet Component
 * 
 * Mobile-first export settings panel with quality presets, format options,
 * and real-time progress tracking. Supports cancel/retry functionality.
 * 
 * Reuses BottomSheet, Select, Button, Switch from existing Helix components.
 * 
 * @example
 * ```tsx
 * <ExportBottomSheet
 *   isOpen={isExportOpen}
 *   onClose={() => setIsExportOpen(false)}
 *   onExport={(config) => handleExport(config)}
 *   exportProgress={currentProgress}
 *   onCancel={() => cancelExport()}
 * />
 * ```
 */

export interface ExportBottomSheetProps {
  /** Whether the sheet is open */
  isOpen: boolean;
  
  /** Callback when sheet should close */
  onClose: () => void;
  
  /** Callback when export starts with config */
  onExport: (config: ExportConfig) => void;
  
  /** Current export progress (if exporting) */
  exportProgress?: ExportProgress | undefined;
  
  /** Callback to cancel ongoing export */
  onCancel?: () => void;
  
  /** Callback to retry failed export */
  onRetry?: () => void;
}

// Styled Components (Mobile-optimized)

const SheetHeader = styled('div', {
  padding: '$4 0 $3',
  borderBottom: '1px solid $border',
  marginBottom: '$4',
});

const SheetTitle = styled('h2', {
  fontSize: '$xl',
  fontWeight: '$bold',
  color: '$textPrimary',
  margin: 0,
  textAlign: 'center',
});

const SettingsSection = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
  marginBottom: '$6',
});

const SettingRow = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
});

const SettingLabel = styled('label', {
  fontSize: '$sm',
  fontWeight: '$medium',
  color: '$textPrimary',
});

const SettingDescription = styled('p', {
  fontSize: '$xs',
  color: '$textSecondary',
  margin: 0,
  lineHeight: 1.4,
});

const PresetGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '$3',
  marginTop: '$2',
});

const PresetCard = styled('button', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '$3',
  backgroundColor: '$surface',
  border: '2px solid $border',
  borderRadius: '$2',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  
  // Minimum touch target (WCAG AAA)
  minHeight: '$11', // 44px
  
  '&:active': {
    transform: 'scale(0.98)',
  },
  
  variants: {
    selected: {
      true: {
        borderColor: '$primary',
        backgroundColor: 'rgba(124, 58, 237, 0.1)', // primary with alpha
      },
    },
  },
});

const PresetName = styled('div', {
  fontSize: '$md',
  fontWeight: '$semibold',
  color: '$textPrimary',
  marginBottom: '$1',
});

const PresetDetails = styled('div', {
  fontSize: '$xs',
  color: '$textSecondary',
  lineHeight: 1.3,
});

const ProgressContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',
  padding: '$4',
  backgroundColor: '$background',
  borderRadius: '$2',
  marginBottom: '$4',
});

const ProgressHeader = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const ProgressState = styled('div', {
  fontSize: '$sm',
  fontWeight: '$medium',
  color: '$textPrimary',
  
  variants: {
    state: {
      exporting: { color: '$primary' },
      completed: { color: '$success' },
      error: { color: '$error' },
      cancelled: { color: '$textSecondary' },
    },
  },
});

const ProgressPercentage = styled('div', {
  fontSize: '$lg',
  fontWeight: '$bold',
  color: '$textPrimary',
});

const ProgressBar = styled('div', {
  width: '100%',
  height: '$2', // 8px
  backgroundColor: '$border',
  borderRadius: '$full',
  overflow: 'hidden',
});

const ProgressFill = styled('div', {
  height: '100%',
  backgroundColor: '$primary',
  transition: 'width 0.3s ease',
  borderRadius: '$full',
  
  variants: {
    state: {
      exporting: { backgroundColor: '$primary' },
      completed: { backgroundColor: '$success' },
      error: { backgroundColor: '$error' },
    },
  },
});

const ProgressStats = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '$xs',
  color: '$textSecondary',
});

const ActionButtons = styled('div', {
  display: 'flex',
  gap: '$3',
  marginTop: '$4',
});

const ErrorMessage = styled('div', {
  padding: '$3',
  backgroundColor: 'rgba(239, 68, 68, 0.1)', // error with alpha
  borderRadius: '$2',
  marginBottom: '$3',
  
  fontSize: '$sm',
  color: '$error',
  lineHeight: 1.5,
});

// Helper functions

const getStateLabel = (state: ExportState): string => {
  switch (state) {
    case 'idle':
      return 'Ready to export';
    case 'initializing':
      return 'Initializing...';
    case 'rendering-video':
      return 'Rendering video...';
    case 'mixing-audio':
      return 'Mixing audio...';
    case 'muxing':
      return 'Finalizing...';
    case 'completed':
      return 'Export completed!';
    case 'error':
      return 'Export failed';
    case 'cancelled':
      return 'Export cancelled';
    default:
      return 'Processing...';
  }
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const ExportBottomSheet = ({
  isOpen,
  onClose,
  onExport,
  exportProgress,
  onCancel,
  onRetry,
}: ExportBottomSheetProps) => {
  // Export settings state
  const [quality, setQuality] = useState<ExportQuality>('medium');
  const [format, setFormat] = useState<VideoFormat>('mp4');
  const [hardwareAcceleration, setHardwareAcceleration] = useState(true);
  
  const isExporting = exportProgress && 
    ['initializing', 'rendering-video', 'mixing-audio', 'muxing'].includes(exportProgress.state);
  const isCompleted = exportProgress?.state === 'completed';
  const hasError = exportProgress?.state === 'error';
  
  // Reset state when sheet opens
  useEffect(() => {
    if (isOpen && !exportProgress) {
      setQuality('medium');
      setFormat('mp4');
      setHardwareAcceleration(true);
    }
  }, [isOpen, exportProgress]);
  
  const handleExport = () => {
    const config: ExportConfig = {
      quality,
      format,
      hardwareAcceleration,
    };
    
    onExport(config);
  };
  
  const handleDownload = () => {
    if (exportProgress?.result?.url) {
      const a = document.createElement('a');
      a.href = exportProgress.result.url;
      a.download = `helix-video-${Date.now()}.${format}`;
      a.click();
    }
  };
  
  // Get preset details for UI
  const preset = QUALITY_PRESETS[quality];
  const dimensions = RESOLUTION_DIMENSIONS[preset.resolution];
  
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      snapPoints={[0.8, 0.95]}
      initialSnapPoint={0}
      showBackdrop
      showDragHandle
    >
      <SheetHeader>
        <SheetTitle>
          {isExporting ? 'Exporting Video...' : 'Export Settings'}
        </SheetTitle>
      </SheetHeader>
      
      {/* Export Progress (when exporting) */}
      {exportProgress && (
        <ProgressContainer>
          <ProgressHeader>
            <ProgressState state={exportProgress.state}>
              {getStateLabel(exportProgress.state)}
            </ProgressState>
            <ProgressPercentage>
              {Math.round(exportProgress.progress * 100)}%
            </ProgressPercentage>
          </ProgressHeader>
          
          <ProgressBar>
            <ProgressFill 
              state={exportProgress.state}
              style={{ width: `${exportProgress.progress * 100}%` }}
            />
          </ProgressBar>
          
          {exportProgress.currentFrame !== undefined && exportProgress.totalFrames !== undefined && (
            <ProgressStats>
              <span>
                Frame {exportProgress.currentFrame} / {exportProgress.totalFrames}
              </span>
              {exportProgress.estimatedTimeRemaining && (
                <span>
                  {formatTime(exportProgress.estimatedTimeRemaining)} remaining
                </span>
              )}
            </ProgressStats>
          )}
          
          {hasError && exportProgress.error && (
            <ErrorMessage>
              {exportProgress.error}
            </ErrorMessage>
          )}
        </ProgressContainer>
      )}
      
      {/* Settings (when not exporting or completed) */}
      {!isExporting && (
        <SettingsSection>
          {/* Quality Preset Selection */}
          <SettingRow>
            <SettingLabel>Quality Preset</SettingLabel>
            <SettingDescription>
              Higher quality produces larger files and takes longer to export
            </SettingDescription>
            
            <PresetGrid>
              <PresetCard
                selected={quality === 'low'}
                onClick={() => setQuality('low')}
              >
                <PresetName>Low</PresetName>
                <PresetDetails>
                  720p • 30fps<br />
                  2.5 Mbps
                </PresetDetails>
              </PresetCard>
              
              <PresetCard
                selected={quality === 'medium'}
                onClick={() => setQuality('medium')}
              >
                <PresetName>Medium</PresetName>
                <PresetDetails>
                  1080p • 30fps<br />
                  5 Mbps
                </PresetDetails>
              </PresetCard>
              
              <PresetCard
                selected={quality === 'high'}
                onClick={() => setQuality('high')}
              >
                <PresetName>High</PresetName>
                <PresetDetails>
                  1080p • 60fps<br />
                  8 Mbps
                </PresetDetails>
              </PresetCard>
              
              <PresetCard
                selected={quality === 'ultra'}
                onClick={() => setQuality('ultra')}
              >
                <PresetName>Ultra</PresetName>
                <PresetDetails>
                  4K • 60fps<br />
                  20 Mbps
                </PresetDetails>
              </PresetCard>
            </PresetGrid>
          </SettingRow>
          
          {/* Format Selection */}
          <SettingRow>
            <Select
              label="Video Format"
              value={format}
              onValueChange={(value) => setFormat(value as VideoFormat)}
            >
              <SelectGroup>
                <SelectGroupLabel>Formats</SelectGroupLabel>
                <SelectItem value="mp4">
                  MP4 (Best compatibility)
                </SelectItem>
                <SelectItem value="webm">
                  WebM (Smaller file size)
                </SelectItem>
              </SelectGroup>
            </Select>
            <SettingDescription>
              {format === 'mp4' 
                ? 'H.264 + AAC - Works on all devices and platforms'
                : 'VP9 + Opus - Better compression, Chrome/Android native'}
            </SettingDescription>
          </SettingRow>
          
          {/* Hardware Acceleration */}
          <SettingRow>
            <Switch
              label="Hardware Acceleration"
              description="Use GPU for faster encoding (if available)"
              checked={hardwareAcceleration}
              onCheckedChange={setHardwareAcceleration}
              fullWidth
            />
          </SettingRow>
          
          {/* Export Info Summary */}
          <SettingRow>
            <SettingDescription style={{ marginTop: '$2' }}>
              📹 Resolution: {dimensions.width}x{dimensions.height}<br />
              🎬 Framerate: {preset.framerate} fps<br />
              💾 Estimated size: ~{Math.round((preset.videoBitrate + preset.audioBitrate) * 10 / 8)} MB/min
            </SettingDescription>
          </SettingRow>
        </SettingsSection>
      )}
      
      {/* Action Buttons */}
      <ActionButtons>
        {!isExporting && !isCompleted && (
          <>
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleExport}
            >
              Start Export
            </Button>
          </>
        )}
        
        {isExporting && (
          <>
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={onClose}
              disabled
            >
              Close
            </Button>
            <Button
              variant="danger"
              size="lg"
              fullWidth
              onClick={onCancel}
            >
              Cancel Export
            </Button>
          </>
        )}
        
        {isCompleted && (
          <>
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleDownload}
            >
              Download Video
            </Button>
          </>
        )}
        
        {hasError && (
          <>
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={onRetry}
            >
              Retry Export
            </Button>
          </>
        )}
      </ActionButtons>
    </BottomSheet>
  );
};
