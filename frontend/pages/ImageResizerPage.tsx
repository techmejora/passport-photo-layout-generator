import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Maximize, Download, Upload, RotateCcw, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';
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
  const [format, setFormat] = useState('jpeg');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedResult, setProcessedResult] = useState<any>(null);

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
    if (!selectedImage || !newWidth || !newHeight) {
      toast({
        title: "Missing Information",
        description: "Please select an image and specify dimensions",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const result = await backend.image.resizeImage({
        imageData: selectedImage,
        width: parseInt(newWidth),
        height: parseInt(newHeight),
        maintainAspectRatio,
        quality: parseInt(quality),
        format: format as "jpeg" | "png" | "webp"
      });

      setProcessedResult(result);
      
      toast({
        title: "Image Resized Successfully",
        description: `Image resized to ${result.newSize.width}x${result.newSize.height} pixels`,
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
    
    // Update dimensions for rotated image
    const img = new Image();
    img.onload = () => {
      setOriginalDimensions({ width: img.width, height: img.height });
      setNewWidth(img.width.toString());
      setNewHeight(img.height.toString());
    };
    img.src = rotatedImageData;
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-full shadow-lg">
            <Maximize className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Image Resizer</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Resize your images to any dimension while maintaining quality. Perfect for web optimization, social media, and print.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Upload Image</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {selectedImage ? (
                <ImagePreview
                  src={selectedImage}
                  alt="Selected image"
                  onReplace={handleReplace}
                  onRotate={handleRotate}
                />
              ) : (
                <FileUploadZone onFileSelect={handleFile} />
              )}
            </CardContent>
          </Card>

          {originalDimensions.width > 0 && (
            <Card className="border-0 shadow-xl bg-gradient-to-br from-cyan-50 to-blue-50">
              <CardHeader className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-t-lg">
                <CardTitle>Original Dimensions</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
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

          {processedResult && (
            <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                <CardTitle>Processing Results</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-gray-700">New Size:</div>
                      <div className="text-gray-600">{processedResult.newSize.width} × {processedResult.newSize.height} px</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700">File Size:</div>
                      <div className="text-gray-600">{formatFileSize(processedResult.newSize.fileSize)}</div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => window.open(processedResult.downloadUrl, '_blank')}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Resized Image
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Settings Section */}
        <div className="space-y-6">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg">
              <CardTitle>Resize Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
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
                  className="w-full accent-blue-600"
                />
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Quick Presets</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-blue-200 hover:bg-blue-50"
                    onClick={() => {
                      setNewWidth('1920');
                      setNewHeight('1080');
                    }}
                  >
                    Full HD
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-blue-200 hover:bg-blue-50"
                    onClick={() => {
                      setNewWidth('1280');
                      setNewHeight('720');
                    }}
                  >
                    HD
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-blue-200 hover:bg-blue-50"
                    onClick={() => {
                      setNewWidth('800');
                      setNewHeight('600');
                    }}
                  >
                    Web
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-blue-200 hover:bg-blue-50"
                    onClick={() => {
                      setNewWidth('400');
                      setNewHeight('400');
                    }}
                  >
                    Thumbnail
                  </Button>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" className="flex-1 border-blue-200 hover:bg-blue-50" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button 
                  onClick={handleResize}
                  disabled={!selectedImage || isProcessing}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg"
                >
                  {isProcessing ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Resizing...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Resize Image
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
