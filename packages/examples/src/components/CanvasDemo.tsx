/**
 * Canvas Demo - Integration test for @helix/canvas
 * Tests all features: element rendering, gestures, media upload, transforms
 */

import { useEffect, useRef, useState } from 'react';
import {
  useHelixCanvas,
  useCanvasGestures,
  useTouchTransformControls,
  useMediaUpload,
  type UploadedMedia,
} from '@helix/canvas';

export const CanvasDemo = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [videoSize] = useState({ width: 375, height: 812 }); // iPhone 13 Pro
  const [zoomLevel, setZoomLevel] = useState(1);

  // Initialize canvas
  const {
    helixStage,
    helixLayer,
    addElementToCanvas,
    buildCanvas,
  } = useHelixCanvas({
    onCanvasReady: (stage: unknown) => console.log('Canvas ready:', stage),
    onCanvasOperation: (operation: unknown, data: unknown) => console.log('Canvas operation:', operation, data),
  });

  // Initialize gestures
  const { bind, resetZoom, zoomToScale } = useCanvasGestures({
    stage: helixStage,
    enabled: true,
    minScale: 0.5,
    maxScale: 4,
    onZoomChange: setZoomLevel,
  });

  // Initialize touch controls
  const { deselectElement } = useTouchTransformControls({
    layer: helixLayer,
    stage: helixStage,
    enabled: true,
    onTransformStart: (target: { id: () => string }) => console.log('Transform start:', target.id()),
    onTransformEnd: (target: { id: () => string }) => console.log('Transform end:', target.id()),
  });

  // Initialize media upload
  const { openFilePicker, uploadedFiles, isUploading, progress } = useMediaUpload({
    maxFileSize: 100 * 1024 * 1024, // 100MB
    generateThumbnails: true,
    onUploadComplete: async (media: UploadedMedia) => {
      console.log('Upload complete:', media);

      // Add uploaded media to canvas
      if (media.type === 'image') {
        await addElementToCanvas({
          element: {
            id: media.id,
            type: 'image',
            props: {
              src: media.url,
              x: 50,
              y: 50,
              width: media.dimensions?.width ?? 200,
              height: media.dimensions?.height ?? 200,
            },
          },
          index: 0,
          reorder: false,
        });
      }
    },
  });

  // Add sample elements on mount
  useEffect(() => {
    if (!canvasRef.current) {
      console.log('canvasRef.current is null');
      return;
    }

    console.log('Building canvas with videoSize:', videoSize);
    
    // Build canvas first
    buildCanvas({
      videoSize: videoSize,
      canvasSize: videoSize, // Use same size for now
      container: canvasRef.current,
      backgroundColor: '#ffffff',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Add sample elements after canvas is ready
  useEffect(() => {
    if (!helixLayer || !helixStage) {
      console.log('Canvas not ready yet. helixLayer:', !!helixLayer, 'helixStage:', !!helixStage);
      return;
    }

    console.log('Adding sample elements to canvas');

    // Add sample elements using addElementToCanvas
    addElementToCanvas({
      element: {
        id: 'bg-1',
        type: 'background',
        props: { backgroundColor: '#f0f0f0' },
      },
      index: 0,
      reorder: false,
    });

    addElementToCanvas({
      element: {
        id: 'rect-1',
        type: 'rect',
        props: {
          x: 50,
          y: 100,
          width: 200,
          height: 150,
          fill: '#4285f4',
          radius: 8,
        },
      },
      index: 1,
      reorder: false,
    });

    addElementToCanvas({
      element: {
        id: 'circle-1',
        type: 'circle',
        props: {
          x: 150,
          y: 400,
          radius: 60,
          fill: '#ea4335',
        },
      },
      index: 2,
      reorder: false,
    });

    addElementToCanvas({
      element: {
        id: 'text-1',
        type: 'text',
        props: {
          x: 50,
          y: 50,
          text: 'Helix Canvas Demo',
          fontSize: 32,
          fontFamily: 'Inter, sans-serif',
          fill: '#202124',
        },
      },
      index: 3,
      reorder: false,
    });

    helixLayer.batchDraw();
  }, [helixLayer, helixStage, addElementToCanvas]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <h1>Helix Canvas Demo</h1>
      
      {/* Controls */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={() => openFilePicker('gallery')}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#4285f4',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
          disabled={isUploading}
        >
          {isUploading ? `Uploading... ${progress}%` : 'Upload from Gallery'}
        </button>

        <button
          onClick={() => openFilePicker('camera')}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#ea4335',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
          disabled={isUploading}
        >
          Take Photo
        </button>

        <button
          onClick={() => resetZoom()}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#34a853',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Reset Zoom
        </button>

        <button
          onClick={() => zoomToScale(2)}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#fbbc04',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Zoom 2x
        </button>

        <button
          onClick={() => deselectElement()}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#5f6368',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Deselect
        </button>
      </div>

      {/* Info */}
      <div style={{ marginBottom: '20px', fontSize: '14px', color: '#5f6368' }}>
        <p><strong>Zoom:</strong> {(zoomLevel * 100).toFixed(0)}%</p>
        <p><strong>Canvas Size:</strong> {videoSize.width} x {videoSize.height}</p>
        <p><strong>Uploaded Files:</strong> {uploadedFiles.length}</p>
        <p style={{ fontSize: '12px', marginTop: '10px' }}>
          <strong>Gestures:</strong> Pinch to zoom, drag to pan, click to select elements
        </p>
      </div>

      {/* Canvas Container */}
      <div
        ref={canvasRef}
        {...(bind ? bind() : {})}
        style={{
          border: '2px solid #dadce0',
          borderRadius: '8px',
          overflow: 'hidden',
          touchAction: 'none', // Prevent default touch behavior
          backgroundColor: '#fff',
          maxWidth: '100%',
          aspectRatio: `${videoSize.width} / ${videoSize.height}`,
        }}
      />

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Uploaded Files</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {uploadedFiles.map((file: UploadedMedia) => (
              <div
                key={file.id}
                style={{
                  border: '1px solid #dadce0',
                  borderRadius: '8px',
                  padding: '10px',
                  width: '150px',
                }}
              >
                {file.thumbnail && (
                  <img
                    src={file.thumbnail}
                    alt={file.file.name}
                    style={{ width: '100%', borderRadius: '4px', marginBottom: '8px' }}
                  />
                )}
                <p style={{ fontSize: '12px', margin: 0 }}>{file.file.name}</p>
                <p style={{ fontSize: '10px', color: '#5f6368', margin: '4px 0 0 0' }}>
                  {file.type} · {file.dimensions?.width}x{file.dimensions?.height}
                  {file.duration && ` · ${file.duration.toFixed(1)}s`}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
