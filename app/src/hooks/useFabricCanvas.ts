'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import loadFabric from '@/lib/loadFabric';
import fabric from 'fabric';

interface DesignConfig {
  scaleX: number;
  scaleY: number;
  top: number;
  left: number;
  angle: number;
  opacity: number;
  blendMode: string;
  warpFactor: number;
  clipToPlaceholder: boolean;
}

interface Placeholder {
  x: number;
  y: number;
  width: number;
  height: number;
  shape: 'rectangle' | 'polygon';
  points?: Array<{ x: number, y: number }>;
}

interface UseFabricCanvasProps {
  mockupImage: string;
  designImage: string | null;
  categories: string[];
  width?: number;
  height?: number;
  placeholder?: Placeholder;
  maintainAspectRatio?: boolean;
  unclipMode?: boolean;
  manualPosition?: { x: number, y: number } | null;
  onPositionChange?: (position: { x: number, y: number }) => void;
}

export const useFabricCanvas = ({
  mockupImage,
  designImage,
  categories = [],
  width = 300,
  height = 300,
  placeholder,
  maintainAspectRatio = true,
  unclipMode = false,
  manualPosition = null,
  onPositionChange
}: UseFabricCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<any>(null);
  const designImageRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [fabricLib, setFabricLib] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      loadFabric()
        .then((fabricInstance) => {
          setFabricLib(fabricInstance);
          setIsReady(true);
        })
        .catch(console.error);
    }
  }, []);

  const loadDesignOnCanvas = useCallback((canvas: any, designUrl: string, config: DesignConfig) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = designUrl;
    img.onload = () => {
      const designImg = new fabricLib.Image(img);

      const centerX = placeholder ? placeholder.x + placeholder.width / 2 : width / 2;
      const centerY = placeholder ? placeholder.y + placeholder.height / 2 : height / 2;

      designImg.set({
        originX: 'center',
        originY: 'center',
        left: manualPosition?.x || centerX,
        top: manualPosition?.y || centerY,
        scaleX: config.scaleX,
        scaleY: config.scaleY,
        angle: config.angle,
        opacity: config.opacity,
        globalCompositeOperation: config.blendMode,
        selectable: true,
        hasControls: true,
        lockUniScaling: maintainAspectRatio
      });

      if (config.clipToPlaceholder && placeholder) {
        designImg.clipPath = new fabricLib.Rect({
          left: placeholder.x,
          top: placeholder.y,
          width: placeholder.width,
          height: placeholder.height
        });
      }

      canvas.add(designImg);
      canvas.setActiveObject(designImg);
      canvas.renderAll();
      designImageRef.current = designImg;
    };
  }, [fabricLib, placeholder, width, height, maintainAspectRatio, manualPosition]);

  useEffect(() => {
    if (!canvasRef.current || !isReady || !fabricLib) return;
    const canvas = new fabricLib.Canvas(canvasRef.current, {
      width,
      height,
      selection: false
    });
    fabricCanvasRef.current = canvas;

    if (mockupImage) {
      fabricLib.Image.fromURL(mockupImage, (img: any) => {
        img.scaleToWidth(width);
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
        if (designImage) {
          const config = getDesignConfig(categories);
          loadDesignOnCanvas(canvas, designImage, config);
        }
      });
    }

    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [isReady, fabricLib, mockupImage, designImage, loadDesignOnCanvas, width, height, categories]);

  const getDesignConfig = (categories: string[]): DesignConfig => {
    const isDarkFabric = categories.some(cat => ['Dark', 'Black', 'Navy', 'Charcoal'].includes(cat));
    let config: DesignConfig = {
      scaleX: 0.35,
      scaleY: 0.35,
      top: height / 2,
      left: width / 2,
      angle: categories.includes("Side View") ? 15 : 0,
      opacity: 0.9,
      blendMode: isDarkFabric ? 'screen' : 'multiply',
      warpFactor: 0.05,
      clipToPlaceholder: !unclipMode
    };
    return config;
  };

  const getCanvasDataURL = useCallback(() => {
    return fabricCanvasRef.current?.toDataURL({ format: 'png', quality: 1 }) || null;
  }, []);

  return {
    canvasRef,
    isReady,
    getCanvasDataURL
  };
};
export default useFabricCanvas;