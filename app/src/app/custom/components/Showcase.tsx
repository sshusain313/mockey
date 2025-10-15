'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Download, Shirt, Image, ShoppingBag, ArrowLeft, ArrowRight, AlignCenter, Minimize, Eye, Edit2 } from 'lucide-react';
// import Sidebar from './Sidebar';
import Section from './Section';
import { Stage, Layer, Image as KonvaImage, Group, Rect, Text, Transformer } from 'react-konva';
import Konva from 'konva';
import useImage from 'use-image';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Function to convert hex color to HSL hue value (0-360)
const getHueFromHex = (hex: string): number => {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Parse the hex values to RGB
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;
  
  // Find min and max values to calculate saturation and lightness
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  
  // Calculate hue
  let h = 0;
  
  if (max === min) {
    h = 0; // achromatic (gray)
  } else {
    const d = max - min;
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  // Convert to degrees (0-360)
  return h * 360;
};

// CSS styles for preview mode
const previewModeStyles = `
  .preview-mode {
    box-shadow: 0 0 0 2px #10b981, 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
  }
  
  .preview-mode::after {
    content: 'Preview Mode';
    position: absolute;
    bottom: 8px;
    left: 8px;
    background-color: #10b981;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    opacity: 0.8;
    z-index: 10;
  }
`;

// Function to create a product mask from the background image
// This detects the actual product (non-white, non-transparent areas) to apply color only there
const createProductMask = (image: HTMLImageElement): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return canvas;
  
  // Draw the original image
  ctx.drawImage(image, 0, 0);
  
  // Get the image data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Create a mask where we only keep pixels that are part of the product
  // We identify product pixels as those that aren't white or transparent
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    
    // Skip transparent pixels
    if (a < 50) {
      data[i + 3] = 0; // Make fully transparent
      continue;
    }
    
    // Check if pixel is close to white (background)
    const isWhiteBackground = r > 240 && g > 240 && b > 240;
    
    if (isWhiteBackground) {
      // Make white/background areas transparent in the mask
      data[i + 3] = 0;
    } else {
      // Keep product pixels fully opaque
      data[i + 3] = 255;
    }
  }
  
  // Put the modified image data back on the canvas
  ctx.putImageData(imageData, 0, 0);
  
  return canvas;
};

