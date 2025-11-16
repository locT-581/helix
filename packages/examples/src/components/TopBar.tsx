import { styled } from '@helix/ui';
import { ArrowLeft, Settings, Play, Pause } from 'lucide-react';
import { useEditorStore } from '@helix/studio';

const TopBarContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: '0 $2',
});

const IconButton = styled('button', {
  width: '$11', // 44px - minimum touch target
  height: '$11',
  border: 'none',
  backgroundColor: 'transparent',
  color: '$text',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  borderRadius: '$2',
  
  '&:active': {
    backgroundColor: '$surfaceHover',
  },
});

const Title = styled('h1', {
  fontSize: '$lg',
  fontWeight: 600,
  color: '$text',
});

const Actions = styled('div', {
  display: 'flex',
  gap: '$2',
});

interface TopBarProps {
  onPropertiesClick: () => void;
}

export const TopBar = ({ onPropertiesClick }: TopBarProps) => {
  const { isPlaying, togglePlayPause } = useEditorStore();
  
  return (
    <TopBarContainer>
      <IconButton onClick={() => window.history.back()}>
        <ArrowLeft size={20} />
      </IconButton>
      
      <Title>Helix</Title>
      
      <Actions>
        <IconButton onClick={togglePlayPause}>
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </IconButton>
        <IconButton onClick={onPropertiesClick}>
          <Settings size={20} />
        </IconButton>
      </Actions>
    </TopBarContainer>
  );
};
