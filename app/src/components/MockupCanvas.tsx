'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Image as KonvaImage, Line, Text, Group, Transformer } from 'react-konva';
import Konva from 'konva';
import MagneticLassoTool, { Point } from './MagneticLassoTool';
import CustomPlaceholder from './CustomPlaceholder';
import GeometricPatternSelector, { GeometricPattern } from './GeometricPatternSelector';
import GeometricShape from './GeometricShapes';

// Extended placeholder interface with percentage-based properties and rotation
export interface PlaceholderWithPercentage {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  xPercent?: number;
  yPercent?: number;
  widthPercent?: number;
  heightPercent?: number;
  rotationPercent?: number;
}

export interface MockupCanvasProps {
  backgroundImage: string | null; // Front view image
  backImage?: string | null; // Back view image
  sideImage?: string | null; // Side view image
  onExport: (dataUrl: string) => void;
  productCategory: string;
  productSubcategory: string;
  onPlaceholderChange?: (
    placeholder: PlaceholderWithPercentage, 
    view?: string,
    customShapePoints?: Array<{x: number, y: number}>
  ) => void;
  initialPlaceholder?: PlaceholderWithPercentage;
  designImage?: HTMLImageElement | null; // Accept a pre-loaded design image
}

const MockupCanvas: React.FC<MockupCanvasProps> = ({
  backgroundImage,
  backImage,
  sideImage,
  onExport,
  productCategory,
  productSubcategory,
  onPlaceholderChange,
  initialPlaceholder,
  designImage: externalDesignImage,
}) => {
  const stageRef = useRef<any>(null);
  const rectRef = useRef<Konva.Rect>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [placeholder, setPlaceholder] = useState(initialPlaceholder || {
    x: 100,
    y: 100,
    width: 100,
    height: 100,
    rotation: 0,
  });
  const [designImage, setDesignImage] = useState<HTMLImageElement | null>(externalDesignImage || null);
  
  // Update designImage when externalDesignImage changes
  useEffect(() => {
    console.log('External design image changed:', externalDesignImage);
    if (externalDesignImage !== undefined) {
      setDesignImage(externalDesignImage);
    }
  }, [externalDesignImage]);
  const [loadedBackgroundImage, setLoadedBackgroundImage] = useState<HTMLImageElement | null>(null);
  const [loadedBackImage, setLoadedBackImage] = useState<HTMLImageElement | null>(null);
  const [loadedSideImage, setLoadedSideImage] = useState<HTMLImageElement | null>(null);
  const [activeView, setActiveView] = useState<'front' | 'back' | 'side'>('front');
  const [showAxes, setShowAxes] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [activeHandle, setActiveHandle] = useState<string | null>(null);
  
  // Magnetic lasso tool states
  const [isLassoActive, setIsLassoActive] = useState(false);
  const [customShapePoints, setCustomShapePoints] = useState<Point[]>([]);
  const [isCustomShapeSelected, setIsCustomShapeSelected] = useState(false);
  const [useCustomShape, setUseCustomShape] = useState(false);
  
  // Geometric pattern states
  const [selectedPattern, setSelectedPattern] = useState<GeometricPattern>('rectangle');
  
  // Constants for canvas dimensions
  const CANVAS_WIDTH = 400; // Reduced to half (was 400)
  const CANVAS_HEIGHT = 400;
  
  // Function to convert absolute coordinates to percentage-based
  const convertToPercentage = (coords: { x: number; y: number; width: number; height: number; rotation?: number }) => {
    return {
      xPercent: (coords.x / CANVAS_WIDTH) * 100,
      yPercent: (coords.y / CANVAS_HEIGHT) * 100,
      widthPercent: (coords.width / CANVAS_WIDTH) * 100,
      heightPercent: (coords.height / CANVAS_HEIGHT) * 100,
      rotationPercent: coords.rotation // Rotation is already in degrees, no need to convert
    };
  };
  
  // Function to convert percentage-based coordinates to absolute
  const convertFromPercentage = (percentageCoords: { 
    xPercent: number; 
    yPercent: number; 
    widthPercent: number; 
    heightPercent: number;
    rotationPercent?: number;
  }) => {
    return {
      x: (percentageCoords.xPercent / 100) * CANVAS_WIDTH,
      y: (percentageCoords.yPercent / 100) * CANVAS_HEIGHT,
      width: (percentageCoords.widthPercent / 100) * CANVAS_WIDTH,
      height: (percentageCoords.heightPercent / 100) * CANVAS_HEIGHT,
      rotation: percentageCoords.rotationPercent || 0 // Rotation is already in degrees
    };
  };

  // Load the front image
  useEffect(() => {
    if (backgroundImage) {
      const img = new window.Image();
      img.src = backgroundImage;
      img.onload = () => {
        setLoadedBackgroundImage(img);
      };
    }
  }, [backgroundImage]);
  
  // Load the back image
  useEffect(() => {
    if (backImage) {
      const img = new window.Image();
      img.src = backImage;
      img.onload = () => {
        setLoadedBackImage(img);
      };
    }
  }, [backImage]);
  
  // Load the side image
  useEffect(() => {
    if (sideImage) {
      const img = new window.Image();
      img.src = sideImage;
      img.onload = () => {
        setLoadedSideImage(img);
      };
    }
  }, [sideImage]);
  
  // Attach transformer to rectangle when component mounts
  useEffect(() => {
    if (rectRef.current && transformerRef.current) {
      transformerRef.current.nodes([rectRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, []);

  // Handle design image upload
  const handleDesignUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Use current placeholder dimensions and rotation
    const width = placeholder.width;
    const height = placeholder.height;
    const rotation = placeholder.rotation || 0;
    
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.src = reader.result as string;
      img.onload = () => {
        setDesignImage(img);
        
        // Log the design image and placeholder details for debugging
        console.log('Design image loaded:', {
          imageWidth: img.width,
          imageHeight: img.height,
          placeholderWidth: width,
          placeholderHeight: height,
          placeholderRotation: rotation
        });
      };
    };
    reader.readAsDataURL(file);
  };

  // Export the canvas as a PNG
  const handleExport = () => {
    if (stageRef.current) {
      const dataUrl = stageRef.current.toDataURL();
      onExport(dataUrl);
    }
    
    // Show success message or visual feedback
    const stage = stageRef.current?.getStage();
    if (stage) {
      // Flash the stage briefly to indicate success
      stage.container().style.backgroundColor = '#e6ffe6';
      setTimeout(() => {
        stage.container().style.backgroundColor = '#f3f3f3';
      }, 300);
    }
  };
  
  // Handle completion of the magnetic lasso tool
  const handleLassoComplete = (points: Point[]) => {
    setCustomShapePoints(points);
    setIsLassoActive(false);
    setUseCustomShape(true);
    setIsCustomShapeSelected(true);
    
    // Calculate bounding box for the custom shape
    let minX = points[0].x;
    let minY = points[0].y;
    let maxX = points[0].x;
    let maxY = points[0].y;
    
    for (const point of points) {
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
    }
    
    // Update the placeholder with the bounding box dimensions
    const newPlaceholder = {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
    
    // Convert to percentage-based coordinates
    const percentagePlaceholder = convertToPercentage(newPlaceholder);
    
    // Create a combined placeholder with both absolute and percentage values
    const combinedPlaceholder: PlaceholderWithPercentage = {
      ...newPlaceholder,
      xPercent: percentagePlaceholder.xPercent,
      yPercent: percentagePlaceholder.yPercent,
      widthPercent: percentagePlaceholder.widthPercent,
      heightPercent: percentagePlaceholder.heightPercent
    };
    
    setPlaceholder(newPlaceholder);
    if (onPlaceholderChange) {
      // Pass the combined placeholder with percentage values along with the custom shape points
      onPlaceholderChange(combinedPlaceholder, activeView, points);
    }
    
    // Log the percentage-based coordinates for debugging
    console.log('Percentage-based placeholder:', percentagePlaceholder);
  };
  
  // Handle cancellation of the magnetic lasso tool
  const handleLassoCancel = () => {
    setIsLassoActive(false);
  };
  
  // Handle custom shape selection
  const handleCustomShapeSelect = () => {
    setIsCustomShapeSelected(true);
  };
  
  // Handle rotation of the placeholder
  const handleRotation = (angle: number) => {
    const newPlaceholder = {
      ...placeholder,
      rotation: angle
    };
    
    // Convert to percentage-based coordinates
    const percentagePlaceholder = convertToPercentage(newPlaceholder);
    
    // Update the placeholder
    setPlaceholder(newPlaceholder);
    
    if (onPlaceholderChange) {
      // Pass both the absolute coordinates and percentage-based coordinates
      onPlaceholderChange({
        ...newPlaceholder,
        // Include percentage-based coordinates
        xPercent: percentagePlaceholder.xPercent,
        yPercent: percentagePlaceholder.yPercent,
        widthPercent: percentagePlaceholder.widthPercent,
        heightPercent: percentagePlaceholder.heightPercent,
        rotationPercent: percentagePlaceholder.rotationPercent
      }, activeView);
    }
  };
  
  // Handle custom shape transformation
  const handleCustomShapeTransform = (e: Konva.KonvaEventObject<Event>) => {
    const node = e.target;
    
    // Get the new transformed points
    const newPoints = customShapePoints.map((point, i) => {
      const x = point.x * node.scaleX() + node.x();
      const y = point.y * node.scaleY() + node.y();
      return { x, y };
    });
    
    setCustomShapePoints(newPoints);
    
    // Calculate new bounding box
    let minX = newPoints[0].x;
    let minY = newPoints[0].y;
    let maxX = newPoints[0].x;
    let maxY = newPoints[0].y;
    
    for (const point of newPoints) {
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
    }
    
    // Update the placeholder with the new bounding box
    const newPlaceholder = {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
    
    setPlaceholder(newPlaceholder);
    if (onPlaceholderChange) {
      onPlaceholderChange(newPlaceholder);
    }
  };

  // Helper function to draw a resize handle
  const ResizeHandle = ({ x, y, position, cursor }: { x: number, y: number, position: string, cursor: string }) => (
    <Group
      x={x}
      y={y}
      width={10}
      height={10}
      onMouseEnter={(e) => {
        const stage = e.target.getStage();
        if (stage) stage.container().style.cursor = cursor;
      }}
      onMouseLeave={(e) => {
        const stage = e.target.getStage();
        if (stage) stage.container().style.cursor = 'default';
      }}
      onMouseDown={(e) => {
        setActiveHandle(position);
        setIsResizing(true);
      }}
    >
      <Rect
        width={10}
        height={10}
        fill="white"
        stroke="blue"
        strokeWidth={1}
      />
    </Group>
  );

  // Function to handle resize operation
  const handleResize = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isResizing || !activeHandle) return;
    
    e.evt.preventDefault();
    const stage = e.target.getStage();
    if (!stage) return;
    
    const pointerPos = stage.getPointerPosition();
    if (!pointerPos) return;
    
    let newX = placeholder.x;
    let newY = placeholder.y;
    let newWidth = placeholder.width;
    let newHeight = placeholder.height;
    
    switch (activeHandle) {
      case 'top-left':
        newX = Math.min(pointerPos.x, placeholder.x + placeholder.width - 50);
        newY = Math.min(pointerPos.y, placeholder.y + placeholder.height - 50);
        newWidth = placeholder.width + (placeholder.x - newX);
        newHeight = placeholder.height + (placeholder.y - newY);
        break;
      case 'top-right':
        newY = Math.min(pointerPos.y, placeholder.y + placeholder.height - 50);
        newWidth = Math.max(50, pointerPos.x - placeholder.x);
        newHeight = placeholder.height + (placeholder.y - newY);
        break;
      case 'bottom-left':
        newX = Math.min(pointerPos.x, placeholder.x + placeholder.width - 50);
        newWidth = placeholder.width + (placeholder.x - newX);
        newHeight = Math.max(50, pointerPos.y - placeholder.y);
        break;
      case 'bottom-right':
        newWidth = Math.max(50, pointerPos.x - placeholder.x);
        newHeight = Math.max(50, pointerPos.y - placeholder.y);
        break;
      case 'middle-left':
        newX = Math.min(pointerPos.x, placeholder.x + placeholder.width - 50);
        newWidth = placeholder.width + (placeholder.x - newX);
        break;
      case 'middle-right':
        newWidth = Math.max(50, pointerPos.x - placeholder.x);
        break;
      case 'middle-top':
        newY = Math.min(pointerPos.y, placeholder.y + placeholder.height - 50);
        newHeight = placeholder.height + (placeholder.y - newY);
        break;
      case 'middle-bottom':
        newHeight = Math.max(50, pointerPos.y - placeholder.y);
        break;
    }
    
    // Ensure rectangle stays within canvas bounds
    newX = Math.max(0, newX);
    newY = Math.max(0, newY);
    newWidth = Math.min(newWidth, CANVAS_WIDTH - newX);
    newHeight = Math.min(newHeight, CANVAS_HEIGHT - newY);
    
    const newPlaceholder = { x: newX, y: newY, width: newWidth, height: newHeight };
    
    // Convert to percentage-based coordinates
    const percentagePlaceholder = convertToPercentage(newPlaceholder);
    
    // Store both absolute and percentage-based coordinates
    setPlaceholder(newPlaceholder);
    
    if (onPlaceholderChange) {
      // Pass both the absolute coordinates and percentage-based coordinates
      onPlaceholderChange({
        ...newPlaceholder,
        // Include percentage-based coordinates
        xPercent: percentagePlaceholder.xPercent,
        yPercent: percentagePlaceholder.yPercent,
        widthPercent: percentagePlaceholder.widthPercent,
        heightPercent: percentagePlaceholder.heightPercent
      });
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {isLassoActive && (
        <div className="w-full bg-blue-100 text-blue-800 p-2 text-sm text-center rounded mb-2">
          Click and drag to trace around the product area. Release to complete. Press ESC to cancel.
        </div>
      )}
      <div className="relative flex justify-center">
        <Stage
          ref={stageRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          style={{ 
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
            backgroundColor: 'red'
          }}
          onMouseMove={handleResize}
          onMouseUp={() => {
            setIsResizing(false);
            setIsDragging(false);
            setActiveHandle(null);
            const stage = stageRef.current?.getStage();
            if (stage) stage.container().style.cursor = 'default';
          }}
          onMouseLeave={() => {
            setIsResizing(false);
            setIsDragging(false);
            setActiveHandle(null);
          }}
        >
          <Layer>
            {/* Red background for the canvas */}
            <Rect
              x={0}
              y={0}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              // fill="red"
            />
            {/* Product Image - based on active view */}
            {activeView === 'front' && loadedBackgroundImage && (
              <KonvaImage
                image={loadedBackgroundImage}
                x={0}
                y={0}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
              />
            )}
            {activeView === 'back' && loadedBackImage && (
              <KonvaImage
                image={loadedBackImage}
                x={0}
                y={0}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
              />
            )}
            {activeView === 'side' && loadedSideImage && (
              <KonvaImage
                image={loadedSideImage}
                x={0}
                y={0}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
              />
            )}
            
            {/* X and Y Axes */}
            {showAxes && (
              <>
                {/* X-axis */}
                <Line
                  points={[0, placeholder.y + placeholder.height / 2, CANVAS_WIDTH, placeholder.y + placeholder.height / 2]}
                  stroke="rgba(0, 0, 255, 0.5)"
                  strokeWidth={1}
                  dash={[5, 5]}
                />
                
                {/* Y-axis */}
                <Line
                  points={[placeholder.x + placeholder.width / 2, 0, placeholder.x + placeholder.width / 2, CANVAS_HEIGHT]}
                  stroke="rgba(0, 0, 255, 0.5)"
                  strokeWidth={1}
                  dash={[5, 5]}
                />
                
                {/* X-axis label */}
                <Text
                  text={`X: ${Math.round(placeholder.x)}`}
                  x={5}
                  y={placeholder.y + placeholder.height / 2 - 20}
                  fontSize={12}
                  fill="blue"
                  padding={2}
                  background="white"
                />
                
                {/* Y-axis label */}
                <Text
                  text={`Y: ${Math.round(placeholder.y)}`}
                  x={placeholder.x + placeholder.width / 2 + 5}
                  y={5}
                  fontSize={12}
                  fill="blue"
                  padding={2}
                  background="white"
                />
                
                {/* Width label */}
                <Text
                  text={`W: ${Math.round(placeholder.width)}`}
                  x={placeholder.x + placeholder.width / 2 - 20}
                  y={placeholder.y + placeholder.height + 5}
                  fontSize={12}
                  fill="blue"
                  padding={2}
                  background="white"
                />
                
                {/* Height label */}
                <Text
                  text={`H: ${Math.round(placeholder.height)}`}
                  x={placeholder.x - 30}
                  y={placeholder.y + placeholder.height / 2 - 6}
                  fontSize={12}
                  fill="blue"
                  padding={2}
                  background="white"
                />
              </>
            )}

            {/* Placeholder - custom shape, geometric shape, or rectangle */}
            {useCustomShape && customShapePoints.length > 0 ? (
              <CustomPlaceholder
                points={customShapePoints}
                fill="rgba(244, 114, 182, 0.6)"
                opacity={0.5}
                stroke="blue"
                strokeWidth={2}
                dash={[5, 5]}
                draggable
                isSelected={isCustomShapeSelected}
                onSelect={handleCustomShapeSelect}
                onTransformEnd={handleCustomShapeTransform}
                onDragEnd={(e) => {
                  // Update the placeholder position based on the drag
                  const node = e.target;
                  
                  // Calculate new points after drag
                  const dx = node.x();
                  const dy = node.y();
                  
                  // Reset position to avoid accumulation
                  node.position({ x: 0, y: 0 });
                  
                  // Update points with the new position
                  const newPoints = customShapePoints.map(point => ({
                    x: point.x + dx,
                    y: point.y + dy
                  }));
                  
                  setCustomShapePoints(newPoints);
                  
                  // Calculate new bounding box
                  let minX = newPoints[0].x;
                  let minY = newPoints[0].y;
                  let maxX = newPoints[0].x;
                  let maxY = newPoints[0].y;
                  
                  for (const point of newPoints) {
                    minX = Math.min(minX, point.x);
                    minY = Math.min(minY, point.y);
                    maxX = Math.max(maxX, point.x);
                    maxY = Math.max(maxY, point.y);
                  }
                  
                  // Update the placeholder with the new bounding box
                  const newPlaceholder = {
                    x: minX,
                    y: minY,
                    width: maxX - minX,
                    height: maxY - minY,
                  };
                  
                  setPlaceholder(newPlaceholder);
                  if (onPlaceholderChange) {
                    onPlaceholderChange(newPlaceholder, activeView);
                  }
                }}
              />
            ) : selectedPattern !== 'rectangle' ? (
              <>
                {/* Geometric shape based on selected pattern */}
                <GeometricShape
                  pattern={selectedPattern}
                  x={placeholder.x}
                  y={placeholder.y}
                  width={placeholder.width}
                  height={placeholder.height}
                  fill="rgba(244, 114, 182, 0.6)"
                  opacity={0.5}
                  stroke="blue"
                  strokeWidth={2}
                  dash={[5, 5]}
                  draggable={true}
                  onDragStart={() => setIsDragging(true)}
                  onDragMove={(e) => {
                    // Constrain dragging to canvas boundaries during movement
                    const node = e.target;
                    
                    // Calculate boundaries based on shape type
                    // For centered shapes like circle, hexagon, etc.
                    const x = Math.max(placeholder.width / 2, Math.min(node.x(), CANVAS_WIDTH - placeholder.width / 2));
                    const y = Math.max(placeholder.height / 2, Math.min(node.y(), CANVAS_HEIGHT - placeholder.height / 2));
                    
                    node.position({x, y});
                  }}
                  onDragEnd={(e) => {
                    setIsDragging(false);
                    const node = e.target;
                    
                    // Calculate new position (centered)
                    let newX = node.x() - placeholder.width / 2;
                    let newY = node.y() - placeholder.height / 2;
                    
                    // Constrain to canvas boundaries
                    newX = Math.max(0, Math.min(newX, CANVAS_WIDTH - placeholder.width));
                    newY = Math.max(0, Math.min(newY, CANVAS_HEIGHT - placeholder.height));
                    
                    const newPlaceholder = {
                      ...placeholder,
                      x: newX,
                      y: newY,
                    };
                    
                    setPlaceholder(newPlaceholder);
                    if (onPlaceholderChange) {
                      onPlaceholderChange(newPlaceholder, activeView);
                    }
                  }}
                  onTransformEnd={(e) => {
                    const node = e.target;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    // Reset scale to 1 after transforming
                    node.scaleX(1);
                    node.scaleY(1);

                    const newPlaceholder = {
                      ...placeholder,
                      x: node.x() - (placeholder.width * scaleX) / 2,
                      y: node.y() - (placeholder.height * scaleY) / 2,
                      width: Math.max(50, placeholder.width * scaleX),
                      height: Math.max(50, placeholder.height * scaleY),
                    };
                    
                    setPlaceholder(newPlaceholder);
                    if (onPlaceholderChange) {
                      onPlaceholderChange(newPlaceholder, activeView);
                    }
                  }}
                />
                
                {/* We don't need an invisible rectangle for geometric shapes */}
              </>
            ) : (
              <Rect
                ref={rectRef}
                x={placeholder.x}
                y={placeholder.y}
                width={placeholder.width}
                height={placeholder.height}
                rotation={placeholder.rotation || 0}
                fill="rgba(244, 114, 182, 0.6)"
                opacity={0.5}
                stroke="blue"
                strokeWidth={2}
                dash={[5, 5]}
                draggable
                onDragStart={() => setIsDragging(true)}
                onDragEnd={(e) => {
                  setIsDragging(false);
                  
                  // Get new position
                  let newX = e.target.x();
                  let newY = e.target.y();
                  
                  // Constrain to canvas boundaries
                  newX = Math.max(0, Math.min(newX, CANVAS_WIDTH - placeholder.width));
                  newY = Math.max(0, Math.min(newY, CANVAS_HEIGHT - placeholder.height));
                  
                  // Update node position to match constrained values
                  e.target.x(newX);
                  e.target.y(newY);
                  
                  const newPlaceholder = {
                    ...placeholder,
                    x: newX,
                    y: newY,
                  };
                  
                  // Convert to percentage-based coordinates
                  const percentagePlaceholder = convertToPercentage(newPlaceholder);
                  
                  setPlaceholder(newPlaceholder);
                  if (onPlaceholderChange) {
                    onPlaceholderChange({
                      ...newPlaceholder,
                      // Include percentage-based coordinates
                      xPercent: percentagePlaceholder.xPercent,
                      yPercent: percentagePlaceholder.yPercent,
                      widthPercent: percentagePlaceholder.widthPercent,
                      heightPercent: percentagePlaceholder.heightPercent,
                      rotationPercent: percentagePlaceholder.rotationPercent
                    }, activeView);
                  }
                }}
                onDragMove={(e) => {
                  // Constrain dragging to canvas boundaries during movement
                  const node = e.target;
                  
                  // Apply constraints
                  const x = Math.max(0, Math.min(node.x(), CANVAS_WIDTH - placeholder.width));
                  const y = Math.max(0, Math.min(node.y(), CANVAS_HEIGHT - placeholder.height));
                  
                  node.position({x, y});
                }}
                onTransformEnd={(e) => {
                  const node = e.target;
                  const scaleX = node.scaleX();
                  const scaleY = node.scaleY();

                  // Reset scale to 1 after transforming
                  node.scaleX(1);
                  node.scaleY(1);

                  const newPlaceholder = {
                    ...placeholder,
                    x: node.x(),
                    y: node.y(),
                    width: Math.max(50, node.width() * scaleX), // Minimum width of 50
                    height: Math.max(50, node.height() * scaleY), // Minimum height of 50
                  };
                  
                  setPlaceholder(newPlaceholder);
                  if (onPlaceholderChange) {
                    onPlaceholderChange(newPlaceholder, activeView);
                  }
                }}
                onTransform={(e) => {
                  const node = e.target;

                  // Prevent resizing beyond canvas bounds
                  const newWidth = node.width() * node.scaleX();
                  const newHeight = node.height() * node.scaleY();
                  if (node.x() + newWidth > CANVAS_WIDTH) {
                    node.width((CANVAS_WIDTH - node.x()) / node.scaleX());
                  }
                  if (node.y() + newHeight > CANVAS_HEIGHT) {
                    node.height((CANVAS_HEIGHT - node.y()) / node.scaleY());
                  }
                }}
              />
            )}
            
            {/* Magnetic Lasso Tool */}
            <MagneticLassoTool
              isActive={isLassoActive}
              canvasWidth={CANVAS_WIDTH}
              canvasHeight={CANVAS_HEIGHT}
              backgroundImage={loadedBackgroundImage}
              onComplete={handleLassoComplete}
              onCancel={handleLassoCancel}
              magneticThreshold={20}
              simplifyTolerance={2}
            />
            
            {/* Resize Handles */}
            <ResizeHandle 
              x={placeholder.x - 5} 
              y={placeholder.y - 5} 
              position="top-left" 
              cursor="nwse-resize" 
            />
            <ResizeHandle 
              x={placeholder.x + placeholder.width - 5} 
              y={placeholder.y - 5} 
              position="top-right" 
              cursor="nesw-resize" 
            />
            <ResizeHandle 
              x={placeholder.x - 5} 
              y={placeholder.y + placeholder.height - 5} 
              position="bottom-left" 
              cursor="nesw-resize" 
            />
            <ResizeHandle 
              x={placeholder.x + placeholder.width - 5} 
              y={placeholder.y + placeholder.height - 5} 
              position="bottom-right" 
              cursor="nwse-resize" 
            />
            
            {/* Middle edge handles */}
            <ResizeHandle 
              x={placeholder.x - 5} 
              y={placeholder.y + placeholder.height/2 - 5} 
              position="middle-left" 
              cursor="ew-resize" 
            />
            <ResizeHandle 
              x={placeholder.x + placeholder.width - 5} 
              y={placeholder.y + placeholder.height/2 - 5} 
              position="middle-right" 
              cursor="ew-resize" 
            />
            <ResizeHandle 
              x={placeholder.x + placeholder.width/2 - 5} 
              y={placeholder.y - 5} 
              position="middle-top" 
              cursor="ns-resize" 
            />
            <ResizeHandle 
              x={placeholder.x + placeholder.width/2 - 5} 
              y={placeholder.y + placeholder.height - 5} 
              position="middle-bottom" 
              cursor="ns-resize" 
            />

            {/* Design Image */}
            {designImage && (
              <KonvaImage
                image={designImage}
                x={placeholder.x + placeholder.width / 2}
                y={placeholder.y + placeholder.height / 2}
                width={designImage.width * (placeholder.width / designImage.width)}
                height={designImage.height * (placeholder.height / designImage.height)}
                offsetX={designImage.width * (placeholder.width / designImage.width) / 2}
                offsetY={designImage.height * (placeholder.height / designImage.height) / 2}
                rotation={placeholder.rotation || 0}
                opacity={1}
              />
            )}
            
            {/* Design Image Debug info */}
            {designImage && (
              <Text
                text={`Design: ${designImage.width}x${designImage.height}`}
                x={5}
                y={CANVAS_HEIGHT - 20}
                fontSize={10}
                fill="blue"
                padding={2}
                background="white"
              />
            )}
            
            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                // Limit resize to canvas boundaries
                if (newBox.x < 0) newBox.x = 0;
                if (newBox.y < 0) newBox.y = 0;
                if (newBox.x + newBox.width > CANVAS_WIDTH) newBox.width = CANVAS_WIDTH - newBox.x;
                if (newBox.y + newBox.height > CANVAS_HEIGHT) newBox.height = CANVAS_HEIGHT - newBox.y;
                
                // Minimum size constraints
                if (newBox.width < 50) newBox.width = 50;
                if (newBox.height < 50) newBox.height = 50;
                
                return newBox;
              }}
              rotateEnabled={true}
              onTransformEnd={(e) => {
                const node = e.target;
                if (!node) return;
                
                // Get the rotation angle
                const rotation = node.rotation();
                
                // Update the placeholder with the new rotation
                const newPlaceholder = {
                  ...placeholder,
                  rotation: rotation
                };
                
                // Convert to percentage-based coordinates
                const percentagePlaceholder = convertToPercentage(newPlaceholder);
                
                // Update the placeholder
                setPlaceholder(newPlaceholder);
                
                if (onPlaceholderChange) {
                  // Pass both the absolute coordinates and percentage-based coordinates
                  onPlaceholderChange({
                    ...newPlaceholder,
                    // Include percentage-based coordinates
                    xPercent: percentagePlaceholder.xPercent,
                    yPercent: percentagePlaceholder.yPercent,
                    widthPercent: percentagePlaceholder.widthPercent,
                    heightPercent: percentagePlaceholder.heightPercent,
                    rotationPercent: percentagePlaceholder.rotationPercent
                  }, activeView);
                }
              }}
            />
          </Layer>
        </Stage>
        
        {/* Coordinate display */}
        <div className="absolute top-2 right-2 bg-white p-2 rounded shadow text-xs">
          X: {Math.round(placeholder.x)} Y: {Math.round(placeholder.y)} | W: {Math.round(placeholder.width)} H: {Math.round(placeholder.height)} | R: {Math.round(placeholder.rotation || 0)}°
        </div>
      </div>
      
      {/* Geometric Pattern Selector */}
      <GeometricPatternSelector
        selectedPattern={selectedPattern}
        onPatternSelect={(pattern) => {
          setSelectedPattern(pattern);
          if (pattern === 'custom') {
            setIsLassoActive(true);
          } else {
            setIsLassoActive(false);
            setUseCustomShape(false);
          }
        }}
      />
      
      {/* View Selector */}
      <div className="flex justify-center gap-2 mb-4 w-full">
        <button 
          type="button"
          onClick={() => setActiveView('front')}
          className={`px-4 py-2 ${activeView === 'front' ? 'bg-blue-600' : 'bg-blue-400'} text-white rounded hover:bg-blue-500 text-sm`}
        >
          Front View
        </button>
        <button 
          type="button"
          onClick={() => setActiveView('back')}
          className={`px-4 py-2 ${activeView === 'back' ? 'bg-blue-600' : 'bg-blue-400'} text-white rounded hover:bg-blue-500 text-sm`}
          disabled={!loadedBackImage}
        >
          Back View
        </button>
        <button 
          type="button"
          onClick={() => setActiveView('side')}
          className={`px-4 py-2 ${activeView === 'side' ? 'bg-blue-600' : 'bg-blue-400'} text-white rounded hover:bg-blue-500 text-sm`}
          disabled={!loadedSideImage}
        >
          Side View
        </button>
      </div>
      
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <button 
            type="button"
            onClick={() => setShowAxes(!showAxes)}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            {showAxes ? 'Hide Axes' : 'Show Axes'}
          </button>
          
          <button 
            type="button"
            onClick={() => {
              if (isLassoActive) {
                setIsLassoActive(false);
              } else {
                setIsLassoActive(true);
                setIsCustomShapeSelected(false);
              }
            }}
            className={`px-3 py-1 ${isLassoActive ? 'bg-pink-500' : 'bg-blue-500'} text-white rounded hover:bg-blue-600 text-sm`}
          >
            {isLassoActive ? 'Cancel Lasso' : 'Magnetic Lasso'}
          </button>
          
          {useCustomShape && (
            <button 
              type="button"
              onClick={() => {
                setUseCustomShape(false);
                setCustomShapePoints([]);
                setIsCustomShapeSelected(false);
              }}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
            >
              Reset to Rectangle
            </button>
          )}
        </div>
        
        {/* Rotation Controls */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm font-medium">Rotation:</span>
          <button
            type="button"
            onClick={() => handleRotation((placeholder.rotation || 0) - 15)}
            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            -15°
          </button>
          <button
            type="button"
            onClick={() => handleRotation((placeholder.rotation || 0) - 5)}
            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            -5°
          </button>
          <span className="text-sm font-medium">{placeholder.rotation || 0}°</span>
          <button
            type="button"
            onClick={() => handleRotation((placeholder.rotation || 0) + 5)}
            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            +5°
          </button>
          <button
            type="button"
            onClick={() => handleRotation((placeholder.rotation || 0) + 15)}
            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            +15°
          </button>
          <button
            type="button"
            onClick={() => handleRotation(0)}
            className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default MockupCanvas;
