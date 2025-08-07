import React, { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';
import type { PhotoSettings } from '~backend/photo/settings';
import type { CalculateLayoutResponse } from '~backend/photo/calculate';
import Header from './Header';
import PhotoUpload from './PhotoUpload';
import LayoutPreview from './LayoutPreview';
import LayoutSpecifications from './LayoutSpecifications';
import FeatureCards from './FeatureCards';
import LoadingSpinner from './ui/LoadingSpinner';

export default function PhotoLayoutGenerator() {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [paperSize, setPaperSize] = useState('4R');
  const [photoSize, setPhotoSize] = useState('3.5x4.5');
  const [backgroundColor, setBackgroundColor] = useState('blue');
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch photo settings
  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['photo-settings'],
    queryFn: async () => {
      try {
        return await backend.photo.getSettings();
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        toast({
          title: "Error",
          description: "Failed to load photo settings",
          variant: "destructive",
        });
        throw error;
      }
    }
  });

  // Calculate layout when paper/photo size changes
  const { data: layout, isLoading: layoutLoading } = useQuery({
    queryKey: ['layout-calculation', paperSize, photoSize],
    queryFn: async () => {
      try {
        return await backend.photo.calculateLayout({
          paperSizeId: paperSize,
          photoSizeId: photoSize
        });
      } catch (error) {
        console.error('Failed to calculate layout:', error);
        toast({
          title: "Error",
          description: "Failed to calculate layout",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!paperSize && !!photoSize
  });

  const handleImageSelect = useCallback((imageData: string) => {
    setSelectedImage(imageData);
  }, []);

  const handleImageUpdate = useCallback((imageData: string) => {
    setSelectedImage(imageData);
  }, []);

  const handleGenerateLayout = async () => {
    if (!selectedImage) {
      toast({
        title: "No Image Selected",
        description: "Please upload an image first",
        variant: "destructive",
      });
      return;
    }

    if (!layout) {
      toast({
        title: "Layout Not Ready",
        description: "Please wait for layout calculation to complete",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await backend.photo.generateLayout({
        imageData: selectedImage,
        paperSize: paperSize as "3R" | "4R" | "5R" | "A4" | "A5" | "Letter" | "Legal",
        photoSize: photoSize as "3.5x4.5" | "2x2" | "35x45mm",
        backgroundColor,
        rows: layout.rows,
        columns: layout.columns
      });

      toast({
        title: "Layout Generated",
        description: "Your passport photo layout is ready for download",
      });

      // Open download URL in new tab
      window.open(result.downloadUrl, '_blank');
    } catch (error) {
      console.error('Failed to generate layout:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate photo layout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (settingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading settings..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Upload */}
          <div className="space-y-6">
            <PhotoUpload 
              onImageSelect={handleImageSelect} 
              backgroundColor={backgroundColor}
              selectedImage={selectedImage}
              onImageUpdate={handleImageUpdate}
            />
            
            {layout && (
              <LayoutSpecifications 
                layout={layout}
                paperSize={paperSize}
                photoSize={photoSize}
                settings={settings}
              />
            )}
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6">
            <LayoutPreview
              layout={layout}
              selectedImage={selectedImage}
              backgroundColor={backgroundColor}
              paperSize={paperSize}
              photoSize={photoSize}
              settings={settings}
              isLoading={layoutLoading}
              isGenerating={isGenerating}
              onPaperSizeChange={setPaperSize}
              onPhotoSizeChange={setPhotoSize}
              onBackgroundColorChange={setBackgroundColor}
              onGenerateLayout={handleGenerateLayout}
            />
          </div>
        </div>

        <FeatureCards />
      </main>
    </div>
  );
}
