import { useState } from 'react';
import {
  MobileAppShell,
  BottomSheet,
  VideoPreview,
  useNavigationStore,
  useEditorStore,
} from '@helix/studio';
import { styled, globalCss } from '@helix/ui';
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';
import { PropertiesPanel } from './components/PropertiesPanel';
import { TimelineDemo } from './components/TimelineDemo';
import { CanvasDemo } from './components/CanvasDemo';
import { AudioDemo } from './components/AudioDemo';
import { TextDemo } from './components/TextDemo';
import { ExportDemo } from './components/ExportDemo';

// Apply global Stitches styles
const globalStyles = globalCss({
  '*': {
    boxSizing: 'border-box',
  },
});

const EditorContent = styled('div', {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

const PreviewContainer = styled('div', {
  flex: 1,
  backgroundColor: '$background',
  position: 'relative',
});

export const App = () => {
  globalStyles();
  
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const { currentTab } = useNavigationStore();
  const { currentTime, setCurrentTime, volume } = useEditorStore();
  
  // Sample video URL (replace with actual video)
  const videoSrc = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  
  return (
    <MobileAppShell
      topBar={
        <TopBar 
          onPropertiesClick={() => setIsPropertiesOpen(true)}
        />
      }
      bottomNav={<BottomNav />}
    >
      <EditorContent>
        {currentTab === 'editor' && (
          <>
            <PreviewContainer>
              <VideoPreview
                src={videoSrc}
                currentTime={currentTime}
                onTimeUpdate={setCurrentTime}
                volume={volume}
                showControls
              />
            </PreviewContainer>
            <TimelineDemo />
          </>
        )}
        
        {currentTab === 'timeline' && (
          <TimelineDemo />
        )}
        
        {currentTab === 'elements' && (
          <CanvasDemo />
        )}
        
        {currentTab === 'text' && (
          <TextDemo />
        )}
        
        {currentTab === 'export' && (
          <ExportDemo />
        )}
        
        {currentTab === 'settings' && (
          <AudioDemo />
        )}
      </EditorContent>
      
      <BottomSheet
        isOpen={isPropertiesOpen}
        onClose={() => setIsPropertiesOpen(false)}
        snapPoints={[0.5, 0.9]}
        showDragHandle
      >
        <PropertiesPanel />
      </BottomSheet>
    </MobileAppShell>
  );
};
