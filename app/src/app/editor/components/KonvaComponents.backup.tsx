// 'use client';

// import React, { useState, useEffect, useRef } from 'react';
// import { Stage, Layer, Image as KonvaImage, Group, Rect, Text, Transformer } from 'react-konva';
// import useImage from 'use-image';
// import Konva from 'konva';
// import { KonvaEventObject } from 'konva/lib/Node';
// import AxisGuide from './AxisGuide';

// interface DesignCanvasProps {
//   productImage: string;
//   designImage: string | null;
//   placeholder: any;
//   placeholderType?: 'rectangle' | 'magneticLasso' | 'customShape';
//   containerWidth: number;
//   containerHeight: number;
//   categories?: string[];
//   stageRef: React.RefObject<any>;
//   maintainAspectRatio?: boolean;
//   onToggleAspectRatio?: () => void;
//   productName?: string;
//   productDescription?: string;
//   productPrice?: number;
//   customShapePoints?: Array<{x: number, y: number}>;
//   onModeChange?: (mode: 'edit' | 'preview') => void;
//   // Rotation props
//   rotationX?: number;
//   rotationY?: number;
//   onRotationChange?: (rotationX: number, rotationY: number) => void;
//   // Scaling props
//   scaleX?: number;
//   scaleY?: number;
//   onScaleChange?: (scaleX: number, scaleY: number) => void;
//   // Wrapping props
//   warpingValue?: number;
//   warpingDirection?: 'horizontal' | 'vertical';
//   warpingStyle?: 'wave' | 'bulge' | 'pinch';
//   warpingFrequency?: number;
//   warpingAmplitude?: number;
//   warpingPhase?: number;
// }

// const KonvaComponents = ({
//   productImage,
//   designImage,
//   placeholder,
//   placeholderType = 'rectangle',
//   containerWidth,
//   containerHeight,
//   categories = [],
//   stageRef,
//   maintainAspectRatio: propMaintainAspectRatio,
//   onToggleAspectRatio,
//   productName,
//   productDescription,
//   productPrice,
//   customShapePoints = [],
//   onModeChange,
//   // Rotation props with default values
//   rotationX = 0,
//   rotationY = 0,
//   onRotationChange,
//   // Scaling props with default values
//   scaleX = 1,
//   scaleY = 1,
//   onScaleChange,
//   // Wrapping props with default values
//   warpingValue = 0,
//   warpingDirection = 'horizontal',
//   warpingStyle = 'wave',
//   warpingFrequency = 3,
//   warpingAmplitude = 10,
//   warpingPhase = 0
// }: DesignCanvasProps) => {
//   // Load product image with standard method
//   const [productImg] = useImage(productImage);
  
//   // Custom hook for loading design image with quality preservation
//   const [designImg, designImgStatus] = useImage(designImage || '');
  
//   // Create a high-quality version of the design image when it loads
//   const [highQualityDesignImg, setHighQualityDesignImg] = useState<HTMLImageElement | null>(null);
  
//   useEffect(() => {
//     if (designImg && designImgStatus === 'loaded') {
//       // Create a high-quality version of the image
//       const img = new Image();
//       img.crossOrigin = 'Anonymous'; // Handle CORS if needed
      
//       // Set image rendering attributes for high quality
//       img.style.imageRendering = 'high-quality';
      
//       img.onload = () => {
//         setHighQualityDesignImg(img);
//       };
      
//       img.src = designImage || '';
//     }
//   }, [designImg, designImgStatus, designImage]);
//   const [designPosition, setDesignPosition] = useState({ x: 0, y: 0 });
//   const [designDimensions, setDesignDimensions] = useState({ width: 0, height: 0 });
//   const [designScale, setDesignScale] = useState(1);
//   const [mode, setMode] = useState<'edit' | 'preview'>('edit');
//   const [isSelected, setIsSelected] = useState(false);
//   const [showRotationControls, setShowRotationControls] = useState(false);
//   const [localRotationX, setLocalRotationX] = useState(rotationX);
//   const [localRotationY, setLocalRotationY] = useState(rotationY);
//   const [isDraggingXAxis, setIsDraggingXAxis] = useState(false);
//   const [isDraggingYAxis, setIsDraggingYAxis] = useState(false);
//   const designImageRef = useRef<Konva.Image>(null);
//   const transformerRef = useRef<Konva.Transformer>(null);
//   const xAxisRef = useRef<Konva.Group>(null);
//   const yAxisRef = useRef<Konva.Group>(null);
//   const [maintainAspectRatio, setMaintainAspectRatio] = useState(
//     propMaintainAspectRatio !== undefined ? propMaintainAspectRatio : true
//   );
  
