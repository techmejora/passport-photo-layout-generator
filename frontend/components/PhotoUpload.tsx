import React, { useCallback, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Camera, User } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';

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
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageSelect(result);
    };
    reader.readAsDataURL(file);
  }, [onImageSelect, toast]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Upload className="h-5 w-5 text-blue-600" />
          <span>Upload Your Photo</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {selectedImage ? (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={selectedImage}
                alt="Selected"
                className="w-full h-64 object-cover rounded-lg border-2 border-dashed border-gray-300"
              />
            </div>
            
            <div className="flex space-x-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload-replace"
              />
              <Button asChild variant="outline" className="flex-1">
                <label htmlFor="file-upload-replace" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Browse Files
                </label>
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={removeBackground}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4 mr-2" />
                    Take Photo
                  </>
                )}
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 text-center">
              Supported: JPG, PNG, WEBP up to 10MB<br />
              Recommended: 300 DPI or higher
            </p>
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Upload className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drag and drop your photo here
            </p>
            <p className="text-sm text-gray-500 mb-6">
              or click to browse
            </p>
            
            <div className="flex space-x-2 justify-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Browse Files
                </label>
              </Button>
              <Button variant="outline">
                <Camera className="h-4 w-4 mr-2" />
                Take Photo
              </Button>
            </div>
            
            <p className="text-xs text-gray-400 mt-4">
              Supported: JPG, PNG, WEBP up to 10MB<br />
              Recommended: 300 DPI or higher
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
