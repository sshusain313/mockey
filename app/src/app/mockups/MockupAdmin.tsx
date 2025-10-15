'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useMockup } from '../context/MockupContext';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Mockup, MockupPlaceholder, normalizePlaceholder, DragState, getInitialDragState } from '@/lib/mockup-utils';
import { GripVertical, Move } from "lucide-react";

const MockupAdmin = () => {
  const { mockups, addMockup } = useMockup();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [placeholderX, setPlaceholderX] = useState(20);
  const [placeholderY, setPlaceholderY] = useState(20);
  const [placeholderWidth, setPlaceholderWidth] = useState(40);
  const [placeholderHeight, setPlaceholderHeight] = useState(30);
  const [isRelative, setIsRelative] = useState(true); // Default to percentage-based
  const [previewDimensions, setPreviewDimensions] = useState({ width: 0, height: 0 });
  const previewImageRef = useRef<HTMLImageElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [dragState, setDragState] = useState<DragState>(getInitialDragState());

  // Load image dimensions for preview scaling
  const updatePreviewDimensions = () => {
    if (previewImageRef.current && previewImageRef.current.complete) {
      setPreviewDimensions({
        width: previewImageRef.current.naturalWidth,
        height: previewImageRef.current.naturalHeight
      });
    }
  };

  useEffect(() => {
    if (previewImageRef.current) {
      if (previewImageRef.current.complete) {
        updatePreviewDimensions();
      }
      previewImageRef.current.addEventListener('load', updatePreviewDimensions);
    }

    return () => {
      if (previewImageRef.current) {
        previewImageRef.current.removeEventListener('load', updatePreviewDimensions);
      }
    };
  }, [imageSrc]);

  const handlePlaceholderChange = (field: keyof MockupPlaceholder, value: number) => {
    // Update the relevant field
    switch (field) {
      case 'x':
        setPlaceholderX(value);
        break;
      case 'y':
        setPlaceholderY(value);
        break;
      case 'width':
        setPlaceholderWidth(value);
        break;
      case 'height':
        setPlaceholderHeight(value);
        break;
      default:
        break;
    }

    // Normalize values if needed
    if (previewDimensions.width > 0 && previewDimensions.height > 0) {
      const normalized = normalizePlaceholder(
        { 
          x: field === 'x' ? value : placeholderX,
          y: field === 'y' ? value : placeholderY,
          width: field === 'width' ? value : placeholderWidth,
          height: field === 'height' ? value : placeholderHeight,
          isRelative
        },
        previewDimensions.width,
        previewDimensions.height
      );

      // Only update if values changed
      if (normalized.x !== placeholderX && field !== 'x') setPlaceholderX(normalized.x);
      if (normalized.y !== placeholderY && field !== 'y') setPlaceholderY(normalized.y);
      if (normalized.width !== placeholderWidth && field !== 'width') setPlaceholderWidth(normalized.width);
      if (normalized.height !== placeholderHeight && field !== 'height') setPlaceholderHeight(normalized.height);
    }
  };

  const handleAddMockup = () => {
    if (name && imageSrc) {
      try {
        const placeholder: MockupPlaceholder = {
          x: placeholderX,
          y: placeholderY,
          width: placeholderWidth,
          height: placeholderHeight,
          isRelative
        };

        addMockup({
          name,
          description,
          imageSrc,
          placeholder
        });
        
        // Reset form
        setName('');
        setDescription('');
        setImageSrc('');
        setPlaceholderX(20);
        setPlaceholderY(20);
        setPlaceholderWidth(40);
        setPlaceholderHeight(30);
        
        toast({
          title: "Mockup Added",
          description: `${name} mockup has been added successfully.`,
        });
      } catch (error) {
        toast({
          title: "Error Adding Mockup",
          description: "There was a problem adding the mockup.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Missing Information",
        description: "Please provide both a name and image URL for the mockup.",
        variant: "destructive"
      });
    }
  };

  // Handle mouse down for drag operations
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>, type: 'move' | 'resize', resizeHandle: 'se' | 'sw' | 'ne' | 'nw' | null = null) => {
    e.preventDefault();
    
    if (!previewContainerRef.current) return;
    
    const containerRect = previewContainerRef.current.getBoundingClientRect();
    const containerX = e.clientX - containerRect.left;
    const containerY = e.clientY - containerRect.top;
    
    setDragState({
      isDragging: true,
      startX: containerX,
      startY: containerY,
      originalX: placeholderX,
      originalY: placeholderY,
      type,
      resizeHandle
    });
  }, [placeholderX, placeholderY]);

  // Handle mouse move for drag operations
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState.isDragging || !previewContainerRef.current) return;
    
    const containerRect = previewContainerRef.current.getBoundingClientRect();
    const containerX = e.clientX - containerRect.left;
    const containerY = e.clientY - containerRect.top;
    
    const deltaX = containerX - dragState.startX;
    const deltaY = containerY - dragState.startY;
    
    if (dragState.type === 'move') {
      // Convert to percentage if using relative coordinates
      const newX = isRelative
        ? Math.max(0, Math.min(100 - placeholderWidth, dragState.originalX + (deltaX / containerRect.width) * 100))
        : Math.max(0, Math.min(containerRect.width - placeholderWidth, dragState.originalX + deltaX));
      
      const newY = isRelative
        ? Math.max(0, Math.min(100 - placeholderHeight, dragState.originalY + (deltaY / containerRect.height) * 100))
        : Math.max(0, Math.min(containerRect.height - placeholderHeight, dragState.originalY + deltaY));
      
      setPlaceholderX(newX);
      setPlaceholderY(newY);
    } else if (dragState.type === 'resize' && dragState.resizeHandle) {
      // Calculate new dimensions based on the resize handle being dragged
      let newWidth, newHeight, newX, newY;
      
      // SE resize (bottom-right corner)
      if (dragState.resizeHandle === 'se') {
        newWidth = isRelative
          ? Math.max(5, Math.min(100 - placeholderX, dragState.originalX + placeholderWidth + (deltaX / containerRect.width) * 100 - placeholderX))
          : Math.max(20, Math.min(containerRect.width - placeholderX, dragState.originalX + placeholderWidth + deltaX - placeholderX));
        
        newHeight = isRelative
          ? Math.max(5, Math.min(100 - placeholderY, dragState.originalY + placeholderHeight + (deltaY / containerRect.height) * 100 - placeholderY))
          : Math.max(20, Math.min(containerRect.height - placeholderY, dragState.originalY + placeholderHeight + deltaY - placeholderY));
        
        setPlaceholderWidth(newWidth);
        setPlaceholderHeight(newHeight);
      }
      
      // NE resize (top-right corner)
      else if (dragState.resizeHandle === 'ne') {
        newWidth = isRelative
          ? Math.max(5, Math.min(100 - placeholderX, dragState.originalX + placeholderWidth + (deltaX / containerRect.width) * 100 - placeholderX))
          : Math.max(20, Math.min(containerRect.width - placeholderX, dragState.originalX + placeholderWidth + deltaX - placeholderX));
        
        newY = isRelative
          ? Math.max(0, Math.min(dragState.originalY + placeholderHeight - 5, dragState.originalY + (deltaY / containerRect.height) * 100))
          : Math.max(0, Math.min(dragState.originalY + placeholderHeight - 20, dragState.originalY + deltaY));
        
        newHeight = isRelative
          ? dragState.originalY + placeholderHeight - newY
          : dragState.originalY + placeholderHeight - newY;
        
        setPlaceholderWidth(newWidth);
        setPlaceholderY(newY);
        setPlaceholderHeight(newHeight);
      }
      
      // SW resize (bottom-left corner)
      else if (dragState.resizeHandle === 'sw') {
        newX = isRelative
          ? Math.max(0, Math.min(dragState.originalX + placeholderWidth - 5, dragState.originalX + (deltaX / containerRect.width) * 100))
          : Math.max(0, Math.min(dragState.originalX + placeholderWidth - 20, dragState.originalX + deltaX));
        
        newWidth = isRelative
          ? dragState.originalX + placeholderWidth - newX
          : dragState.originalX + placeholderWidth - newX;
        
        newHeight = isRelative
          ? Math.max(5, Math.min(100 - placeholderY, dragState.originalY + placeholderHeight + (deltaY / containerRect.height) * 100 - placeholderY))
          : Math.max(20, Math.min(containerRect.height - placeholderY, dragState.originalY + placeholderHeight + deltaY - placeholderY));
        
        setPlaceholderX(newX);
        setPlaceholderWidth(newWidth);
        setPlaceholderHeight(newHeight);
      }
      
      // NW resize (top-left corner)
      else if (dragState.resizeHandle === 'nw') {
        newX = isRelative
          ? Math.max(0, Math.min(dragState.originalX + placeholderWidth - 5, dragState.originalX + (deltaX / containerRect.width) * 100))
          : Math.max(0, Math.min(dragState.originalX + placeholderWidth - 20, dragState.originalX + deltaX));
        
        newY = isRelative
          ? Math.max(0, Math.min(dragState.originalY + placeholderHeight - 5, dragState.originalY + (deltaY / containerRect.height) * 100))
          : Math.max(0, Math.min(dragState.originalY + placeholderHeight - 20, dragState.originalY + deltaY));
        
        newWidth = isRelative
          ? dragState.originalX + placeholderWidth - newX
          : dragState.originalX + placeholderWidth - newX;
        
        newHeight = isRelative
          ? dragState.originalY + placeholderHeight - newY
          : dragState.originalY + placeholderHeight - newY;
        
        setPlaceholderX(newX);
        setPlaceholderY(newY);
        setPlaceholderWidth(newWidth);
        setPlaceholderHeight(newHeight);
      }
    }
  }, [dragState, placeholderX, placeholderY, placeholderWidth, placeholderHeight, isRelative]);

  // Handle mouse up to end drag operations
  const handleMouseUp = useCallback(() => {
    if (dragState.isDragging) {
      setDragState(getInitialDragState());
    }
  }, [dragState.isDragging]);
  
  // Setup global event listeners for dragging
  useEffect(() => {
    if (dragState.isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState.isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Mockup Generator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Add New Mockup</CardTitle>
              <CardDescription>Create a new product mockup template</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Mockup Name</Label>
                <Input 
                  id="name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter mockup name" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter mockup description" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageSrc">Image URL</Label>
                <Input 
                  id="imageSrc" 
                  value={imageSrc}
                  onChange={(e) => setImageSrc(e.target.value)}
                  placeholder="Enter mockup image URL" 
                />
              </div>

              <div className="flex items-center space-x-2 my-4">
                <Switch 
                  id="isRelative" 
                  checked={isRelative} 
                  onCheckedChange={setIsRelative}
                />
                <Label htmlFor="isRelative">
                  Use percentage-based coordinates {isRelative ? '(0-100%)' : '(pixels)'}
                </Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="placeholderX">X Position {isRelative ? '(%)' : '(px)'}</Label>
                  <Input 
                    id="placeholderX" 
                    type="number"
                    value={placeholderX}
                    onChange={(e) => handlePlaceholderChange('x', Number(e.target.value))}
                    min={0}
                    max={isRelative ? 100 : previewDimensions.width}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="placeholderY">Y Position {isRelative ? '(%)' : '(px)'}</Label>
                  <Input 
                    id="placeholderY" 
                    type="number"
                    value={placeholderY}
                    onChange={(e) => handlePlaceholderChange('y', Number(e.target.value))}
                    min={0}
                    max={isRelative ? 100 : previewDimensions.height}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="placeholderWidth">Width {isRelative ? '(%)' : '(px)'}</Label>
                  <Input 
                    id="placeholderWidth" 
                    type="number"
                    value={placeholderWidth}
                    onChange={(e) => handlePlaceholderChange('width', Number(e.target.value))}
                    min={1}
                    max={isRelative ? 100 : previewDimensions.width}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="placeholderHeight">Height {isRelative ? '(%)' : '(px)'}</Label>
                  <Input 
                    id="placeholderHeight" 
                    type="number"
                    value={placeholderHeight}
                    onChange={(e) => handlePlaceholderChange('height', Number(e.target.value))}
                    min={1}
                    max={isRelative ? 100 : previewDimensions.height}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleAddMockup}>Add Mockup</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>See how your mockup will look</CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <div 
                ref={previewContainerRef}
                className="aspect-video relative overflow-hidden bg-muted rounded-md"
              >
                {imageSrc ? (
                  <>
                    <img 
                      ref={previewImageRef}
                      src={imageSrc} 
                      alt="Mockup preview" 
                      className="w-full h-full object-contain"
                      crossOrigin="anonymous"
                      onLoad={updatePreviewDimensions}
                    />
                    <div 
                      className={`absolute border-2 border-red-500 border-dashed ${dragState.isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                      style={{
                        left: isRelative ? `${placeholderX}%` : `${placeholderX}px`,
                        top: isRelative ? `${placeholderY}%` : `${placeholderY}px`,
                        width: isRelative ? `${placeholderWidth}%` : `${placeholderWidth}px`,
                        height: isRelative ? `${placeholderHeight}%` : `${placeholderHeight}px`
                      }}
                      onMouseDown={(e) => handleMouseDown(e, 'move')}
                    >
                      {/* Center drag handle */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/70 p-1 rounded-full shadow-md">
                        <Move className="h-4 w-4 text-gray-700" />
                      </div>
                      
                      {/* Resize handles */}
                      <div
                        className="absolute right-0 bottom-0 w-4 h-4 bg-white/70 rounded-full shadow-md cursor-se-resize"
                        onMouseDown={(e) => handleMouseDown(e, 'resize', 'se')}
                      >
                        <GripVertical className="h-3 w-3 text-gray-700" />
                      </div>
                      
                      <div
                        className="absolute left-0 bottom-0 w-4 h-4 bg-white/70 rounded-full shadow-md cursor-sw-resize"
                        onMouseDown={(e) => handleMouseDown(e, 'resize', 'sw')}
                      >
                        <GripVertical className="h-3 w-3 text-gray-700" />
                      </div>
                      
                      <div
                        className="absolute right-0 top-0 w-4 h-4 bg-white/70 rounded-full shadow-md cursor-ne-resize"
                        onMouseDown={(e) => handleMouseDown(e, 'resize', 'ne')}
                      >
                        <GripVertical className="h-3 w-3 text-gray-700" />
                      </div>
                      
                      <div
                        className="absolute left-0 top-0 w-4 h-4 bg-white/70 rounded-full shadow-md cursor-nw-resize"
                        onMouseDown={(e) => handleMouseDown(e, 'resize', 'nw')}
                      >
                        <GripVertical className="h-3 w-3 text-gray-700" />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                    Enter an image URL to see preview
                  </div>
                )}
              </div>
              {imageSrc && previewDimensions.width > 0 && (
                <div className="mt-2 text-sm text-muted-foreground text-center">
                  Image dimensions: {previewDimensions.width} × {previewDimensions.height}px
                </div>
              )}
            </CardContent>
          </Card>

          <div>
            <h2 className="text-xl font-semibold mb-4">Existing Mockups</h2>
            <div className="grid grid-cols-1 gap-4">
              {mockups.map((mockup) => (
                <Card key={mockup.id}>
                  <CardHeader>
                    <CardTitle>{mockup.name}</CardTitle>
                    <CardDescription>{mockup.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video relative">
                      <img 
                        src={mockup.imageSrc} 
                        alt={mockup.name} 
                        className="w-full h-full object-contain rounded-md"
                        crossOrigin="anonymous"
                      />
                      <div 
                        className="absolute border-2 border-red-500 border-dashed opacity-70"
                        style={{
                          left: mockup.placeholder.isRelative 
                            ? `${mockup.placeholder.x}%` 
                            : `${mockup.placeholder.x}px`,
                          top: mockup.placeholder.isRelative 
                            ? `${mockup.placeholder.y}%` 
                            : `${mockup.placeholder.y}px`,
                          width: mockup.placeholder.isRelative 
                            ? `${mockup.placeholder.width}%` 
                            : `${mockup.placeholder.width}px`,
                          height: mockup.placeholder.isRelative 
                            ? `${mockup.placeholder.height}%` 
                            : `${mockup.placeholder.height}px`
                        }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockupAdmin;
