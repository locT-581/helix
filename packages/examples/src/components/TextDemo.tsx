/**
 * TextDemo - Integration test for Week 11 Text & Effects features
 * 
 * Tests all Week 11 components:
 * - TextEditor (Task 5)
 * - TextEffectsPicker (Task 6)
 * - applyTextEffect() canvas rendering (Task 7)
 * - TextElement + ElementTextEffect integration
 */

import { useEffect, useRef, useState } from 'react';
import { styled } from '@helix/ui';
import { Plus, Edit3, Sparkles, Play, Pause, Trash2 } from 'lucide-react';
import {
  TextElement,
  ElementTextEffect,
  TextEditor,
  TextEffectsPicker,
  type TextConfig,
} from '@helix/timeline';
import {
  useHelixCanvas,
  applyTextEffect,
  resetTextEffect,
} from '@helix/canvas';
import type Konva from 'konva';

// Styled components
const Container = styled('div', {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '$background',
  overflow: 'hidden',
});

const PreviewContainer = styled('div', {
  flex: 1,
  backgroundColor: '$surfaceHover',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '300px',
});

const CanvasWrapper = styled('div', {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const TextListContainer = styled('div', {
  borderTop: '1px solid $border',
  backgroundColor: '$surface',
  overflowY: 'auto',
  maxHeight: '40%',
});

const TextListHeader = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '$3',
  borderBottom: '1px solid $border',
  backgroundColor: '$background',
});

const TextListTitle = styled('h3', {
  margin: 0,
  fontSize: '$base',
  fontWeight: 600,
  color: '$text',
});

const AddButton = styled('button', {
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
  padding: '$2 $3',
  backgroundColor: '$primary',
  color: 'white',
  border: 'none',
  borderRadius: '$md',
  fontSize: '$sm',
  fontWeight: 500,
  cursor: 'pointer',
  minHeight: '$11', // 44px touch target
  
  '&:active': {
    backgroundColor: '$primaryHover',
  },
});

const TextItem = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$3',
  padding: '$3',
  borderBottom: '1px solid $border',
  
  '&:active': {
    backgroundColor: '$surfaceHover',
  },
  
  variants: {
    selected: {
      true: {
        backgroundColor: '$surfaceHover',
      },
    },
  },
});

const TextInfo = styled('div', {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '$1',
});

