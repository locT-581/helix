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

const TimelinePlaceholder = styled('div', {
  height: '$32', // 128px
  backgroundColor: '$surface',
  borderTop: '1px solid $border',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '$textSecondary',
  fontSize: '$sm',
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
            <TimelinePlaceholder>
              Timeline (Week 5-6)
            </TimelinePlaceholder>
          </>
        )}
        
        {currentTab === 'timeline' && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>Timeline View (Week 5-6)</p>
          </div>
        )}
        
        {currentTab === 'elements' && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>Elements Library (Week 7-8)</p>
          </div>
        )}
        
        {currentTab === 'settings' && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>Settings (Week 9-10)</p>
          </div>
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
