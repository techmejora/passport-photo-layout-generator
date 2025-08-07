import React, { useCallback, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';
import FileUploadZone from './ui/FileUploadZone';
import ImagePreview from './ui/ImagePreview';

interface PhotoUploadProps {
  onImageSelect: (imageData: string) => void;
  backgroundColor: string;
  selectedImage: string | null;
  onImageUpdate: (imageData: string) => void;
}

export default function PhotoUpload({ 
  onImageSelect, 
  backgroundColor, 
  selectedImage, 
  onImageUpdate 
}: PhotoUploadProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageSelect(result);
    };
    reader.readAsDataURL(file);
  }, [onImageSelect]);

  const removeBackground = useCallback(async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    try {
      const backgroundColors = {
        white: '#FFFFFF',
        'light-gray': '#F5F5F5',
        blue: '#E3F2FD',
        red: '#FFEBEE',
        'light-blue': '#F0F8FF',
        cream: '#FFFDD0'
      };

      const bgColor = backgroundColors[backgroundColor as keyof typeof backgroundColors] || '#E3F2FD';

      const result = await backend.photo.removeBackground({
        imageData: selectedImage,
        backgroundColor: bgColor
      });

      onImageUpdate(result.processedImageData);

      toast({
        title: "Background Removed",
        description: "Background has been removed and new color applied",
      });
    } catch (error) {
      console.error('Failed to remove background:', error);
      toast({
        title: "Processing Failed",
        description: "Failed to remove background. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [selectedImage, backgroundColor, onImageUpdate, toast]);

  const handleReplace = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFile(file);
      }
    };
    input.click();
  }, [handleFile]);

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Upload className="h-5 w-5" />
          <span>Upload Your Photo</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {selectedImage ? (
          <ImagePreview
            src={selectedImage}
            alt="Selected photo"
            onReplace={handleReplace}
            onProcess={removeBackground}
            isProcessing={isProcessing}
          />
        ) : (
          <FileUploadZone onFileSelect={handleFile} />
        )}
      </CardContent>
    </Card>
  );
}
