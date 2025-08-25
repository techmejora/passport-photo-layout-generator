import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Download, Upload, RotateCcw, Sliders } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';
import FileUploadZone from '../components/ui/FileUploadZone';
import ImagePreview from '../components/ui/ImagePreview';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function ImageEnhancerPage() {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [sharpness, setSharpness] = useState(50);
  const [hue, setHue] = useState(0);
  const [gamma, setGamma] = useState(1.0);
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

  const handleEnhance = async () => {
    if (!selectedImage) {
      toast({
        title: "No Image Selected",
        description: "Please select an image to enhance",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const result = await backend.image.enhanceImage({
        imageData: selectedImage,
        adjustments: {
          brightness,
          contrast,
          saturation,
          sharpness,
          hue,
          gamma
        },
        quality: parseInt(quality),
        format: format as "jpeg" | "png" | "webp"
      });

      setProcessedResult(result);
      
      toast({
        title: "Image Enhanced Successfully",
        description: "Your image has been enhanced with the selected adjustments",
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
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setSharpness(50);
    setHue(0);
    setGamma(1.0);
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

  const applyPreset = async (preset: string) => {
    if (!selectedImage) return;

    setIsProcessing(true);
    try {
      const result = await backend.image.enhanceImage({
        imageData: selectedImage,
        adjustments: {
          brightness: 100,
          contrast: 100,
          saturation: 100,
          sharpness: 50
        },
        preset: preset as "vibrant" | "vintage" | "portrait" | "landscape" | "bw" | "sepia",
        quality: parseInt(quality),
        format: format as "jpeg" | "png" | "webp"
      });

      setProcessedResult(result);
      
      // Update sliders to match applied adjustments
      setBrightness(result.appliedAdjustments.brightness);
      setContrast(result.appliedAdjustments.contrast);
      setSaturation(result.appliedAdjustments.saturation);
      setSharpness(result.appliedAdjustments.sharpness);
      setHue(result.appliedAdjustments.hue);
      setGamma(result.appliedAdjustments.gamma);
      
      toast({
        title: "Preset Applied",
        description: `${preset.charAt(0).toUpperCase() + preset.slice(1)} preset has been applied`,
      });
    } catch (error) {
      console.error('Failed to apply preset:', error);
      toast({
        title: "Preset Failed",
        description: "Failed to apply preset. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getImageStyle = () => {
    return {
      filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hue}deg)`,
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
          Enhance your images with professional-grade adjustments. Improve brightness, contrast, saturation, and more.
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
                    <Button variant="outline" onClick={() => handleRotate(selectedImage)}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Rotate
                    </Button>
                  </div>
                </div>
              ) : (
                <FileUploadZone onFileSelect={handleFile} />
              )}
            </CardContent>
          </Card>

          {processedResult && (
            <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                <CardTitle>Enhancement Results</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-gray-700">Brightness:</div>
                      <div className="text-gray-600">{processedResult.appliedAdjustments.brightness}%</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700">Contrast:</div>
                      <div className="text-gray-600">{processedResult.appliedAdjustments.contrast}%</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700">Saturation:</div>
                      <div className="text-gray-600">{processedResult.appliedAdjustments.saturation}%</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700">Sharpness:</div>
                      <div className="text-gray-600">{processedResult.appliedAdjustments.sharpness}%</div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => window.open(processedResult.downloadUrl, '_blank')}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Enhanced Image
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
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

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Hue</Label>
                    <span className="text-sm text-gray-500">{hue}°</span>
                  </div>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={hue}
                    onChange={(e) => setHue(parseInt(e.target.value))}
                    className="w-full accent-purple-600"
                  />
                </div>
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
                  className="w-full accent-purple-600"
                />
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Quick Presets</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-purple-200 hover:bg-purple-50"
                    onClick={() => applyPreset('vibrant')}
                    disabled={!selectedImage || isProcessing}
                  >
                    Vibrant
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-purple-200 hover:bg-purple-50"
                    onClick={() => applyPreset('vintage')}
                    disabled={!selectedImage || isProcessing}
                  >
                    Vintage
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-purple-200 hover:bg-purple-50"
                    onClick={() => applyPreset('portrait')}
                    disabled={!selectedImage || isProcessing}
                  >
                    Portrait
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-purple-200 hover:bg-purple-50"
                    onClick={() => applyPreset('landscape')}
                    disabled={!selectedImage || isProcessing}
                  >
                    Landscape
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-purple-200 hover:bg-purple-50"
                    onClick={() => applyPreset('bw')}
                    disabled={!selectedImage || isProcessing}
                  >
                    Black & White
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-purple-200 hover:bg-purple-50"
                    onClick={() => applyPreset('sepia')}
                    disabled={!selectedImage || isProcessing}
                  >
                    Sepia
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
                      Enhance Image
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
