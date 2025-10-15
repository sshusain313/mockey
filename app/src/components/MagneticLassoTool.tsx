'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Line, Circle } from 'react-konva';
import Konva from 'konva';

export interface Point {
  x: number;
  y: number;
}

export interface MagneticLassoToolProps {
  isActive: boolean;
  canvasWidth: number;
  canvasHeight: number;
  backgroundImage: HTMLImageElement | null;
  onComplete: (points: Point[]) => void;
  onCancel: () => void;
  magneticThreshold?: number;
  simplifyTolerance?: number;
}

const MagneticLassoTool: React.FC<MagneticLassoToolProps> = ({
  isActive,
  canvasWidth,
  canvasHeight,
  backgroundImage,
  onComplete,
  onCancel,
  magneticThreshold = 20,
  simplifyTolerance = 2,
}) => {
  const [points, setPoints] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<Point | null>(null);
  const [edgeData, setEdgeData] = useState<Uint8ClampedArray | null>(null);
  const imageDataRef = useRef<ImageData | null>(null);

  // Process the background image to detect edges when it changes
  useEffect(() => {
    if (!backgroundImage || !isActive) return;

    // Create an offscreen canvas to process the image
    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Draw the image on the canvas
    ctx.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);
    
    // Get the image data
    const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    imageDataRef.current = imageData;
    
    // Apply Sobel edge detection
    const edgeData = detectEdges(imageData);
    setEdgeData(edgeData);
    
    // We don't need to visualize the edge data in the UI anymore
    // as it was causing the Konva canvas error
  }, [backgroundImage, isActive, canvasWidth, canvasHeight]);

  // Detect edges using Sobel operator
  const detectEdges = (imageData: ImageData): Uint8ClampedArray => {
    const { width, height, data } = imageData;
    const output = new Uint8ClampedArray(data.length);
    
    // Convert to grayscale first
    const grayscale = new Uint8ClampedArray(width * height);
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const idx = (i * width + j) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        // Standard grayscale conversion
        grayscale[i * width + j] = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
      }
    }
    
    // Sobel kernels
    const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
    const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
    
    // Apply Sobel operator
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let pixelX = 0;
        let pixelY = 0;
        
        // Apply convolution
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = (y + ky) * width + (x + kx);
            const kernelIdx = (ky + 1) * 3 + (kx + 1);
            
            pixelX += grayscale[idx] * sobelX[kernelIdx];
            pixelY += grayscale[idx] * sobelY[kernelIdx];
          }
        }
        
        // Calculate gradient magnitude
        const magnitude = Math.sqrt(pixelX * pixelX + pixelY * pixelY);
        
        // Normalize and threshold
        const outputIdx = (y * width + x) * 4;
        const edgeStrength = Math.min(255, Math.max(0, Math.round(magnitude)));
        
        // Apply threshold to make edges more distinct
        output[outputIdx] = edgeStrength > 50 ? 255 : 0;
        output[outputIdx + 1] = edgeStrength > 50 ? 255 : 0;
        output[outputIdx + 2] = edgeStrength > 50 ? 255 : 0;
        output[outputIdx + 3] = 255;
      }
    }
    
    return output;
  };

  // Find the nearest edge point to the current mouse position
  const findNearestEdgePoint = (x: number, y: number): Point => {
    if (!edgeData || !imageDataRef.current) return { x, y };
    
    const { width, height } = imageDataRef.current;
    let minDistance = magneticThreshold * magneticThreshold;
    let nearestPoint = { x, y };
    
    // Search in a square area around the cursor
    const searchRadius = magneticThreshold;
    const startX = Math.max(0, Math.floor(x - searchRadius));
    const endX = Math.min(width - 1, Math.floor(x + searchRadius));
    const startY = Math.max(0, Math.floor(y - searchRadius));
    const endY = Math.min(height - 1, Math.floor(y + searchRadius));
    
    for (let py = startY; py <= endY; py++) {
      for (let px = startX; px <= endX; px++) {
        const idx = (py * width + px) * 4;
        
        // Check if this is an edge pixel
        if (edgeData[idx] > 0) {
          const dx = px - x;
          const dy = py - y;
          const distance = dx * dx + dy * dy;
          
          if (distance < minDistance) {
            minDistance = distance;
            nearestPoint = { x: px, y: py };
          }
        }
      }
    }
    
    return nearestPoint;
  };

  // Handle mouse move to find edges
  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isActive) return;
    
    const stage = e.target.getStage();
    if (!stage) return;
    
    const pointerPos = stage.getPointerPosition();
    if (!pointerPos) return;
    
    // Find the nearest edge point
    const magneticPoint = findNearestEdgePoint(pointerPos.x, pointerPos.y);
    setHoveredPoint(magneticPoint);
    
    // If we're drawing, add the point to our path
    if (isDrawing) {
      // Only add the point if it's far enough from the last point to avoid too many points
      const lastPoint = points[points.length - 1];
      if (!lastPoint || 
          Math.sqrt(
            Math.pow(magneticPoint.x - lastPoint.x, 2) + 
            Math.pow(magneticPoint.y - lastPoint.y, 2)
          ) > simplifyTolerance) {
        setPoints([...points, magneticPoint]);
      }
    }
  };

  // Start drawing
  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isActive || e.evt.button !== 0) return; // Only left mouse button
    
    const stage = e.target.getStage();
    if (!stage) return;
    
    const pointerPos = stage.getPointerPosition();
    if (!pointerPos) return;
    
    // Find the nearest edge point to start with
    const magneticPoint = findNearestEdgePoint(pointerPos.x, pointerPos.y);
    
    // Change cursor to indicate drawing mode
    stage.container().style.cursor = 'crosshair';
    
    setIsDrawing(true);
    setPoints([magneticPoint]);
    
    // Provide visual feedback
    console.log('Started magnetic lasso at', magneticPoint);
  };

  // Complete the shape
  const handleMouseUp = () => {
    if (!isActive || !isDrawing) return;
    
    // Reset cursor
    const stage = document.querySelector('canvas')?.parentElement;
    if (stage) {
      stage.style.cursor = 'default';
    }
    
    // Check if we have enough points to form a shape
    if (points.length >= 3) {
      // Close the shape by adding the first point again
      const closedPoints = [...points, points[0]];
      
      // Simplify the path to remove redundant points
      const simplifiedPoints = simplifyPath(closedPoints, simplifyTolerance);
      
      console.log(`Completed magnetic lasso with ${simplifiedPoints.length} points`);
      
      // Call the onComplete callback with the final points
      onComplete(simplifiedPoints);
    } else {
      console.warn('Not enough points to form a shape (minimum 3 required)');
      // Not enough points, cancel
      onCancel();
    }
    
    // Reset state
    setIsDrawing(false);
    setPoints([]);
  };

  // Handle key press to cancel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isActive) {
        setIsDrawing(false);
        setPoints([]);
        onCancel();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, onCancel]);

  // Simplify a path by removing points that are too close together
  const simplifyPath = (pathPoints: Point[], tolerance: number): Point[] => {
    if (pathPoints.length <= 2) return pathPoints;
    
    const result: Point[] = [pathPoints[0]];
    
    for (let i = 1; i < pathPoints.length - 1; i++) {
      const prev = result[result.length - 1];
      const current = pathPoints[i];
      const next = pathPoints[i + 1];
      
      // Calculate distances
      const d1 = Math.sqrt(
        Math.pow(current.x - prev.x, 2) + 
        Math.pow(current.y - prev.y, 2)
      );
      
      const d2 = Math.sqrt(
        Math.pow(next.x - current.x, 2) + 
        Math.pow(next.y - current.y, 2)
      );
      
      // Skip points that are too close to their neighbors
      if (d1 > tolerance || d2 > tolerance) {
        result.push(current);
      }
    }
    
    // Always include the last point to close the shape
    result.push(pathPoints[pathPoints.length - 1]);
    
    return result;
  };

  // Convert points to the format needed by Konva Line
  const flattenPoints = (pts: Point[]): number[] => {
    return pts.reduce<number[]>((acc, point) => {
      acc.push(point.x, point.y);
      return acc;
    }, []);
  };

  // Only render if the tool is active
  if (!isActive) return null;

  return (
    <>
      {/* The path being drawn */}
      {points.length > 0 && (
        <Line
          points={flattenPoints(points)}
          stroke="#FF00FF"
          strokeWidth={2}
          lineCap="round"
          lineJoin="round"
          dash={[5, 5]}
        />
      )}
      
      {/* Show the current magnetic point */}
      {hoveredPoint && (
        <Circle
          x={hoveredPoint.x}
          y={hoveredPoint.y}
          radius={5}
          fill="rgba(255, 0, 255, 0.5)"
          stroke="#FF00FF"
          strokeWidth={1}
        />
      )}
      
      {/* Invisible layer to capture mouse events */}
      <Line
        points={[0, 0, canvasWidth, 0, canvasWidth, canvasHeight, 0, canvasHeight, 0, 0]}
        closed
        stroke="transparent"
        fill="transparent"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        listening={isActive}
      />
    </>
  );
};

export default MagneticLassoTool;