//   // Toggle between edit and preview modes
//   const toggleMode = () => {
//     const newMode = mode === 'edit' ? 'preview' : 'edit';
//     setMode(newMode);
    
//     // Deselect when switching to preview mode
//     if (newMode === 'preview') {
//       setIsSelected(false);
//     }
    
//     if (onModeChange) {
//       onModeChange(newMode);
//     }
//   };
  
//   // Update maintainAspectRatio when prop changes
//   useEffect(() => {
//     if (propMaintainAspectRatio !== undefined) {
//       setMaintainAspectRatio(propMaintainAspectRatio);
//     }
//   }, [propMaintainAspectRatio]);
  
//   // Update local rotation state when props change
//   useEffect(() => {
//     setLocalRotationX(rotationX);
//     setLocalRotationY(rotationY);
//   }, [rotationX, rotationY]);
  
//   // Connect transformer to design image when selected
//   useEffect(() => {
//     if (isSelected && designImageRef.current && transformerRef.current) {
//       // Attach transformer to the image
//       transformerRef.current.nodes([designImageRef.current]);
//       transformerRef.current.getLayer()?.batchDraw();
//     }
//   }, [isSelected]);
  
//   // Handle click on empty areas to deselect
//   const checkDeselect = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
//     // Only handle deselection in edit mode
//     if (mode !== 'edit') return;
    
//     // Clicked on empty area - deselect
//     const clickedOnEmpty = e.target === e.target.getStage();
//     if (clickedOnEmpty) {
//       setIsSelected(false);
//     }
//   };

//   // Calculate product image scale and position
//   const productScale = productImg ? Math.min(
//     containerWidth / productImg.width,
//     containerHeight / productImg.height
//   ) : 1;

//   const productX = productImg ? (containerWidth - productImg.width * productScale) / 2 : 0;
//   const productY = productImg ? (containerHeight - productImg.height * productScale) / 2 : 0;

//   // Position the design image using percentage-based positioning for consistent sizing
//   useEffect(() => {
//     if (productImg && placeholder && designImg) {
//       // Fixed dimensions for consistency with gallery view
//       const ADMIN_CANVAS_WIDTH = 400;
//       const ADMIN_CANVAS_HEIGHT = 400;
      
//       // Check if we have percentage-based placeholder data
//       const hasPercentageData = placeholder.xPercent !== undefined && 
//                              placeholder.yPercent !== undefined && 
//                              placeholder.widthPercent !== undefined && 
//                              placeholder.heightPercent !== undefined;
      
//       // Use percentage-based positioning if available, otherwise fall back to pixel-based
//       let scaledPlaceholder;
      
//       if (hasPercentageData) {
//         // Use percentage-based positioning (preferred method)
//         scaledPlaceholder = {
//           x: (placeholder.xPercent / 100) * containerWidth,
//           y: (placeholder.yPercent / 100) * containerHeight,
//           width: (placeholder.widthPercent / 100) * containerWidth,
//           height: (placeholder.heightPercent / 100) * containerHeight
//         };
//       } else {
//         // Fall back to pixel-based positioning with scaling
//         const scaleX = containerWidth / ADMIN_CANVAS_WIDTH;
//         const scaleY = containerHeight / ADMIN_CANVAS_HEIGHT;
        
//         scaledPlaceholder = {
//           x: placeholder.x * scaleX,
//           y: placeholder.y * scaleY,
//           width: placeholder.width * scaleX,
//           height: placeholder.height * scaleY
//         };
//       }
      
//       // Calculate design image dimensions with quality preservation
//       const designAspectRatio = designImg.width / designImg.height;
//       let finalWidth, finalHeight;
      
//       // Get the original image dimensions for quality calculation
//       const originalWidth = designImg.width;
//       const originalHeight = designImg.height;
      
//       // Calculate the placeholder aspect ratio
//       const placeholderAspectRatio = scaledPlaceholder.width / scaledPlaceholder.height;
      
//       if (maintainAspectRatio) {
//         // Maintain aspect ratio
//         if (designAspectRatio > placeholderAspectRatio) {
//           // Design is wider than placeholder (relative to height)
//           finalWidth = scaledPlaceholder.width;
//           finalHeight = finalWidth / designAspectRatio;
//         } else {
//           // Design is taller than placeholder (relative to width)
//           finalHeight = scaledPlaceholder.height;
//           finalWidth = finalHeight * designAspectRatio;
//         }
//       } else {
//         // Don't maintain aspect ratio, just use placeholder dimensions
//         finalWidth = scaledPlaceholder.width;
//         finalHeight = scaledPlaceholder.height;
//       }
      
