import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Settings, Wand2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';
import type { PhotoSettings } from '~backend/photo/settings';

interface SettingsPanelProps {
  settings: PhotoSettings;
  paperSize: string;
  photoSize: string;
  backgroundColor: string;
  selectedImage: string | null;
  onPaperSizeChange: (value: string) => void;
  onPhotoSizeChange: (value: string) => void;
  onBackgroundColorChange: (value: string) => void;
  onImageUpdate: (imageData: string) => void;
}

export default function SettingsPanel({
  settings,
  paperSize,
  photoSize,
  backgroundColor,
  selectedImage,
  onPaperSizeChange,
  onPhotoSizeChange,
  onBackgroundColorChange,
  onImageUpdate
}: SettingsPanelProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const removeBackground = React.useCallback(async () => {
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

      const bgColor = backgroundColors[backgroundColor as keyof typeof backgroundColors] || '#FFFFFF';

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
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <span>Layout Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="paper-size">Paper Size</Label>
          <Select value={paperSize} onValueChange={onPaperSizeChange}>
            <SelectTrigger id="paper-size">
              <SelectValue placeholder="Select paper size" />
            </SelectTrigger>
            <SelectContent>
              {settings.paperSizes.map((size) => (
                <SelectItem key={size.id} value={size.id}>
                  {size.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="photo-size">Photo Size</Label>
          <Select value={photoSize} onValueChange={onPhotoSizeChange}>
            <SelectTrigger id="photo-size">
              <SelectValue placeholder="Select photo size" />
            </SelectTrigger>
            <SelectContent>
              {settings.photoSizes.map((size) => (
                <SelectItem key={size.id} value={size.id}>
                  {size.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="background-color">Background Color</Label>
          <Select value={backgroundColor} onValueChange={onBackgroundColorChange}>
            <SelectTrigger id="background-color">
              <SelectValue placeholder="Select background color" />
            </SelectTrigger>
            <SelectContent>
              {settings.backgroundColors.map((color) => (
                <SelectItem key={color.id} value={color.id}>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span>{color.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedImage && (
          <div className="space-y-2">
            <Button
              onClick={removeBackground}
              disabled={isProcessing}
              variant="outline"
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Remove Background
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
