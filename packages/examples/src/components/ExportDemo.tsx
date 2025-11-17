import { useState } from 'react';
import { styled } from '@helix/ui';
import { Button } from '@helix/ui';
import { ExportBottomSheet } from '@helix/studio';
import type { ExportConfig, ExportProgress } from '@helix/core';

/**
 * Export Demo Component
 * 
 * Demonstrates ExportBottomSheet with simulated export progress.
 * Shows quality presets, format selection, and progress tracking.
 */

const DemoContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
  padding: '$6',
  height: '100%',
});

const DemoHeader = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
});

const DemoTitle = styled('h1', {
  fontSize: '$2xl',
  fontWeight: '$bold',
  color: '$textPrimary',
  margin: 0,
});

const DemoDescription = styled('p', {
  fontSize: '$md',
  color: '$textSecondary',
  margin: 0,
  lineHeight: 1.6,
});

const DemoActions = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',
  marginTop: '$4',
});

const InfoBox = styled('div', {
  padding: '$4',
  backgroundColor: '$surface',
  borderRadius: '$2',
  border: '1px solid $border',
});

const InfoTitle = styled('h3', {
  fontSize: '$md',
  fontWeight: '$semibold',
  color: '$textPrimary',
  margin: '0 0 $2 0',
});

const InfoText = styled('p', {
  fontSize: '$sm',
  color: '$textSecondary',
  margin: 0,
  lineHeight: 1.5,
});

const CodeBlock = styled('pre', {
  fontSize: '$xs',
  color: '$textPrimary',
  backgroundColor: '$background',
  padding: '$3',
  borderRadius: '$2',
  overflow: 'auto',
  margin: '$2 0 0 0',
});

export const ExportDemo = () => {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportProgress, setExportProgress] = useState<ExportProgress | undefined>(undefined);
  const [lastConfig, setLastConfig] = useState<ExportConfig | null>(null);
  
  // Simulate export process
  const simulateExport = (config: ExportConfig) => {
    setLastConfig(config);
    
    // Start export
    setExportProgress({
      state: 'initializing',
      progress: 0,
      currentFrame: 0,
      totalFrames: 900, // 30 seconds @ 30fps
    });
    
    // Simulate progress stages
    let frame = 0;
    const totalFrames = 900;
    
    const interval = setInterval(() => {
      frame += 10;
      const progress = frame / totalFrames;
      
      if (frame >= totalFrames) {
        // Complete
        setExportProgress({
          state: 'completed',
          progress: 1,
          currentFrame: totalFrames,
          totalFrames,
          result: {
            blob: new Blob(['fake video data'], { type: `video/${config.format}` }),
            url: 'blob:fake-video-url',
            size: 15_000_000, // 15 MB
            duration: 30,
            config,
            timestamp: Date.now(),
          },
        });
        clearInterval(interval);
      } else {
        // Update progress
        let state: ExportProgress['state'] = 'rendering-video';
        if (progress > 0.6) state = 'mixing-audio';
        if (progress > 0.9) state = 'muxing';
        
        setExportProgress({
          state,
          progress,
          currentFrame: frame,
          totalFrames,
          estimatedTimeRemaining: Math.round((totalFrames - frame) / 10 * 0.1), // seconds
        });
      }
    }, 100); // Update every 100ms
    
    // Store interval ID for cancellation
    (window as any).__exportInterval = interval;
  };
  
  const handleCancel = () => {
    if ((window as any).__exportInterval) {
      clearInterval((window as any).__exportInterval);
      (window as any).__exportInterval = null;
    }
    
    setExportProgress({
      state: 'cancelled',
      progress: exportProgress?.progress || 0,
      currentFrame: exportProgress?.currentFrame || 0,
      totalFrames: exportProgress?.totalFrames || 900,
    });
  };
  
  const handleRetry = () => {
    if (lastConfig) {
      simulateExport(lastConfig);
    }
  };
  
  const handleSimulateError = () => {
    setExportProgress({
      state: 'error',
      progress: 0.45,
      currentFrame: 405,
      totalFrames: 900,
      error: 'Failed to encode video frame at 13.5s. WebCodecs encoder error.',
    });
  };
  
  return (
    <DemoContainer>
      <DemoHeader>
        <DemoTitle>Export Demo</DemoTitle>
        <DemoDescription>
          Test the ExportBottomSheet component with simulated export progress.
          Try different quality presets and formats.
        </DemoDescription>
      </DemoHeader>
      
      <DemoActions>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => setIsExportOpen(true)}
        >
          Open Export Settings
        </Button>
        
        {exportProgress && (
          <Button
            variant="outline"
            size="md"
            fullWidth
            onClick={handleSimulateError}
          >
            Simulate Export Error
          </Button>
        )}
      </DemoActions>
      
      {lastConfig && (
        <InfoBox>
          <InfoTitle>Last Export Config</InfoTitle>
          <CodeBlock>
            {JSON.stringify(lastConfig, null, 2)}
          </CodeBlock>
        </InfoBox>
      )}
      
      {exportProgress && (
        <InfoBox>
          <InfoTitle>Export Progress</InfoTitle>
          <InfoText>
            State: <strong>{exportProgress.state}</strong><br />
            Progress: <strong>{Math.round(exportProgress.progress * 100)}%</strong><br />
            Frame: <strong>{exportProgress.currentFrame} / {exportProgress.totalFrames}</strong>
          </InfoText>
          {exportProgress.result && (
            <InfoText style={{ marginTop: '$2' }}>
              ✅ Export completed!<br />
              Size: {(exportProgress.result.size / 1_000_000).toFixed(2)} MB<br />
              Duration: {exportProgress.result.duration}s
            </InfoText>
          )}
        </InfoBox>
      )}
      
      <ExportBottomSheet
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onExport={simulateExport}
        exportProgress={exportProgress}
        onCancel={handleCancel}
        onRetry={handleRetry}
      />
    </DemoContainer>
  );
};