//       // Calculate quality preservation factors
//       const scaleFactor = Math.min(finalWidth / originalWidth, finalHeight / originalHeight);
      
//       // If we're scaling down significantly, we'll apply quality preservation techniques
//       // This helps maintain image quality even when the image is displayed at a smaller size
//       const needsQualityPreservation = scaleFactor < 0.8;
      
//       if (needsQualityPreservation) {
//         console.log('Applying quality preservation for scaled design image');
//         // We'll use the high-quality image loading we set up earlier
//       }
      
//       // Center the design within the placeholder
//       const finalX = scaledPlaceholder.x + (scaledPlaceholder.width - finalWidth) / 2;
//       const finalY = scaledPlaceholder.y + (scaledPlaceholder.height - finalHeight) / 2;
      
//       // Position the design image at the calculated coordinates
//       setDesignPosition({
//         x: finalX,
//         y: finalY
//       });
      
//       // Set the dimensions to match the calculated values
//       setDesignDimensions({
//         width: finalWidth,
//         height: finalHeight
//       });
      
//       // Calculate the scale factor for the design
//       const designScaleFactor = finalWidth / designImg.width;
//       setDesignScale(designScaleFactor);
      
//       console.log(`Design scaled with factor: ${designScaleFactor}, maintaining quality`);
//     }
//   }, [designImg, placeholder, containerWidth, containerHeight, maintainAspectRatio, productImg]);

//   // Determine the appropriate blend mode based on t-shirt color
//   const getBlendMode = () => {
//     if (categories.includes("Dark") || categories.includes("Black")) {
//       return 'screen';
//     } else if (categories.includes("Colored")) {
//       return 'multiply';
//     } else {
//       return 'multiply';
//     }
//   };

//   const getOpacity = () => {
//     return categories.includes("Dark") || categories.includes("Black") ? 0.9 : 0.95;
//   };

//   const shadowParams = {
//     shadowColor: categories.includes("Dark") || categories.includes("Black") ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
//     shadowBlur: 3,
//     shadowOffset: { x: 1, y: 1 },
//     shadowOpacity: 0.3
//   };

//   // Calculate wrapping transformations for the design with quality preservation
//   const calculateWarpingTransforms = () => {
//     // If no warping, return default values
//     if (warpingValue === 0) {
//       return {
//         scaleX: 1,
//         scaleY: 1,
//         skewX: 0,
//         skewY: 0,
//         offsetX: 0,
//         offsetY: 0,
//         // Quality preservation properties
//         quality: 1
//       };
//     }
    
//     // Initialize transform values with quality preservation
//     let transformValues = {
//       scaleX: 1,
//       scaleY: 1,
//       skewX: 0,
//       skewY: 0,
//       offsetX: 0,
//       offsetY: 0,
//       // Quality preservation value (1 = highest quality)
//       quality: 1
//     };
    
//     // Apply intensity factor to all transformations
//     const intensityFactor = warpingValue / 100;
    
//     // Calculate quality adjustment based on transformation intensity
//     // This ensures that more extreme transformations don't lose quality
//     const qualityPreservationFactor = Math.max(0.9, 1 - Math.abs(intensityFactor) * 0.1);
    
//     // Apply different transforms based on style
//     switch (warpingStyle) {
//       case 'wave':
//         if (warpingDirection === 'horizontal') {
//           // Horizontal wave effect
//           transformValues.skewY = warpingValue / 5;
//           transformValues.scaleY = 1 + (Math.abs(intensityFactor) * 0.5);
          
//           // Add wave effect with advanced parameters
//           if (warpingFrequency > 0) {
//             const phase = warpingPhase * Math.PI / 180;
//             const amplitude = warpingAmplitude * intensityFactor;
//             const frequency = warpingFrequency / 10;
            
//             // Apply sine wave distortion - use a single offset for the entire image
//             // This creates a more consistent wave effect
//             const waveOffset = Math.sin(phase) * amplitude;
//             transformValues.offsetY = waveOffset;
//           }
//         } else {
//           // Vertical wave effect
//           transformValues.skewX = warpingValue / 5;
//           transformValues.scaleX = 1 + (Math.abs(intensityFactor) * 0.5);
          
