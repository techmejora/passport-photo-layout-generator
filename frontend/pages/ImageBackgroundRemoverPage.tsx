import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eraser, Download, Upload, RotateCcw, Eye, Sparkles, Scissors } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useUsageLimit } from '../hooks/useUsageLimit';
import backend from '~backend/client';
import FileUploadZone from '../components/ui/FileUploadZone';
import ImagePreview from '../components/ui/ImagePreview';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import UsageLimitModal from '../components/pricing/UsageLimitModal';
import { useNavigate } from 'react-router-dom';

export default function ImageBackgroundRemoverPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkUsageLimit, recordUsage } = useUsageLimit();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState('png');
  const [quality, setQuality] = useState('90');
  const [transparentBackground, setTransparentBackground] = useState(true);
  const [edgeSmoothing, setEdgeSmoothing] = useState(true);
  const [featherRadius, setFeatherRadius] = useState(2);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedResult, setProcessedResult] = useState<any>(null);
  const [showUsageLimitModal, setShowUsageLimitModal] = useState(false);
  const [usageLimitInfo, setUsageLimitInfo] = useState<any>(null);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSelectedImage(result);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleRemoveBackground = async () => {
    if (!selectedImage) {
      toast({
        title: "No Image Selected",
        description: "Please select an image to remove background from",
        variant: "destructive",
      });
      return;
    }

    // Check usage limit first
    const usageCheck = await checkUsageLimit('image');
    if (!usageCheck.allowed) {
      setUsageLimitInfo(usageCheck);
      setShowUsageLimitModal(true);
      return;
    }

    setIsProcessing(true);
    try {
      const result = await backend.image.removeBackground({
        imageData: selectedImage,
        outputFormat: outputFormat as "png" | "jpeg" | "webp",
        quality: parseInt(quality),
        transparentBackground,
        edgeSmoothing,
        featherRadius
      });

      setProcessedResult(result);
      
      // Record usage after successful operation
      await recordUsage('image');
      
      toast({
        title: "Background Removed Successfully",
        description: `Background removed in ${(result.processingTime / 1000).toFixed(1)} seconds`,
      });
    } catch (error) {
      console.error('Failed to remove background:', error);
      toast({
        title: "Background Removal Failed",
        description: "Failed to remove background. Please try again.",
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-orange-50 to-red-50 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-full shadow-lg">
            <Eraser className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Background Remover</h1>
          <Sparkles className="h-8 w-8 text-orange-500 animate-pulse" />
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Remove backgrounds from your images instantly using AI. Perfect for product photos, portraits, and creating transparent images.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 to-red-50">
            <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
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

          {processedResult && (
            <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                <CardTitle>Processing Results</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-gray-700">Original Size:</div>
                      <div className="text-gray-600">{formatFileSize(processedResult.originalSize.fileSize)}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700">Processed Size:</div>
                      <div className="text-gray-600">{formatFileSize(processedResult.processedSize.fileSize)}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700">Processing Time:</div>
                      <div className="text-gray-600">{(processedResult.processingTime / 1000).toFixed(1)}s</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700">Format:</div>
                      <div className="text-gray-600">{outputFormat.toUpperCase()}</div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => {
                        // Create a temporary link to view the processed image
                        const link = document.createElement('a');
                        link.href = processedResult.processedImageData;
                        link.target = '_blank';
                        link.click();
                      }}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview Result
                    </Button>
                    <Button 
                      onClick={() => window.open(processedResult.downloadUrl, '_blank')}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Settings Section */}
        <div className="space-y-6">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 to-red-50">
            <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <Scissors className="h-5 w-5" />
                <span>Removal Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-2">
                <Label>Output Format</Label>
                <Select value={outputFormat} onValueChange={setOutputFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="png">PNG (Transparent)</SelectItem>
                    <SelectItem value="jpeg">JPEG (White Background)</SelectItem>
                    <SelectItem value="webp">WebP (Transparent)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  PNG and WebP support transparency. JPEG will use white background.
                </p>
              </div>

              {(outputFormat === 'jpeg' || outputFormat === 'webp') && (
                <div className="space-y-2">
                  <Label>Quality ({quality}%)</Label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(e.target.value)}
                    className="w-full accent-orange-600"
                  />
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="transparentBg"
                    checked={transparentBackground}
                    onChange={(e) => setTransparentBackground(e.target.checked)}
                    className="rounded"
                    disabled={outputFormat === 'jpeg'}
                  />
                  <Label htmlFor="transparentBg" className="text-sm">
                    Transparent background
                  </Label>
                </div>
                {outputFormat === 'jpeg' && (
                  <p className="text-xs text-gray-500">
                    JPEG format doesn't support transparency
                  </p>
                )}

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edgeSmoothing"
                    checked={edgeSmoothing}
                    onChange={(e) => setEdgeSmoothing(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="edgeSmoothing" className="text-sm">
                    Edge smoothing
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label>Edge Feathering ({featherRadius}px)</Label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={featherRadius}
                    onChange={(e) => setFeatherRadius(parseInt(e.target.value))}
                    className="w-full accent-orange-600"
                  />
                  <p className="text-xs text-gray-500">
                    Higher values create softer edges
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Quick Presets</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-orange-200 hover:bg-orange-50"
                    onClick={() => {
                      setOutputFormat('png');
                      setTransparentBackground(true);
                      setEdgeSmoothing(true);
                      setFeatherRadius(2);
                    }}
                  >
                    Product Photo
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-orange-200 hover:bg-orange-50"
                    onClick={() => {
                      setOutputFormat('png');
                      setTransparentBackground(true);
                      setEdgeSmoothing(true);
                      setFeatherRadius(4);
                    }}
                  >
                    Portrait
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-orange-200 hover:bg-orange-50"
                    onClick={() => {
                      setOutputFormat('jpeg');
                      setTransparentBackground(false);
                      setEdgeSmoothing(false);
                      setFeatherRadius(0);
                    }}
                  >
                    White Background
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-orange-200 hover:bg-orange-50"
                    onClick={() => {
                      setOutputFormat('webp');
                      setTransparentBackground(true);
                      setEdgeSmoothing(true);
                      setFeatherRadius(1);
                      setQuality('85');
                    }}
                  >
                    Web Optimized
                  </Button>
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-medium text-orange-800 mb-2">💡 Tips for Best Results</h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Use high-contrast images with clear subject boundaries</li>
                  <li>• Avoid busy or complex backgrounds</li>
                  <li>• Ensure good lighting on your subject</li>
                  <li>• Use PNG format for transparent backgrounds</li>
                </ul>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" className="flex-1 border-orange-200 hover:bg-orange-50" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button 
                  onClick={handleRemoveBackground}
                  disabled={!selectedImage || isProcessing}
                  className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg"
                >
                  {isProcessing ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Removing...
                    </>
                  ) : (
                    <>
                      <Eraser className="h-4 w-4 mr-2" />
                      Remove Background
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Usage Limit Modal */}
      <UsageLimitModal
        isOpen={showUsageLimitModal}
        onClose={() => setShowUsageLimitModal(false)}
        onUpgrade={() => {
          setShowUsageLimitModal(false);
          navigate('/pricing');
        }}
        operation="background removal"
        remaining={usageLimitInfo?.remaining || 0}
        limit={usageLimitInfo?.limit || 0}
      />
    </div>
  );
}
