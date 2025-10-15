'use client';

import React, { useRef, useEffect } from 'react';
import { Line, Transformer } from 'react-konva';
import Konva from 'konva';
import { Point } from './MagneticLassoTool';

export interface CustomPlaceholderProps {
  points: Point[];
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  dash?: number[];
  opacity?: number;
  draggable?: boolean;
  onDragEnd?: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onTransformEnd?: (e: Konva.KonvaEventObject<Event>) => void;
  onSelect?: () => void;
  isSelected?: boolean;
}

const CustomPlaceholder: React.FC<CustomPlaceholderProps> = ({
  points,
  fill = 'rgba(244, 114, 182, 0.6)',
  stroke = 'blue',
  strokeWidth = 2,
  dash = [5, 5],
  opacity = 0.5,
  draggable = true,
  onDragEnd,
  onTransformEnd,
  onSelect,
  isSelected = false,
}) => {
  const shapeRef = useRef<Konva.Line>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  // Flatten points for Konva Line
  const flattenedPoints = points.reduce<number[]>((acc, point) => {
    acc.push(point.x, point.y);
    return acc;
  }, []);

  // Attach transformer when selected
  useEffect(() => {
    if (isSelected && shapeRef.current && transformerRef.current) {
      // Attach the transformer to the shape
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  // Calculate bounding box for the shape
  const getBoundingBox = (): { x: number; y: number; width: number; height: number } => {
    if (!points.length) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }

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

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  };

  // Get the bounding box
  const boundingBox = getBoundingBox();

  return (
    <>
      <Line
        ref={shapeRef}
        points={flattenedPoints}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        dash={dash}
        opacity={opacity}
        closed
        draggable={draggable}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={onDragEnd}
        onTransformEnd={onTransformEnd}
      />
      {isSelected && (
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            // Limit resize to reasonable values
            if (newBox.width < 20 || newBox.height < 20) {
              return oldBox;
            }
            return newBox;
          }}
          // Enable rotation
          rotateEnabled={true}
          // Enable resizing
          resizeEnabled={true}
          // Customize handles
          enabledAnchors={[
            'top-left',
            'top-center',
            'top-right',
            'middle-right',
            'bottom-right',
            'bottom-center',
            'bottom-left',
            'middle-left',
          ]}
        />
      )}
    </>
  );
};

export default CustomPlaceholder;