//           // Add wave effect with advanced parameters
//           if (warpingFrequency > 0) {
//             const phase = warpingPhase * Math.PI / 180;
//             const amplitude = warpingAmplitude * intensityFactor;
//             const frequency = warpingFrequency / 10;
            
//             // Apply sine wave distortion - use a single offset for the entire image
//             // This creates a more consistent wave effect
//             const waveOffset = Math.sin(phase) * amplitude;
//             transformValues.offsetX = waveOffset;
//           }
//         }
//         break;
        
//       case 'bulge':
//         // Bulge effect (expand from center)
//         const bulgeScale = 1 + (intensityFactor * 2);
//         transformValues.scaleX = bulgeScale;
//         transformValues.scaleY = bulgeScale;
        
//         // Add frequency-based bulge effect if advanced parameters are available
//         if (warpingFrequency > 0) {
//           const phase = warpingPhase * Math.PI / 180;
//           const bulgeOffset = Math.sin(phase) * (warpingAmplitude * intensityFactor);
          
//           if (warpingDirection === 'horizontal') {
//             transformValues.offsetY = bulgeOffset;
//           } else {
//             transformValues.offsetX = bulgeOffset;
//           }
//         }
//         break;
        
//       case 'pinch':
//         // Pinch effect (contract from center)
//         const pinchScale = Math.max(0.5, 1 - (Math.abs(intensityFactor) * 2));
//         transformValues.scaleX = pinchScale;
//         transformValues.scaleY = pinchScale;
        
//         // Add skew for advanced pinch effect
//         const skewAngle = intensityFactor * 2;
//         if (warpingDirection === 'horizontal') {
//           transformValues.skewY = skewAngle;
//         } else {
//           transformValues.skewX = skewAngle;
//         }
        
//         // Add frequency-based pinch effect if advanced parameters are available
//         if (warpingFrequency > 0) {
//           const phase = warpingPhase * Math.PI / 180;
//           const pinchOffset = Math.cos(phase) * (warpingAmplitude * intensityFactor * 0.5);
          
//           if (warpingDirection === 'horizontal') {
//             transformValues.offsetY = pinchOffset;
//           } else {
//             transformValues.offsetX = pinchOffset;
//           }
//         }
//         break;
//     }
    
//     // Apply quality preservation factor to the final transform values
//     transformValues.quality = qualityPreservationFactor;
    
//     // Log quality preservation information
//     console.log(`Applied wrapping with quality preservation factor: ${qualityPreservationFactor}`);
    
//     return transformValues;
//   };

//   const toggleAspectRatio = () => {
//     const newValue = !maintainAspectRatio;
//     setMaintainAspectRatio(newValue);
//     if (onToggleAspectRatio) {
//       onToggleAspectRatio();
//     }
//   };
  
//   // Toggle rotation controls visibility
//   const toggleRotationControls = () => {
//     setShowRotationControls(!showRotationControls);
//   };
  
//   // Handle rotation changes
//   const handleRotationChange = (newRotationX: number, newRotationY: number) => {
//     setLocalRotationX(newRotationX);
//     setLocalRotationY(newRotationY);
    
//     if (onRotationChange) {
//       onRotationChange(newRotationX, newRotationY);
//     }
//   };
  
//   // Handle X-axis drag
//   const handleXAxisDrag = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
//     if (!isDraggingXAxis) return;
    
//     const stage = e.target.getStage();
//     if (!stage) return;
    
//     const pointerPos = stage.getPointerPosition();
//     if (!pointerPos) return;
    
//     // Calculate rotation based on drag position relative to design center
//     const designCenter = {
//       x: designPosition.x + designDimensions.width / 2,
//       y: designPosition.y + designDimensions.height / 2
//     };
    
//     // Map horizontal movement to X-axis rotation (up/down tilt)
//     // Limit rotation to a reasonable range (-30 to 30 degrees)
//     const newRotationX = Math.max(-30, Math.min(30, (pointerPos.y - designCenter.y) / 5));
    
//     handleRotationChange(newRotationX, localRotationY);
//   };
  
//   // Handle Y-axis drag
//   const handleYAxisDrag = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
//     if (!isDraggingYAxis) return;
    
//     const stage = e.target.getStage();
//     if (!stage) return;
    
//     const pointerPos = stage.getPointerPosition();
//     if (!pointerPos) return;
    
