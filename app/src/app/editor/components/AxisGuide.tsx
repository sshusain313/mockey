'use client';

import React from 'react';
import { Group, Line, Circle, Text } from 'react-konva';

interface AxisGuideProps {
  x: number;
  y: number;
  size: number;
  rotationX: number;
  rotationY: number;
  onRotationChange?: (axis: 'x' | 'y', value: number) => void;
  visible: boolean;
}

const AxisGuide: React.FC<AxisGuideProps> = ({
  x,
  y,
  size,
  rotationX,
  rotationY,
  onRotationChange,
  visible
}) => {
  if (!visible) return null;
  
  // Calculate the length of the axes based on the size
  const axisLength = size * 0.5;
  
  // Calculate the end points of the axes based on rotation values
  const xAxisEndX = x + axisLength * Math.cos(rotationY * Math.PI / 180);
  const xAxisEndY = y;
  
  const yAxisEndX = x;
  const yAxisEndY = y - axisLength * Math.cos(rotationX * Math.PI / 180);
  
  // Handle rotation of X axis
  const handleXAxisDrag = (e: any) => {
    if (!onRotationChange) return;
    
    const stage = e.target.getStage();
    if (!stage) return;
    
    const pointerPos = stage.getPointerPosition();
    if (!pointerPos) return;
    
    // Calculate angle from center to pointer position
    const angle = Math.atan2(y - pointerPos.y, pointerPos.x - x) * 180 / Math.PI;
    
    // Clamp the angle to the allowed range (-45 to 45 degrees)
    const clampedAngle = Math.max(-45, Math.min(45, angle));
    
    // Update the rotation value
    onRotationChange('y', Math.round(clampedAngle));
  };
  
  // Handle rotation of Y axis
  const handleYAxisDrag = (e: any) => {
    if (!onRotationChange) return;
    
    const stage = e.target.getStage();
    if (!stage) return;
    
    const pointerPos = stage.getPointerPosition();
    if (!pointerPos) return;
    
    // Calculate angle from center to pointer position
    const angle = Math.atan2(y - pointerPos.y, x - pointerPos.x) * 180 / Math.PI;
    
    // Clamp the angle to the allowed range (-45 to 45 degrees)
    const clampedAngle = Math.max(-45, Math.min(45, angle));
    
    // Update the rotation value
    onRotationChange('x', Math.round(clampedAngle));
  };
  
  return (
    <Group>
      {/* Origin point */}
      <Circle
        x={x}
        y={y}
        radius={6}
        fill="#333"
        stroke="#fff"
        strokeWidth={1.5}
      />
      
      {/* X-axis (horizontal) */}
      <Group onMouseDown={handleXAxisDrag} onTouchStart={handleXAxisDrag}>
        <Line
          points={[x - axisLength, y, x + axisLength, y]}
          stroke="#2196F3"
          strokeWidth={2}
          dash={[5, 2]}
        />
        
        {/* X-axis indicator */}
        <Circle
          x={xAxisEndX}
          y={xAxisEndY}
          radius={10}
          fill="#2196F3"
          stroke="#fff"
          strokeWidth={2}
          draggable
          onDragMove={handleXAxisDrag}
        />
        
        {/* X-axis label */}
        <Text
          x={x + axisLength + 5}
          y={y - 10}
          text="X"
          fontSize={14}
          fontStyle="bold"
          fill="#2196F3"
        />
        
        {/* X-axis rotation value */}
        <Text
          x={x + axisLength / 2}
          y={y + 5}
          text={`${rotationY}°`}
          fontSize={12}
          fill="#2196F3"
          align="center"
        />
      </Group>
      
      {/* Y-axis (vertical) */}
      <Group onMouseDown={handleYAxisDrag} onTouchStart={handleYAxisDrag}>
        <Line
          points={[x, y - axisLength, x, y + axisLength]}
          stroke="#F44336"
          strokeWidth={2}
          dash={[5, 2]}
        />
        
        {/* Y-axis indicator */}
        <Circle
          x={yAxisEndX}
          y={yAxisEndY}
          radius={10}
          fill="#F44336"
          stroke="#fff"
          strokeWidth={2}
          draggable
          onDragMove={handleYAxisDrag}
        />
        
        {/* Y-axis label */}
        <Text
          x={x - 10}
          y={y - axisLength - 20}
          text="Y"
          fontSize={14}
          fontStyle="bold"
          fill="#F44336"
        />
        
        {/* Y-axis rotation value */}
        <Text
          x={x - 25}
          y={y - axisLength / 2}
          text={`${rotationX}°`}
          fontSize={12}
          fill="#F44336"
          align="center"
        />
      </Group>
      
      {/* Grid lines for reference */}
      <Group opacity={0.2}>
        {/* Horizontal grid lines */}
        {[-30, -15, 0, 15, 30].map((degree, i) => (
          <Line
            key={`h-grid-${i}`}
            points={[
              x - axisLength * 0.8,
              y + (axisLength * 0.8 * degree) / 45,
              x + axisLength * 0.8,
              y + (axisLength * 0.8 * degree) / 45
            ]}
            stroke="#999"
            strokeWidth={1}
            dash={[2, 2]}
          />
        ))}
        
        {/* Vertical grid lines */}
        {[-30, -15, 0, 15, 30].map((degree, i) => (
          <Line
            key={`v-grid-${i}`}
            points={[
              x + (axisLength * 0.8 * degree) / 45,
              y - axisLength * 0.8,
              x + (axisLength * 0.8 * degree) / 45,
              y + axisLength * 0.8
            ]}
            stroke="#999"
            strokeWidth={1}
            dash={[2, 2]}
          />
        ))}
      </Group>
      
      {/* Rotation guide */}
      <Circle
        x={x}
        y={y}
        radius={axisLength * 0.9}
        stroke="#999"
        strokeWidth={1}
        dash={[2, 2]}
        opacity={0.2}
      />
    </Group>
  );
};

export default AxisGuide;
