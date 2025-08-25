import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Crop, Download, Upload, RotateCcw, Square, Circle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';
import FileUploadZone from '../components/ui/FileUploadZone';
import ImagePreview from '../components/ui/ImagePreview';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function ImageCropperPage() {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cropShape, setCropShape] = useState('rectangle');
  const [aspectRatio, setAspectRatio] = useState('free');
  const [quality, setQuality] = useState('90');
  const [format, setFormat] = useState('jpeg');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedResult, setProcessedResult] = useState<any>(null);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSelectedImage(result);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleCrop = async () => {
    if (!selectedImage) {
      toast({
        title: "No Image Selected",
        description: "Please select an image to crop",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Mock crop area - in real implementation, this would come from a crop selection UI
      const cropArea = {
        x: 100,
        y: 100,
        width: 400,
        height: 300
      };

      const result = await backend.image.cropImage({
        imageData: selectedImage,
        cropArea,
        shape: cropShape as "rectangle" | "circle",
        aspectRatio: aspectRatio === 'free' ? undefined : aspectRatio,
        quality: parseInt(quality),
        format: format as "jpeg" | "png" | "webp"
      });

      setProcessedResult(result);
      
      toast({
        title: "Image Cropped Successfully",
        description: `Image cropped to ${result.croppedSize.width}x${result.croppedSize.height} pixels`,
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
    setProcessedResult(null);
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

  const handleRotate = useCallback((rotatedImageData: string) => {
    setSelectedImage(rotatedImageData);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-green-50 to-emerald-50 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-full shadow-lg">
            <Crop className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Image Cropper</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Crop your images to focus on what matters most. Choose from various aspect ratios and shapes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Upload Image</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {selectedImage ? (
                <div className="space-y-4">
                  <div className="relative">
                    <ImagePreview
                      src={selectedImage}
                      alt="Selected image"
                      onReplace={handleReplace}
                      onRotate={handleRotate}
                      className="relative"
                    />
                    {/* Crop overlay simulation */}
                    <div className="absolute inset-4 border-2 border-green-500 bg-green-500 bg-opacity-10 rounded-lg pointer-events-none">
                      <div className="absolute -top-1 -left-1 w-3 h-3 bg-green-500 rounded-full shadow-lg"></div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full shadow-lg"></div>
                      <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-green-500 rounded-full shadow-lg"></div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full shadow-lg"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <FileUploadZone onFileSelect={handleFile} />
              )}
            </CardContent>
          </Card>

          {processedResult && (
            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg">
                <CardTitle>Cropping Results</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-gray-700">Cropped Size:</div>
                      <div className="text-gray-600">{processedResult.croppedSize.width} × {processedResult.croppedSize.height} px</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700">Original Size:</div>
                      <div className="text-gray-600">{processedResult.originalSize.width} × {processedResult.originalSize.height} px</div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => window.open(processedResult.downloadUrl, '_blank')}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Cropped Image
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Settings Section */}
        <div className="space-y-6">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
              <CardTitle>Crop Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
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

              <div className="space-y-2">
                <Label>Output Format</Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jpeg">JPEG</SelectItem>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="webp">WebP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Quality ({quality}%)</Label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full accent-green-600"
                />
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Quick Presets</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-green-200 hover:bg-green-50"
                    onClick={() => setAspectRatio('1:1')}
                  >
                    Instagram Post
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-green-200 hover:bg-green-50"
                    onClick={() => setAspectRatio('9:16')}
                  >
                    Instagram Story
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-green-200 hover:bg-green-50"
                    onClick={() => setAspectRatio('16:9')}
                  >
                    Facebook Cover
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-green-200 hover:bg-green-50"
                    onClick={() => setAspectRatio('3:1')}
                  >
                    Twitter Header
                  </Button>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" className="flex-1 border-green-200 hover:bg-green-50" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button 
                  onClick={handleCrop}
                  disabled={!selectedImage || isProcessing}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                >
                  {isProcessing ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Cropping...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Crop Image
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