const MockupsShowcase = () => {
  // State for uploaded background image
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  // State for product color
  const [productColor, setProductColor] = useState<string>('#FFFFFF');
  // State for product mask image (for targeted coloring)
  const [productMask, setProductMask] = useState<HTMLCanvasElement | null>(null);
  // State for design image from sidebar
  const [designImage, setDesignImage] = useState<string | null>(null);
  // State for design rotation (in degrees)
  const [designRotation, setDesignRotation] = useState(0);
  // State for canvas dimensions
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 500, height: 500 });
  // State for background image position and dimensions
  const [bgImageProps, setBgImageProps] = useState({ 
    x: 0, 
    y: 0, 
    width: 500, 
    height: 500 
  });
  // Reference to the stage
  const stageRef = useRef<any>(null);
  // State for design position and scale
  const [designPosition, setDesignPosition] = useState({ x: 0, y: 0 });
  const [designScale, setDesignScale] = useState(0.25);
  const [isDesignSelected, setIsDesignSelected] = useState(false);
  // State for edit/preview mode toggle
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const designRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);

  // Load the uploaded background image
  const [backgroundImg] = useImage(uploadedImage || '');
  // Load the design image
  const [designImg] = useImage(designImage || '');
  // Create a Konva image from the product mask canvas
  const [maskImg, setMaskImg] = useState<HTMLImageElement | null>(null);

  // Categories for the sidebar
  const categories = [
    { 
      name: "T-shirt", 
      icon: Shirt, 
      image: "/lovable-uploads/50c39a82-7031-4284-848b-59cf07ddc6b7.png"
    },
    { 
      name: "Hoodie", 
      icon: ShoppingBag, 
      image: "/lovable-uploads/100e2683-e29c-4709-84da-6cb9524a6c5c.png"
    },
    { 
      name: "Poster", 
      icon: Image, 
      image: "/lovable-uploads/0880f70d-08e4-43e5-9d4a-2e876ebbcc10.png"
    },
    { 
      name: "Tote", 
      icon: Image, 
      image: "/lovable-uploads/78572dab-7bdf-4f54-9f6a-eca7d211cdcb.png"
    }
  ];

  // Example mockup products for tote bags
  const toteExamples = [
    {
      id: 1,
      image: "/lovable-uploads/c1618e75-ae91-4ce9-90dd-40c9576d1e5a.png",
      name: "Tote Bag Example 1"
    },
    {
      id: 2,
      image: "/lovable-uploads/c1618e75-ae91-4ce9-90dd-40c9576d1e5a.png",
      name: "Tote Bag Example 2"
    },
    {
      id: 3,
      image: "/lovable-uploads/c1618e75-ae91-4ce9-90dd-40c9576d1e5a.png",
      name: "Tote Bag Example 3"
    }
  ];

  // Function to download the complete image as it appears on screen
  const downloadCompositeImage = () => {
    if (stageRef.current) {
      // Hide the transformer if it's visible
      const wasSelected = isDesignSelected;
      if (wasSelected) {
        setIsDesignSelected(false);
      }
      
      // Wait for the next render cycle to ensure transformer is hidden
      setTimeout(() => {
        // Get only the visible content (what appears on screen)
        const dataURL = stageRef.current.toDataURL({
          pixelRatio: 2, // Higher quality export
          mimeType: 'image/png',
          quality: 1
        });
        
        // Create a download link
        const link = document.createElement('a');
        link.download = 'custom-design.png';
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Restore selection state if needed
        if (wasSelected) {
          setIsDesignSelected(true);
        }
      }, 50);
    }
  };

  // Listen for design changes and color changes from the Section component
  useEffect(() => {
    const handleDesignChanged = (event: CustomEvent) => {
      setDesignImage(event.detail.designUrl);
      // Scale will be set in the useEffect that watches for designImg and backgroundImg
    };

    // Listen for product color change events
    const handleProductColorChanged = (event: CustomEvent) => {
      setProductColor(event.detail.color);
    };

    // Listen for center design events from the sidebar
    const handleCenterDesign = () => {
      centerDesign();
    };

    // Listen for download triggers from the sidebar
    const handleTriggerDownload = () => {
      if (uploadedImage) {
        downloadCompositeImage();
      }
    };

    // Keyboard shortcut for toggling between edit and preview modes
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'p' || e.key === 'P') {
        setIsPreviewMode(prev => !prev);
      }
    };

    window.addEventListener('designChanged', handleDesignChanged as EventListener);
    window.addEventListener('productColorChanged', handleProductColorChanged as EventListener);
    window.addEventListener('centerDesign', handleCenterDesign as EventListener);
    window.addEventListener('triggerDownload', handleTriggerDownload);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('designChanged', handleDesignChanged as EventListener);
      window.removeEventListener('productColorChanged', handleProductColorChanged as EventListener);
      window.removeEventListener('centerDesign', handleCenterDesign as EventListener);
      window.removeEventListener('triggerDownload', handleTriggerDownload);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [uploadedImage]);
  
  // Deselect design when switching to preview mode
  useEffect(() => {
    if (isPreviewMode && isDesignSelected) {
      setIsDesignSelected(false);
    }
  }, [isPreviewMode, isDesignSelected]);

  // Calculate background image position and dimensions to cover the entire canvas
  const calculateBackgroundImageProps = () => {
    if (!backgroundImg) return;

    // Always scale to cover the entire canvas
    const scaleX = canvasDimensions.width / backgroundImg.width;
    const scaleY = canvasDimensions.height / backgroundImg.height;
    const scale = Math.max(scaleX, scaleY);

    // Calculate dimensions that maintain aspect ratio while covering canvas
    const width = backgroundImg.width * scale;
    const height = backgroundImg.height * scale;

    // Center the image by positioning it relative to canvas center
    const x = (canvasDimensions.width - width) / 2;
    const y = (canvasDimensions.height - height) / 2;

    // Only update if values have changed
    if (
      bgImageProps.x !== x ||
      bgImageProps.y !== y ||
      bgImageProps.width !== width ||
      bgImageProps.height !== height
    ) {
      setBgImageProps({ x, y, width, height });
    }
  };

  // Adjust scale when design or background changes
  useEffect(() => {
    if (designImg && backgroundImg) {
      const newScale = calculateQuarterScale();
      // Only update scale if it's different
      if (Math.abs(designScale - newScale) > 0.001) {
        setDesignScale(newScale);
      }
      calculateBackgroundImageProps();
    }
  }, [designImg, backgroundImg]);
  
  // Generate product mask when background image loads
  useEffect(() => {
    if (backgroundImg) {
      // Create a mask that isolates the product part of the image
      const mask = createProductMask(backgroundImg);
      setProductMask(mask);
      
      // Convert canvas to image for Konva
      const maskImage = new window.Image();
      maskImage.src = mask.toDataURL();
      maskImage.onload = () => {
        setMaskImg(maskImage);
      };
    }
  }, [backgroundImg]);
  
  // Recalculate background image props when canvas dimensions change
  useEffect(() => {
    if (backgroundImg) {
      calculateBackgroundImageProps();
    }
  }, [canvasDimensions, backgroundImg]);

  // Position the design in the center when it's loaded or scale changes
  useEffect(() => {
    if (designImg) {
      // Center the design on the background image
      centerDesign();
    }
  }, [designImg, designScale, bgImageProps.x, bgImageProps.y, bgImageProps.width, bgImageProps.height]);
  
  // Re-center the design when the canvas or background changes
  // This useEffect is redundant with the one above, so we can remove it
  // useEffect(() => {
  //   if (designImg && designRef.current) {
  //     // Center the design on the background image
  //     centerDesign();
  //   }
  // }, [backgroundImg, bgImageProps, canvasDimensions]);

  // Connect transformer to design image when selected
  useEffect(() => {
    if (isDesignSelected && designRef.current && transformerRef.current) {
      // Attach transformer to the image
      transformerRef.current.nodes([designRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isDesignSelected]);

  function handleDragOver(event: React.DragEvent<HTMLDivElement>): void {
    event.preventDefault(); // Prevent the default behavior to allow dropping
    event.dataTransfer.dropEffect = "copy"; // Indicate a copy action
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>): void {
    event.preventDefault(); // Prevent the default behavior

    const file = event.dataTransfer.files[0]; // Get the first file from the drop event
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setUploadedImage(reader.result.toString()); // Update the uploaded image state
        }
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    } else {
      alert("Please upload a valid PNG or JPG image.");
    }
  }

  function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
    // Trigger a file input click to allow users to select an image
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/png, image/jpeg';
    fileInput.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        if (file.type === "image/png" || file.type === "image/jpeg") {
          const reader = new FileReader();
          reader.onload = () => {
            if (reader.result) {
              setUploadedImage(reader.result.toString()); // Update the uploaded image state
            }
          };
          reader.readAsDataURL(file); // Read the file as a data URL
        } else {
          alert("Please upload a valid PNG or JPG image.");
        }
      }
    };
    fileInput.click();
  }

  // Handle click on empty areas to deselect
  const checkDeselect = (e: any) => {
    // Clicked on empty area - deselect
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setIsDesignSelected(false);
    }
  };
  
  // Function to center the design on the background image
  const centerDesign = () => {
    if (designImg) {
      // Calculate center of the background image
      const bgCenterX = bgImageProps.x + bgImageProps.width / 2;
      const bgCenterY = bgImageProps.y + bgImageProps.height / 2;
      
      // Only update position if it's different from current position
      // This prevents unnecessary re-renders
      if (designPosition.x !== bgCenterX || designPosition.y !== bgCenterY) {
        setDesignPosition({ x: bgCenterX, y: bgCenterY });
      }
      
      // If the design is selected, update the transformer
      if (isDesignSelected && transformerRef.current && designRef.current) {
        transformerRef.current.nodes([designRef.current]);
        transformerRef.current.getLayer()?.batchDraw();
      }
    }
  };
  

  
  // Calculate scale to make design 1/4 the size of the background
  const calculateQuarterScale = () => {
    if (designImg && backgroundImg) {
      // Get the smaller dimension (width or height) of the background as it appears on canvas
      const bgSmallestDimension = Math.min(bgImageProps.width, bgImageProps.height);
      // Get the larger dimension (width or height) of the design
      const designLargestDimension = Math.max(designImg.width, designImg.height);
      
      // Calculate scale to make design 1/4 the size of the background's smallest dimension
      return (bgSmallestDimension / 4) / designLargestDimension;
    }
    return 0.25; // Default fallback
  };
  
  // Function to reset design size to 1/4 of background
  const resetDesignSize = () => {
    if (designImg) {
      const newScale = calculateQuarterScale();
      setDesignScale(newScale);
      setDesignRotation(0); // Reset rotation as well
      
      // Recenter after resizing
      setTimeout(centerDesign, 50);
    }
  };

  return (
    <div className="flex flex-col h-screen">

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar with design controls */}
        <Section 
          designScale={designScale}
          setDesignScale={setDesignScale}
          designRotation={designRotation}
          setDesignRotation={setDesignRotation}
        />

        {/* Main Content - Upload Area */}
        <main className="flex-1 p-6 flex items-center justify-center bg-gray-50 bg-grid">
          {uploadedImage ? (
            // Render Konva stage with the uploaded image and design
            <div className={`canvas w-full max-w-xl aspect-square bg-white rounded-lg shadow-md overflow-hidden relative flex items-center justify-center ${isPreviewMode ? 'preview-mode' : ''}`}>
              {/* Edit/Preview Toggle Button */}
              <div className="absolute top-4 right-4 z-20">
                <button
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isPreviewMode ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  {isPreviewMode ? 'Preview Mode' : 'Edit Mode'}
                </button>
              </div>
              {/* No controls on canvas - moved to sidebar */}
              <Stage
                width={canvasDimensions.width} 
                height={canvasDimensions.height}
                ref={stageRef}
                onMouseDown={checkDeselect}
                onTouchStart={checkDeselect}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
                }}
              >
                <Layer>
                  {/* Background Image with targeted color filter */}
                    {backgroundImg && (
                      <Group>
                      {/* Base product image */}
                      <KonvaImage
                        image={backgroundImg}
                        width={bgImageProps.width}
                        height={bgImageProps.height}
                        x={bgImageProps.x}
                        y={bgImageProps.y}
                      />
                      
                      {/* Color overlay with blend mode - only if color is not white and mask is available */}
                      {productColor !== '#FFFFFF' && maskImg && (
                        <KonvaImage
                          image={maskImg}
                          width={bgImageProps.width}
                          height={bgImageProps.height}
                          x={bgImageProps.x}
                          y={bgImageProps.y}
                          filters={[Konva.Filters.HSL]}
                          hue={getHueFromHex(productColor)}  // Convert hex to hue value
                          saturation={0.8}      // High saturation for vibrant color
                          luminance={0}         // No change to luminance to preserve shading
                          globalCompositeOperation="color"
                          opacity={0.9}
                        />
                      )}
                    </Group>
                  )}
                  
                  {/* Design Image */}
                  {designImg && (
                    <KonvaImage
                      ref={designRef}
                      image={designImg}
                      x={designPosition.x}
                      y={designPosition.y}
                      width={designImg.width * designScale}
                      height={designImg.height * designScale}
                      rotation={designRotation}
                      offsetX={designImg.width * designScale / 2}
                      offsetY={designImg.height * designScale / 2}
                      draggable={!isPreviewMode}
                      onClick={() => !isPreviewMode && setIsDesignSelected(true)}
                      onTap={() => !isPreviewMode && setIsDesignSelected(true)}
                      onDragEnd={(e) => {
                        if (!isPreviewMode) {
                          setDesignPosition({
                            x: e.target.x(),
                            y: e.target.y()
                          });
                        }
                      }}
                      onTransformEnd={(e) => {
                        // Update scale and rotation after transform
                        const node = designRef.current;
                        const scaleX = node.scaleX();
                        const rotation = node.rotation();
                        
                        // Reset scale and update width and height
                        node.scaleX(1);
                        node.scaleY(1);
                        
                        // Apply the new scale and rotation
                        setDesignScale(designScale * scaleX);
                        setDesignRotation(rotation);
                        setDesignPosition({
                          x: node.x(),
                          y: node.y()
                        });
                      }}
                    />
                  )}
                  
                  {/* Transformer for design image - only visible in edit mode */}
                  {isDesignSelected && designImg && !isPreviewMode && (
                    <Transformer
                      ref={transformerRef}
                      boundBoxFunc={(oldBox, newBox) => {
                        // Limit resize to maintain minimum dimensions
                        if (newBox.width < 20 || newBox.height < 20) {
                          return oldBox;
                        }
                        return newBox;
                      }}
                      borderStroke="#3b82f6" // Change from default red to blue
                      borderStrokeWidth={1}  // Make the border thinner
                      borderDash={[4, 3]}    // Customize the dash pattern
                      anchorStroke="#3b82f6" // Change anchor border color
                      anchorFill="#ffffff"   // White fill for anchors
                      anchorSize={7}         // Slightly smaller anchors
                      rotateAnchorOffset={10} // Offset for rotation anchor
                    />
                  )}
                </Layer>
              </Stage>
            </div>
          ) : (
            // Upload prompt when no image is uploaded
            <div
              className="w-full max-w-xl aspect-square border-2 border-dashed border-green-500 rounded-lg flex flex-col items-center justify-center p-6 bg-white hover:border-green-600"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={handleClick}
            >
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Image className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-1">
                Click or drag and drop to upload your background image
              </h3>
              <p className="text-sm text-gray-500">PNG and JPG (max. 10MB)</p>
              <p className="text-sm text-gray-500 mt-4">
                Then use the sidebar to upload your design
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MockupsShowcase;
