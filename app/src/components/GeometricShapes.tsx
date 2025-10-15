'use client';

import React, { useRef, useEffect } from 'react';
import { Line, Circle, RegularPolygon, Star } from 'react-konva';
import Konva from 'konva';
import { GeometricPattern } from './GeometricPatternSelector';

interface GeometricShapeProps {
  pattern: GeometricPattern;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  dash?: number[];
  draggable?: boolean;
  onDragStart?: () => void;
  onDragEnd?: (e: any) => void;
  onDragMove?: (e: any) => void;
  onTransform?: (e: any) => void;
  onTransformEnd?: (e: any) => void;
}

const GeometricShape: React.FC<GeometricShapeProps> = ({
  pattern,
  x,
  y,
  width,
  height,
  fill,
  stroke,
  strokeWidth,
  opacity,
  dash,
  draggable,
  onDragStart,
  onDragEnd,
  onDragMove,
  onTransform,
  onTransformEnd,
}) => {
  // Create refs for each shape type
  const circleRef = useRef<Konva.Circle>(null);
  const lineRef = useRef<Konva.Line>(null);
  const hexagonRef = useRef<Konva.RegularPolygon>(null);
  const pentagonRef = useRef<Konva.RegularPolygon>(null);
  const starRef = useRef<Konva.Star>(null);
  
  // Force update to ensure draggable property is applied
  useEffect(() => {
    // Only apply to shapes we're managing with refs
    if (['circle', 'triangle', 'hexagon', 'pentagon', 'star'].includes(pattern)) {
      const shape = {
        circle: circleRef.current,
        triangle: lineRef.current,
        hexagon: hexagonRef.current,
        pentagon: pentagonRef.current,
        star: starRef.current
      }[pattern as 'circle' | 'triangle' | 'hexagon' | 'pentagon' | 'star'];
      
      if (shape) {
        shape.draggable(!!draggable);
      }
    }
  }, [pattern, draggable]);
  // Calculate center point and radius/size
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  const radius = Math.min(width, height) / 2;
  
  // For triangle
  const trianglePoints = [
    centerX, y,
    x, y + height,
    x + width, y + height
  ];
  
  switch (pattern) {
    case 'circle':
      return (
        <Circle
          ref={circleRef}
          x={centerX}
          y={centerY}
          radius={radius}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          opacity={opacity}
          dash={dash}
          draggable={draggable}
          onDragStart={onDragStart}
          onDragMove={onDragMove}
          onDragEnd={onDragEnd}
          onTransform={onTransform}
          onTransformEnd={onTransformEnd}
        />
      );
      
    case 'triangle':
      return (
        <Line
          ref={lineRef}
          points={trianglePoints}
          closed
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          opacity={opacity}
          dash={dash}
          draggable={draggable}
          onDragStart={onDragStart}
          onDragMove={onDragMove}
          onDragEnd={onDragEnd}
          onTransform={onTransform}
          onTransformEnd={onTransformEnd}
        />
      );
      
    case 'hexagon':
      return (
        <RegularPolygon
          ref={hexagonRef}
          x={centerX}
          y={centerY}
          sides={6}
          radius={radius}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          opacity={opacity}
          dash={dash}
          draggable={draggable}
          onDragStart={onDragStart}
          onDragMove={onDragMove}
          onDragEnd={onDragEnd}
          onTransform={onTransform}
          onTransformEnd={onTransformEnd}
        />
      );
      
    case 'pentagon':
      return (
        <RegularPolygon
          ref={pentagonRef}
          x={centerX}
          y={centerY}
          sides={5}
          radius={radius}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          opacity={opacity}
          dash={dash}
          draggable={draggable}
          onDragStart={onDragStart}
          onDragMove={onDragMove}
          onDragEnd={onDragEnd}
          onTransform={onTransform}
          onTransformEnd={onTransformEnd}
        />
      );
      
    case 'star':
      return (
        <Star
          ref={starRef}
          x={centerX}
          y={centerY}
          numPoints={5}
          innerRadius={radius * 0.5}
          outerRadius={radius}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          opacity={opacity}
          dash={dash}
          draggable={draggable}
          onDragStart={onDragStart}
          onDragMove={onDragMove}
          onDragEnd={onDragEnd}
          onTransform={onTransform}
          onTransformEnd={onTransformEnd}
        />
      );
      
    // Rectangle is handled by the parent component using Konva's Rect
    // Custom shape is handled by the CustomPlaceholder component
    default:
      return null;
  }
};

export default GeometricShape;
