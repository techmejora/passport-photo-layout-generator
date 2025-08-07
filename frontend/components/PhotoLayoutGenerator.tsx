import React, { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';
import type { PhotoSettings } from '~backend/photo/settings';
import type { CalculateLayoutResponse } from '~backend/photo/calculate';
import PhotoUpload from './PhotoUpload';
import SettingsPanel from './SettingsPanel';
import LayoutPreview from './LayoutPreview';
import Header from './Header';

export default function PhotoLayoutGenerator() {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [paperSize, setPaperSize] = useState('4x6');
  const [photoSize, setPhotoSize] = useState('3.5x4.5');
  const [backgroundColor, setBackgroundColor] = useState('white');
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

  const handleGenerateLayout = async () => {
    if (!selectedImage) {
      toast({
        title: "No Image Selected",
        description: "Please upload an image first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await backend.photo.generateLayout({
        imageData: selectedImage,
        paperSize: paperSize as "4x6" | "A4",
        photoSize: photoSize as "3.5x4.5" | "2x2" | "35x45mm",
        backgroundColor,
        rows: layout?.rows || 2,
        columns: layout?.columns || 4
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Upload and Settings */}
          <div className="lg:col-span-1 space-y-6">
            <PhotoUpload onImageSelect={handleImageSelect} />
            
            {settings && (
              <SettingsPanel
                settings={settings}
                paperSize={paperSize}
                photoSize={photoSize}
                backgroundColor={backgroundColor}
                onPaperSizeChange={setPaperSize}
                onPhotoSizeChange={setPhotoSize}
                onBackgroundColorChange={setBackgroundColor}
              />
            )}
          </div>

          {/* Right Column - Preview and Generate */}
          <div className="lg:col-span-2 space-y-6">
            {layout && (
              <LayoutPreview
                layout={layout}
                selectedImage={selectedImage}
                backgroundColor={backgroundColor}
                isLoading={layoutLoading}
              />
            )}

            <Card>
              <CardContent className="p-6">
                <Button
                  onClick={handleGenerateLayout}
                  disabled={!selectedImage || isGenerating || layoutLoading}
                  className="w-full h-12 text-lg font-semibold"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Generating Layout...
                    </>
                  ) : (
                    'Generate & Download PDF'
                  )}
                </Button>
                
                {layout && (
                  <div className="mt-4 text-center text-sm text-gray-600">
                    This will generate {layout.totalPhotos} photos ({layout.rows} rows × {layout.columns} columns)
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
