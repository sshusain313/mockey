'use client';
import React, { useState, useEffect } from 'react';
import { DownloadButton } from '@/components/DownloadButton';
import { useMockup } from '../context/MockupContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mergeImageOntoMockup } from '@/lib/mockup-utils';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

const MockupUser = () => {
  const { mockups, selectedMockup, setSelectedMockup, userImage, setUserImage } = useMockup();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  // Handle file selection for the user's custom image
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setUserImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate preview when both mockup and user image are selected
  useEffect(() => {
    const generatePreview = async () => {
      if (selectedMockup && userImage) {
        try {
          setIsGenerating(true);
          setProgress(30); // Start progress
          
          // Artificial delay to show progress
          await new Promise(resolve => setTimeout(resolve, 300));
          setProgress(60);
          
          const mergedImage = await mergeImageOntoMockup(
            selectedMockup.imageSrc,
            userImage,
            selectedMockup.placeholder
          );
          
          setProgress(100);
          setPreviewImage(mergedImage);
          
          setTimeout(() => {
            setIsGenerating(false);
          }, 300);
        } catch (error) {
          console.error('Error generating preview:', error);
          toast({
            title: "Error generating preview",
            description: "There was a problem with the images. Try using different images.",
            variant: "destructive"
          });
          setIsGenerating(false);
        }
      }
    };

    generatePreview();
  }, [selectedMockup, userImage, toast]);

  // Handle mockup selection
  const selectMockup = (mockup: typeof mockups[0]) => {
    setSelectedMockup(mockup);
  };

  // Handle download of the final image
  const handleDownload = () => {
    if (previewImage) {
      const link = document.createElement('a');
      link.href = previewImage;
      link.download = `mockup-${selectedMockup?.name || 'custom'}.png`;
      link.click();
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Mockup Customizer</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Select a Mockup</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mockups.map((mockup) => (
              <Card 
                key={mockup.id}
                className={`cursor-pointer transition-all ${
                  selectedMockup?.id === mockup.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => selectMockup(mockup)}
              >
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">{mockup.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="aspect-video relative overflow-hidden rounded-md">
                    <img 
                      src={mockup.imageSrc} 
                      alt={mockup.name} 
                      className="w-full h-full object-contain"
                      crossOrigin="anonymous"
                    />
                    <div 
                      className="absolute border-2 border-primary border-dashed opacity-50"
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

          {selectedMockup && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Upload Your Image</CardTitle>
                <CardDescription>
                  Select an image to place on the {selectedMockup.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
          <Card>
            <CardContent className="p-6">
              {isGenerating ? (
                <div className="aspect-video bg-muted flex flex-col items-center justify-center rounded-md">
                  <p className="text-muted-foreground mb-4">Generating preview...</p>
                  <div className="w-2/3">
                    <Progress value={progress} className="h-2" />
                  </div>
                </div>
              ) : previewImage ? (
                <div className="aspect-video relative overflow-hidden rounded-md">
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-muted flex items-center justify-center rounded-md">
                  <p className="text-muted-foreground">
                    {!selectedMockup
                      ? 'Select a mockup to start'
                      : !userImage
                        ? 'Upload your image to see preview'
                        : 'Preparing preview...'}
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <DownloadButton 
                onDownload={handleDownload} 
                className={!previewImage ? 'opacity-50 cursor-not-allowed' : ''}
              >
                Download Mockup
              </DownloadButton>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MockupUser;
