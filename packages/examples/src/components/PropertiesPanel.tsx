import { styled } from '@helix/ui';
import { Slider } from '@helix/ui';
import { useEditorStore } from '@helix/studio';

const PanelContainer = styled('div', {
  padding: '$4',
});

const PanelTitle = styled('h2', {
  fontSize: '$lg',
  fontWeight: 600,
  color: '$text',
  marginBottom: '$4',
});

const Section = styled('div', {
  marginBottom: '$6',
});

const SectionTitle = styled('h3', {
  fontSize: '$sm',
  fontWeight: 500,
  color: '$textSecondary',
  marginBottom: '$2',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

const SliderContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
});

const SliderLabel = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '$sm',
  color: '$text',
});

export const PropertiesPanel = () => {
  const { volume, setVolume, zoom, setZoom } = useEditorStore();
  
  return (
    <PanelContainer>
      <PanelTitle>Properties</PanelTitle>
      
      <Section>
        <SectionTitle>Playback</SectionTitle>
        <SliderContainer>
          <SliderLabel>
            <span>Volume</span>
            <span>{Math.round(volume * 100)}%</span>
          </SliderLabel>
          <Slider
            value={[volume * 100]}
            onValueChange={([v]) => {
              if (v !== undefined) {
                setVolume(v / 100);
              }
            }}
            min={0}
            max={100}
            step={1}
          />
        </SliderContainer>
      </Section>
      
      <Section>
        <SectionTitle>Timeline</SectionTitle>
        <SliderContainer>
          <SliderLabel>
            <span>Zoom</span>
            <span>{Math.round(zoom * 100)}%</span>
          </SliderLabel>
          <Slider
            value={[zoom * 100]}
            onValueChange={([v]) => {
              if (v !== undefined) {
                setZoom(v / 100);
              }
            }}
            min={50}
            max={200}
            step={10}
          />
        </SliderContainer>
      </Section>
    </PanelContainer>
  );
};
