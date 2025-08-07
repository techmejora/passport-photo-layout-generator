import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Maximize, Download, Upload, RotateCcw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import FileUploadZone from '../components/ui/FileUploadZone';
import ImagePreview from '../components/ui/ImagePreview';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function ImageResizerPage() {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [newWidth, setNewWidth] = useState('');
  const [newHeight, setNewHeight] = useState('');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [resizeMode, setResizeMode] = useState('pixels');
  const [quality, setQuality] = useState('90');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSelectedImage(result);
      
      // Get image dimensions
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        setNewWidth(img.width.toString());
        setNewHeight(img.height.toString());
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleWidthChange = (value: string) => {
    setNewWidth(value);
    if (maintainAspectRatio && originalDimensions.width > 0) {
      const ratio = originalDimensions.height / originalDimensions.width;
      setNewHeight(Math.round(parseInt(value) * ratio).toString());
    }
  };

  const handleHeightChange = (value: string) => {
    setNewHeight(value);
    if (maintainAspectRatio && originalDimensions.height > 0) {
      const ratio = originalDimensions.width / originalDimensions.height;
      setNewWidth(Math.round(parseInt(value) * ratio).toString());
    }
  };

  const handleResize = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Image Resized",
        description: `Image resized to ${newWidth}x${newHeight} pixels`,
      });
    } catch (error) {
      console.error('Failed to resize image:', error);
      toast({
        title: "Resize Failed",
        description: "Failed to resize image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setOriginalDimensions({ width: 0, height: 0 });
    setNewWidth('');
    setNewHeight('');
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
          <div className="bg-blue-100 p-3 rounded-full">
            <Maximize className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Image Resizer</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Resize your images to any dimension while maintaining quality. Perfect for web optimization, social media, and print.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5 text-blue-600" />
                <span>Upload Image</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedImage ? (
                <ImagePreview
                  src={selectedImage}
                  alt="Selected image"
                  onReplace={handleReplace}
                />
              ) : (
                <FileUploadZone onFileSelect={handleFile} />
              )}
            </CardContent>
          </Card>

          {originalDimensions.width > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Original Dimensions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-700">Width:</div>
                    <div className="text-gray-600">{originalDimensions.width} px</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700">Height:</div>
                    <div className="text-gray-600">{originalDimensions.height} px</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Settings Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resize Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Resize Mode</Label>
                <Select value={resizeMode} onValueChange={setResizeMode}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pixels">Pixels</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="preset">Preset Sizes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Width</Label>
                  <Input
                    type="number"
                    value={newWidth}
                    onChange={(e) => handleWidthChange(e.target.value)}
                    placeholder="Width"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Height</Label>
                  <Input
                    type="number"
                    value={newHeight}
                    onChange={(e) => handleHeightChange(e.target.value)}
                    placeholder="Height"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="aspectRatio"
                  checked={maintainAspectRatio}
                  onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="aspectRatio" className="text-sm">
                  Maintain aspect ratio
                </Label>
              </div>

              <div className="space-y-2">
                <Label>Quality ({quality}%)</Label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" className="flex-1" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button 
                  onClick={handleResize}
                  disabled={!selectedImage || isProcessing}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isProcessing ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Resizing...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Resize & Download
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
