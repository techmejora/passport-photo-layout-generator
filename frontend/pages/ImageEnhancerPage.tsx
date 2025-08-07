import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Sparkles, Download, Upload, RotateCcw, Sliders } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import FileUploadZone from '../components/ui/FileUploadZone';
import ImagePreview from '../components/ui/ImagePreview';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function ImageEnhancerPage() {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [brightness, setBrightness] = useState(50);
  const [contrast, setContrast] = useState(50);
  const [saturation, setSaturation] = useState(50);
  const [sharpness, setSharpness] = useState(50);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSelectedImage(result);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleEnhance = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Image Enhanced",
        description: "Image has been enhanced successfully",
      });
    } catch (error) {
      console.error('Failed to enhance image:', error);
      toast({
        title: "Enhancement Failed",
        description: "Failed to enhance image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setBrightness(50);
    setContrast(50);
    setSaturation(50);
    setSharpness(50);
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

  const getImageStyle = () => {
    return {
      filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${100 - sharpness}px)`,
    };
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full shadow-lg">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Image Enhancer</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Enhance your images with professional-grade adjustments. Improve brightness, contrast, saturation, and sharpness.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Upload Image</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {selectedImage ? (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={selectedImage}
                      alt="Selected image"
                      className="w-full h-64 object-cover rounded-lg border-2 border-dashed border-purple-300"
                      style={getImageStyle()}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1 border-purple-200 hover:bg-purple-50" onClick={handleReplace}>
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
          <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <Sliders className="h-5 w-5" />
                <span>Enhancement Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Brightness</Label>
                    <span className="text-sm text-gray-500">{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={brightness}
                    onChange={(e) => setBrightness(parseInt(e.target.value))}
                    className="w-full accent-purple-600"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Contrast</Label>
                    <span className="text-sm text-gray-500">{contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={contrast}
                    onChange={(e) => setContrast(parseInt(e.target.value))}
                    className="w-full accent-purple-600"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Saturation</Label>
                    <span className="text-sm text-gray-500">{saturation}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={saturation}
                    onChange={(e) => setSaturation(parseInt(e.target.value))}
                    className="w-full accent-purple-600"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Sharpness</Label>
                    <span className="text-sm text-gray-500">{sharpness}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sharpness}
                    onChange={(e) => setSharpness(parseInt(e.target.value))}
                    className="w-full accent-purple-600"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Quick Presets</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-purple-200 hover:bg-purple-50"
                    onClick={() => {
                      setBrightness(110);
                      setContrast(120);
                      setSaturation(110);
                      setSharpness(70);
                    }}
                  >
                    Vibrant
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-purple-200 hover:bg-purple-50"
                    onClick={() => {
                      setBrightness(90);
                      setContrast(80);
                      setSaturation(70);
                      setSharpness(60);
                    }}
                  >
                    Vintage
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-purple-200 hover:bg-purple-50"
                    onClick={() => {
                      setBrightness(120);
                      setContrast(110);
                      setSaturation(120);
                      setSharpness(80);
                    }}
                  >
                    Portrait
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-purple-200 hover:bg-purple-50"
                    onClick={() => {
                      setBrightness(105);
                      setContrast(115);
                      setSaturation(130);
                      setSharpness(75);
                    }}
                  >
                    Landscape
                  </Button>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" className="flex-1 border-purple-200 hover:bg-purple-50" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button 
                  onClick={handleEnhance}
                  disabled={!selectedImage || isProcessing}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                >
                  {isProcessing ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Enhancing...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Enhance & Download
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