//     // Calculate rotation based on drag position relative to design center
//     const designCenter = {
//       x: designPosition.x + designDimensions.width / 2,
//       y: designPosition.y + designDimensions.height / 2
//     };
    
//     // Map horizontal movement to Y-axis rotation (left/right tilt)
//     // Limit rotation to a reasonable range (-30 to 30 degrees)
//     const newRotationY = Math.max(-30, Math.min(30, (designCenter.x - pointerPos.x) / 5));
    
//     handleRotationChange(localRotationX, newRotationY);
//   };

//   return (
//     <>
//       <div className="mb-2 flex items-center justify-between w-full">
//         <div className="flex items-center space-x-2 ">
//           {process.env.NODE_ENV !== 'production' && (
//             <button
//               onClick={toggleAspectRatio}
//               className={`px-2 py-1 text-xs rounded ${maintainAspectRatio ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
//             >
//               {maintainAspectRatio ? 'Maintaining Aspect Ratio' : 'Using Exact Placeholder Size'}
//             </button>
//           )}
          
//           <div className="flex flex-col gap-1">
//             <div className="flex items-center bg-blue-50 px-3 py-1 rounded-md border border-blue-200">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
//               </svg>
//               <span className="text-xs text-blue-700 font-medium">Drag design to reposition</span>
//             </div>
            
//             {mode === 'edit' && (
//               <>
//                 <div className="flex items-center bg-green-50 px-3 py-1 rounded-md border border-green-200">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
//                   </svg>
//                   <span className="text-xs text-green-700 font-medium">Click design and use corner handles to resize</span>
//                 </div>
                
//                 <div className="flex items-center bg-purple-50 px-3 py-1 rounded-md border border-purple-200 cursor-pointer" onClick={toggleRotationControls}>
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                   </svg>
//                   <span className="text-xs text-purple-700 font-medium">
//                     {showRotationControls ? 'Hide 3D Rotation Controls' : 'Show 3D Rotation Controls'}
//                   </span>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
        
//         {/* Edit/Preview Toggle Button */}
//         <div className="relative">
//           <button 
//             onClick={toggleMode}
//             className="flex items-center space-x-1 px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 border border-gray-300 transition-colors duration-200"
//           >
//             {mode === 'edit' ? (
//               <>
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                 </svg>
//                 <span className="text-xs font-medium text-gray-700">Preview</span>
//               </>
//             ) : (
//               <>
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
//                 </svg>
//                 <span className="text-xs font-medium text-gray-700">Edit</span>
//               </>
//             )}
//           </button>
//         </div>
//       </div>

//       <Stage
//         width={containerWidth}
//         height={containerHeight}
//         ref={stageRef}
//         onClick={checkDeselect}
//         onTap={checkDeselect}
//         style={{ background: 'red' }} // Set the canvas background to red
//       >
//         <Layer>
//           {productImg && (
//             <KonvaImage
//               image={productImg}
//               x={productX}
//               y={productY}
//               width={productImg.width * productScale}
//               height={productImg.height * productScale}
              
//             />
//           )}

//           {designImg && placeholder && designDimensions.width > 0 && (
//             <>
//               <KonvaImage
//                 ref={designImageRef}
//                 image={highQualityDesignImg || designImg}
//                 // Position with rotation center offset
//                 x={designPosition.x + designDimensions.width / 2}
//                 y={designPosition.y + designDimensions.height / 2}
//                 width={designDimensions.width}
//                 height={designDimensions.height}
//                 globalCompositeOperation={getBlendMode()}
//                 opacity={getOpacity()}
//                 shadowColor={shadowParams.shadowColor}
//                 shadowBlur={shadowParams.shadowBlur}
//                 shadowOffsetX={shadowParams.shadowOffset.x}
//                 shadowOffsetY={shadowParams.shadowOffset.y}
//                 shadowOpacity={shadowParams.shadowOpacity}
//                 draggable={mode === 'edit'}
//                 // Quality-preserving properties
//                 imageSmoothingEnabled={true}
//                 imageSmoothingQuality='high'
//                 // Apply combined 3D rotation and wrapping effects with quality preservation
//                 {...(() => {
//                   // Get wrapping transforms with quality preservation
//                   const warpTransforms = calculateWarpingTransforms();
                  