const TextContent = styled('div', {
  fontSize: '$base',
  fontWeight: 500,
  color: '$text',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const TextMeta = styled('div', {
  fontSize: '$xs',
  color: '$textSecondary',
});

const TextActions = styled('div', {
  display: 'flex',
  gap: '$2',
});

const IconButton = styled('button', {
  padding: '$2',
  backgroundColor: 'transparent',
  border: '1px solid $border',
  borderRadius: '$md',
  color: '$text',
  cursor: 'pointer',
  minHeight: '$11',
  minWidth: '$11',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  
  '&:active': {
    backgroundColor: '$surfaceHover',
  },
  
  variants: {
    variant: {
      danger: {
        color: '$error',
        borderColor: '$error',
      },
      primary: {
        backgroundColor: '$primary',
        color: 'white',
        borderColor: '$primary',
      },
    },
  },
});

const PlaybackControls = styled('div', {
  position: 'absolute',
  bottom: '$4',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: '$2',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  padding: '$2',
  borderRadius: '$lg',
});

const PlayButton = styled('button', {
  padding: '$2',
  backgroundColor: 'white',
  border: 'none',
  borderRadius: '$md',
  color: '$text',
  cursor: 'pointer',
  minHeight: '$11',
  minWidth: '$11',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  
  '&:active': {
    backgroundColor: '$surfaceHover',
  },
});

const TimeDisplay = styled('div', {
  padding: '0 $3',
  display: 'flex',
  alignItems: 'center',
  color: 'white',
  fontSize: '$sm',
  fontWeight: 500,
});

const EmptyState = styled('div', {
  padding: '$6',
  textAlign: 'center',
  color: '$textSecondary',
  fontSize: '$sm',
});

interface TextElementData {
  id: string;
  element: TextElement;
  konvaText?: Konva.Text;
}

export const TextDemo = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [textElements, setTextElements] = useState<TextElementData[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isEffectsOpen, setIsEffectsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const animationFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  
  // Initialize canvas
  const { helixStage, helixLayer, buildCanvas } = useHelixCanvas({
    onCanvasReady: () => console.log('TextDemo canvas ready'),
  });

  // Build canvas on mount
  useEffect(() => {
    if (canvasRef.current && !helixStage) {
      buildCanvas({
        container: canvasRef.current,
        videoSize: { width: 375, height: 667 }, // iPhone SE size
        canvasSize: { width: 375, height: 400 },
      });
    }
  }, [buildCanvas, helixStage]);

  // Playback animation loop
  useEffect(() => {
    if (!isPlaying || !helixLayer) return;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = (timestamp - startTimeRef.current) / 1000;
      setCurrentTime(elapsed);

      // Apply effects to all text elements
      textElements.forEach(({ element, konvaText }) => {
        if (konvaText && element.getTextEffect()) {
          applyTextEffect({
            textElement: konvaText,
            effect: element.getTextEffect()!,
            currentTime: elapsed,
            startTime: element.getStart(),
            endTime: element.getEnd(),
            easing: 'easeInOutCubic',
          });
        }
      });

      helixLayer.batchDraw();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, textElements, helixLayer]);

  // Add new text element
  const handleAddText = () => {
    const newElement = new TextElement('New Text');
    newElement
      .setStart(0)
      .setEnd(5)
      .setFontSize(32)
      .setFill('#FFFFFF')
      .setName(`Text ${textElements.length + 1}`);

    const newData: TextElementData = {
      id: newElement.getId(),
      element: newElement,
    };

    setTextElements([...textElements, newData]);
    setSelectedElementId(newElement.getId());
    setIsEditorOpen(true);
  };

  // Edit text element
  const handleEditText = (elementData: TextElementData) => {
    setSelectedElementId(elementData.id);
    setIsEditorOpen(true);
  };

  // Apply text edits
  const handleApplyTextEdit = (config: TextConfig) => {
    if (!selectedElementId) return;

    const updatedElements = textElements.map((data) => {
      if (data.id === selectedElementId) {
        data.element
          .setText(config.text)
          .setFontSize(config.fontSize)
          .setFill(config.color);

        if (config.fontFamily) {
          data.element.setFontFamily(config.fontFamily);
        }

        if (config.backgroundColor) {
          data.element.getProps().backgroundColor = config.backgroundColor;
        }

        // Update Konva.Text if exists
        if (data.konvaText) {
          data.konvaText.text(config.text);
          data.konvaText.fontSize(config.fontSize);
          data.konvaText.fill(config.color);
          if (config.fontFamily) {
            data.konvaText.fontFamily(config.fontFamily);
          }
          helixLayer?.batchDraw();
        } else if (helixLayer && helixStage) {
          // Create Konva.Text for first time
          const konvaText = new (window as any).Konva.Text({
            id: data.element.getId(),
            text: config.text,
            x: helixStage.width() / 2,
            y: helixStage.height() / 2,
            fontSize: config.fontSize,
            fontFamily: config.fontFamily || 'Inter',
            fill: config.color,
            offsetX: 0,
            offsetY: 0,
            draggable: true,
          });

          // Center text
          konvaText.offsetX(konvaText.width() / 2);
          konvaText.offsetY(konvaText.height() / 2);

          helixLayer.add(konvaText);
          data.konvaText = konvaText;
          helixLayer.batchDraw();
        }
      }
      return data;
    });

    setTextElements(updatedElements);
    setIsEditorOpen(false);
  };

  // Apply text effect
  const handleApplyEffect = (effect: ElementTextEffect) => {
    if (!selectedElementId) return;

    const updatedElements = textElements.map((data) => {
      if (data.id === selectedElementId) {
        data.element.setTextEffect(effect);
        
        // Reset effect state on Konva.Text
        if (data.konvaText) {
          resetTextEffect(data.konvaText);
        }
      }
      return data;
    });

    setTextElements(updatedElements);
    setIsEffectsOpen(false);
  };

  // Delete text element
  const handleDeleteText = (elementId: string) => {
    const elementData = textElements.find((d) => d.id === elementId);
    if (elementData?.konvaText) {
      elementData.konvaText.destroy();
      helixLayer?.batchDraw();
    }

    setTextElements(textElements.filter((d) => d.id !== elementId));
    if (selectedElementId === elementId) {
      setSelectedElementId(null);
    }
  };

  // Toggle playback
  const handleTogglePlayback = () => {
    if (isPlaying) {
      setIsPlaying(false);
      startTimeRef.current = 0;
    } else {
      setIsPlaying(true);
      startTimeRef.current = 0;
      setCurrentTime(0);
      
      // Reset all effects
      textElements.forEach(({ konvaText }) => {
        if (konvaText) {
          resetTextEffect(konvaText);
        }
      });
    }
  };

  // Get selected element data
  const selectedElement = textElements.find((d) => d.id === selectedElementId);

  return (
    <Container>
      <PreviewContainer>
        <CanvasWrapper ref={canvasRef} />
        
        {helixStage && (
          <PlaybackControls>
            <PlayButton onClick={handleTogglePlayback}>
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </PlayButton>
            <TimeDisplay>
              {currentTime.toFixed(1)}s
            </TimeDisplay>
          </PlaybackControls>
        )}
      </PreviewContainer>

      <TextListContainer>
        <TextListHeader>
          <TextListTitle>Text Elements ({textElements.length})</TextListTitle>
          <AddButton onClick={handleAddText}>
            <Plus size={16} />
            Add Text
          </AddButton>
        </TextListHeader>

        {textElements.length === 0 ? (
          <EmptyState>
            No text elements yet. Tap "Add Text" to create one.
          </EmptyState>
        ) : (
          textElements.map((data) => (
            <TextItem
              key={data.id}
              selected={selectedElementId === data.id}
              onClick={() => setSelectedElementId(data.id)}
            >
              <TextInfo>
                <TextContent>{data.element.getText()}</TextContent>
                <TextMeta>
                  {data.element.getName()} • {data.element.getTextEffect()?.getName() || 'No effect'}
                </TextMeta>
              </TextInfo>
              <TextActions>
                <IconButton onClick={() => handleEditText(data)}>
                  <Edit3 size={16} />
                </IconButton>
                <IconButton
                  onClick={() => {
                    setSelectedElementId(data.id);
                    setIsEffectsOpen(true);
                  }}
                >
                  <Sparkles size={16} />
                </IconButton>
                <IconButton
                  variant="danger"
                  onClick={() => handleDeleteText(data.id)}
                >
                  <Trash2 size={16} />
                </IconButton>
              </TextActions>
            </TextItem>
          ))
        )}
      </TextListContainer>

      {/* Text Editor Bottom Sheet */}
      {selectedElement && (
        <TextEditor
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          initialText={selectedElement.element.getText()}
          initialFontSize={selectedElement.element.getProps().fontSize || 32}
          initialColor={selectedElement.element.getProps().fill || '#FFFFFF'}
          initialAlignment={selectedElement.element.getProps().textAlign as 'left' | 'center' | 'right' || 'center'}
          onApply={handleApplyTextEdit}
        />
      )}

      {/* Text Effects Picker Bottom Sheet */}
      {selectedElement && (
        <TextEffectsPicker
          isOpen={isEffectsOpen}
          onClose={() => setIsEffectsOpen(false)}
          initialEffect={selectedElement.element.getTextEffect()}
          onApply={handleApplyEffect}
        />
      )}
    </Container>
  );
};
