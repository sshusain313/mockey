// Helper functions for the mockup generator

// Define the types for our mockup data
export interface Point {
  x: number;
  y: number;
}

export interface MockupPlaceholder {
  x: number;
  y: number;
  width: number;
  height: number;
  isRelative?: boolean; // Flag to indicate if coordinates are percentages (0-100)
  shape?: 'rectangle' | 'polygon'; // Shape of the placeholder
  points?: Point[]; // For polygon shapes
}

export interface Mockup {
  id: string;
  name: string;
  description: string;
  imageSrc: string;
  placeholder: MockupPlaceholder;
  productType?: string; // e.g., 'T-shirt', 'Hoodie', 'Mug'
  categories?: string[]; // e.g., ['Apparel', 'Dark', 'Side View']
}

// Function to merge a user image onto a mockup template
export const mergeImageOntoMockup = (
    mockupSrc: string, 
    userImageSrc: string, 
    placeholderCoords: MockupPlaceholder,
    options: {
      maintainAspectRatio?: boolean;
      blendMode?: string;
      applyEffects?: boolean;
      unclipMode?: boolean;
    } = {}
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Create canvas elements for manipulation
      const mockupImage = new Image();
      const userImage = new Image();
      
      // Set crossOrigin to anonymous to prevent CORS issues
      mockupImage.crossOrigin = "anonymous";
      userImage.crossOrigin = "anonymous";
      
      // Default options
      const {
        maintainAspectRatio = true,
        blendMode = 'multiply',
        applyEffects = true,
        unclipMode = false
      } = options;
      
      mockupImage.onload = () => {
        userImage.onload = () => {
          // Create a canvas to merge the images
          const canvas = document.createElement('canvas');
          canvas.width = mockupImage.width;
          canvas.height = mockupImage.height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }
          
          // Draw the mockup first
          ctx.drawImage(mockupImage, 0, 0);
          
          // Calculate actual pixel positions if using percentages
          const x = placeholderCoords.isRelative 
            ? (placeholderCoords.x / 100) * mockupImage.width 
            : placeholderCoords.x;
          
          const y = placeholderCoords.isRelative 
            ? (placeholderCoords.y / 100) * mockupImage.height 
            : placeholderCoords.y;
          
          const width = placeholderCoords.isRelative 
            ? (placeholderCoords.width / 100) * mockupImage.width 
            : placeholderCoords.width;
          
          const height = placeholderCoords.isRelative 
            ? (placeholderCoords.height / 100) * mockupImage.height 
            : placeholderCoords.height;
          
          // Save the current context state
          ctx.save();
          
          // Apply blend mode
          ctx.globalCompositeOperation = blendMode as GlobalCompositeOperation;
          
          // Apply clipping path if not in unclip mode and placeholder is a polygon
          if (!unclipMode && placeholderCoords.shape === 'polygon' && placeholderCoords.points) {
            ctx.beginPath();
            const points = placeholderCoords.points.map(point => ({
              x: placeholderCoords.isRelative 
                ? (point.x / 100) * mockupImage.width 
                : point.x,
              y: placeholderCoords.isRelative 
                ? (point.y / 100) * mockupImage.height 
                : point.y
            }));
            
            // Draw the polygon path
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
              ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.closePath();
            ctx.clip();
          } else if (!unclipMode && placeholderCoords.shape !== 'polygon') {
            // Apply rectangular clipping
            ctx.beginPath();
            ctx.rect(x, y, width, height);
            ctx.clip();
          }
          
          // Calculate scale to maintain aspect ratio if needed
          let drawWidth = width;
          let drawHeight = height;
          let drawX = x;
          let drawY = y;
          
          if (maintainAspectRatio) {
            const userAspect = userImage.width / userImage.height;
            const placeholderAspect = width / height;
            
            if (userAspect > placeholderAspect) {
              // User image is wider than placeholder
              drawHeight = width / userAspect;
              drawY = y + (height - drawHeight) / 2;
            } else {
              // User image is taller than placeholder
              drawWidth = height * userAspect;
              drawX = x + (width - drawWidth) / 2;
            }
          }
          
          // Apply realistic effects if enabled
          if (applyEffects) {
            // Apply slight perspective distortion
            const warpFactor = 0.1; // 10% warping
            
            // Simple perspective transform (more advanced would use WebGL)
            ctx.transform(
              1, 0.01 * Math.random() * warpFactor, 
              0.02 * Math.random() * warpFactor, 1, 
              0, 0
            );
          }
          
          // Draw the user image onto the placeholder area
          ctx.drawImage(
            userImage, 
            drawX, 
            drawY,
            drawWidth,
            drawHeight
          );
          
          // Restore the context state
          ctx.restore();
          
          // Convert canvas to data URL
          resolve(canvas.toDataURL('image/png'));
        };
        
        userImage.onerror = (e) => {
          console.error("Error loading user image:", e);
          reject(new Error('Failed to load user image'));
        };
        
        userImage.src = userImageSrc;
      };
      
      mockupImage.onerror = (e) => {
        console.error("Error loading mockup image:", e);
        reject(new Error('Failed to load mockup image'));
      };
      
      mockupImage.src = mockupSrc;
    });
  };
  
  // Helper function to ensure placeholder stays within image boundaries
  export const normalizePlaceholder = (
    placeholder: MockupPlaceholder, 
    imageWidth: number, 
    imageHeight: number
  ): MockupPlaceholder => {
    if (placeholder.shape === 'polygon' && placeholder.points) {
      // For polygons, normalize each point
      const normalizedPoints = placeholder.points.map(point => {
        if (placeholder.isRelative) {
          return {
            x: Math.min(Math.max(point.x, 0), 100),
            y: Math.min(Math.max(point.y, 0), 100)
          };
        } else {
          return {
            x: Math.min(Math.max(point.x, 0), imageWidth),
            y: Math.min(Math.max(point.y, 0), imageHeight)
          };
        }
      });
      
      return {
        ...placeholder,
        points: normalizedPoints
      };
    }
    
    // For rectangles, normalize x, y, width, height
    if (placeholder.isRelative) {
      return {
        ...placeholder,
        x: Math.min(Math.max(placeholder.x, 0), 100),
        y: Math.min(Math.max(placeholder.y, 0), 100),
        width: Math.min(Math.max(placeholder.width, 1), 100 - placeholder.x),
        height: Math.min(Math.max(placeholder.height, 1), 100 - placeholder.y),
      };
    }
    
    return {
      ...placeholder,
      x: Math.min(Math.max(placeholder.x, 0), imageWidth - 10),
      y: Math.min(Math.max(placeholder.y, 0), imageHeight - 10),
      width: Math.min(Math.max(placeholder.width, 10), imageWidth - placeholder.x),
      height: Math.min(Math.max(placeholder.height, 10), imageHeight - placeholder.y),
    };
  };
  
  // Helper functions for dragging operations
  export interface DragState {
    isDragging: boolean;
    startX: number;
    startY: number;
    originalX: number;
    originalY: number;
    type: 'move' | 'resize' | null;
    resizeHandle: 'se' | 'sw' | 'ne' | 'nw' | null;
  }
  
  export const getInitialDragState = (): DragState => ({
    isDragging: false,
    startX: 0,
    startY: 0,
    originalX: 0,
    originalY: 0,
    type: null,
    resizeHandle: null
  });
  
  // Helper function to determine the appropriate blend mode based on product type and color
  export const getBlendMode = (categories: string[] = []): string => {
    // Check if the product is dark colored
    const isDarkFabric = categories.some(cat => 
      ['Dark', 'Black', 'Navy', 'Charcoal'].includes(cat)
    );
    
    return isDarkFabric ? 'screen' : 'multiply';
  };
  
  // Helper function to create a polygon placeholder for curved surfaces
  export const createCurvedPlaceholder = (
    centerX: number, 
    centerY: number, 
    width: number, 
    height: number, 
    curveFactor: number = 0.2
  ): Point[] => {
    // Create a polygon that simulates a curved surface
    const points: Point[] = [];
    const numPoints = 12; // Number of points to create a smooth curve
    
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const xRadius = width / 2;
      const yRadius = height / 2;
      
      // Apply curve factor to create a more realistic curved surface
      const curveX = Math.cos(angle) * xRadius * (1 + Math.sin(angle) * curveFactor);
      const curveY = Math.sin(angle) * yRadius;
      
      points.push({
        x: centerX + curveX,
        y: centerY + curveY
      });
    }
    
    return points;
  };
  
  // Sample mockups data with enhanced placeholders
  export const sampleMockups: Mockup[] = [
    {
      id: '1',
      name: 'T-Shirt Mockup',
      description: 'A t-shirt mockup for custom designs',
      imageSrc: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000',
      placeholder: { 
        x: 20, 
        y: 30, 
        width: 40, 
        height: 30, 
        isRelative: true,
        shape: 'rectangle'
      },
      productType: 'T-shirt',
      categories: ['Apparel', 'White', 'Front View']
    },
    {
      id: '2',
      name: 'Coffee Mug',
      description: 'A coffee mug mockup for custom prints',
      imageSrc: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1000',
      placeholder: { 
        x: 30, 
        y: 20, 
        width: 30, 
        height: 30, 
        isRelative: true,
        shape: 'polygon',
        points: [
          { x: 30, y: 20 },
          { x: 60, y: 20 },
          { x: 65, y: 35 },
          { x: 60, y: 50 },
          { x: 30, y: 50 },
          { x: 25, y: 35 }
        ]
      },
      productType: 'Mug',
      categories: ['Accessories', 'White', 'Curved']
    },
    {
      id: '3',
      name: 'Wall Art Frame',
      description: 'A frame mockup for wall art prints',
      imageSrc: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1000',
      placeholder: { 
        x: 10, 
        y: 10, 
        width: 80, 
        height: 70, 
        isRelative: true,
        shape: 'rectangle'
      },
      productType: 'Frame',
      categories: ['Home Decor', 'Flat']
    },
    {
      id: '4',
      name: 'Hoodie Mockup',
      description: 'A hoodie mockup for custom designs',
      imageSrc: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000',
      placeholder: { 
        x: 25, 
        y: 25, 
        width: 50, 
        height: 40, 
        isRelative: true,
        shape: 'rectangle'
      },
      productType: 'Hoodie',
      categories: ['Apparel', 'Black', 'Front View']
    }
  ];
  