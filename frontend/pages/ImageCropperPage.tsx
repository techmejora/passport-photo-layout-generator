import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Crop, Download, Upload, RotateCcw, Square, Circle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import FileUploadZone from '../components/ui/FileUploadZone';
import ImagePreview from '../components/ui/ImagePreview';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function ImageCropperPage() {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cropShape, setCropShape] = useState('rectangle');
  const [aspectRatio, setAspectRatio] = useState('free');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSelectedImage(result);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleCrop = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Image Cropped",
        description: "Image has been cropped successfully",
      });
    } catch (error) {
      console.error('Failed to crop image:', error);
      toast({
        title: "Crop Failed",
        description: "Failed to crop image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
  };

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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <Crop className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Image Cropper</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Crop your images to focus on what matters most. Choose from various aspect ratios and shapes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5 text-green-600" />
                <span>Upload Image</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedImage ? (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={selectedImage}
                      alt="Selected image"
                      className="w-full h-64 object-contain rounded-lg border-2 border-dashed border-gray-300 bg-gray-50"
                    />
                    {/* Crop overlay simulation */}
                    <div className="absolute inset-4 border-2 border-green-500 bg-green-500 bg-opacity-10 rounded-lg pointer-events-none">
                      <div className="absolute -top-1 -left-1 w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1" onClick={handleReplace}>
                      <Upload className="h-4 w-4 mr-2" />
                      Replace
                    </Button>
                  </div>
                </div>
              ) : (
                <FileUploadZone onFileSelect={handleFile} />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Settings Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Crop Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Crop Shape</Label>
                <Select value={cropShape} onValueChange={setCropShape}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rectangle">
                      <div className="flex items-center space-x-2">
                        <Square className="h-4 w-4" />
                        <span>Rectangle</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="circle">
                      <div className="flex items-center space-x-2">
                        <Circle className="h-4 w-4" />
                        <span>Circle</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Aspect Ratio</Label>
                <Select value={aspectRatio} onValueChange={setAspectRatio}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="1:1">1:1 (Square)</SelectItem>
                    <SelectItem value="4:3">4:3</SelectItem>
                    <SelectItem value="16:9">16:9</SelectItem>
                    <SelectItem value="3:2">3:2</SelectItem>
                    <SelectItem value="5:4">5:4</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Quick Presets</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">Instagram Post</Button>
                  <Button variant="outline" size="sm">Instagram Story</Button>
                  <Button variant="outline" size="sm">Facebook Cover</Button>
                  <Button variant="outline" size="sm">Twitter Header</Button>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" className="flex-1" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button 
                  onClick={handleCrop}
                  disabled={!selectedImage || isProcessing}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {isProcessing ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Cropping...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Crop & Download
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