//                   // Combine with rotation effects
//                   return {
//                     scaleX: warpTransforms.scaleX,
//                     scaleY: warpTransforms.scaleY,
//                     rotation: 0,
//                     skewX: warpTransforms.skewX + (localRotationY * 0.5),
//                     skewY: warpTransforms.skewY + (localRotationX * 0.5),
//                     // Set offset with wrapping adjustments
//                     offsetX: designDimensions.width / 2 + warpTransforms.offsetX,
//                     offsetY: designDimensions.height / 2 + warpTransforms.offsetY,
//                     // Apply quality factor to image rendering
//                     // Higher values for imageSmoothingQuality ensure better quality
//                     // We're using the quality factor to determine how to render the image
//                     perfectDrawEnabled: true,
//                     listening: true,
//                     transformsEnabled: 'all'
//                   };
//                 })()}
//                 onClick={() => {
//                   // Only select in edit mode
//                   if (mode === 'edit') {
//                     setIsSelected(true);
//                   }
//                 }}
//                 onTap={() => {
//                   // For touch devices
//                   if (mode === 'edit') {
//                     setIsSelected(true);
//                   }
//                 }}
//                 onDragStart={() => {
//                   // Ensure selection when dragging starts
//                   if (mode === 'edit') {
//                     setIsSelected(true);
//                   }
//                 }}
//                 onDragMove={(e) => {
//                   // Update position while dragging for smooth movement
//                   const node = e.target;
//                   const newPos = {
//                     x: node.x() - designDimensions.width / 2,
//                     y: node.y() - designDimensions.height / 2
//                   };
//                   setDesignPosition(newPos);
//                 }}
//                 onDragEnd={(e) => {
//                   // Get the final position after drag
//                   const node = e.target;
//                   const newPos = {
//                     x: node.x() - designDimensions.width / 2,
//                     y: node.y() - designDimensions.height / 2
//                   };
                  
//                   // Update the design position state
//                   setDesignPosition(newPos);
//                 }}
//               />
              
//               {isSelected && mode === 'edit' && (
//                 <>
//                   <Transformer
//                     ref={transformerRef}
//                     rotateEnabled={false}
//                     enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
//                     boundBoxFunc={(oldBox, newBox) => {
//                       // Limit resize to minimum dimensions
//                       if (newBox.width < 10 || newBox.height < 10) {
//                         return oldBox;
//                       }
                      
//                       return newBox;
//                     }}
//                     onTransformEnd={() => {
//                       // After transform is complete, update the design dimensions
//                       if (designImageRef.current) {
//                         const node = designImageRef.current;
//                         const scaleX = node.scaleX();
//                         const scaleY = node.scaleY();
                        
//                         // Reset scale to 1 and adjust width/height instead
//                         node.scaleX(1);
//                         node.scaleY(1);
                        
//                         // Update the design position and dimensions
//                         setDesignPosition({
//                           x: node.x() - designDimensions.width / 2,
//                           y: node.y() - designDimensions.height / 2
//                         });
                        
//                         setDesignDimensions({
//                           width: Math.max(5, node.width() * scaleX),
//                           height: Math.max(5, node.height() * scaleY)
//                         });
//                       }
//                     }}
//                   />
                  
//                   {/* Improved Rotation Controls with Corner Handles */}
//                   {showRotationControls && (
//                     <AxisGuide
//                       x={designPosition.x + designDimensions.width / 2}
//                       y={designPosition.y + designDimensions.height / 2}
//                       size={Math.max(designDimensions.width, designDimensions.height)}
//                       rotationX={localRotationX}
//                       rotationY={localRotationY}
//                       onRotationChange={(axis, value) => {
//                         if (axis === 'x') {
//                           handleRotationChange(value, localRotationY);
//                         } else if (axis === 'y') {
//                           handleRotationChange(localRotationX, value);
//                         }
//                       }}
//                       visible={showRotationControls}
//                     />
//                   )}
                  
//                   {/* Rotation Values Display */}
//                   {/* {showRotationControls && (
//                     <Group
//                       x={designPosition.x}
//                       y={designPosition.y + designDimensions.height + 20}
//                     >
//                       <Rect
//                         width={designDimensions.width}
//                         height={30}
//                         fill="rgba(0, 0, 0, 0.6)"
//                         cornerRadius={4}
//                         />
//                         <Text
//                           x={10}
//                           y={10}
//                           text={`X: ${Math.round(localRotationX)}° | Y: ${Math.round(localRotationY)}°`}
//                           fontSize={12}
//                           fill="white"
//                         />
//                       </Group>
//                   )} */}
//                 </>
//               )}
//             </>
//           )}
//         </Layer>
//       </Stage>
//     </>
//   );
// };

// export default KonvaComponents;
