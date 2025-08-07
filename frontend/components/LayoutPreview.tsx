import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, RotateCcw, Download } from 'lucide-react';
import type { CalculateLayoutResponse } from '~backend/photo/calculate';
import type { PhotoSettings } from '~backend/photo/settings';

interface LayoutPreviewProps {
  layout: CalculateLayoutResponse;
  selectedImage: string | null;
  backgroundColor: string;
  paperSize: string;
  photoSize: string;
  settings: PhotoSettings | undefined;
  isLoading: boolean;
  isGenerating: boolean;
  onPaperSizeChange: (value: string) => void;
  onPhotoSizeChange: (value: string) => void;
  onBackgroundColorChange: (value: string) => void;
  onGenerateLayout: () => void;
}

const backgroundColors = {
  white: '#FFFFFF',
  'light-gray': '#F5F5F5',
  blue: '#E3F2FD',
  red: '#FFEBEE',
  'light-blue': '#F0F8FF',
  cream: '#FFFDD0'
};

export default function LayoutPreview({
  layout,
  selectedImage,
  backgroundColor,
  paperSize,
  photoSize,
  settings,
  isLoading,
  isGenerating,
  onPaperSizeChange,
  onPhotoSizeChange,
  onBackgroundColorChange,
  onGenerateLayout
}: LayoutPreviewProps) {
  const bgColor = backgroundColors[backgroundColor as keyof typeof backgroundColors] || '#E3F2FD';

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-blue-600" />
            <span>Preview Layout</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Eye className="h-5 w-5 text-blue-600" />
          <span>Preview Layout</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Settings Controls */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Photo Sheet:</Label>
            <Select value={paperSize} onValueChange={onPaperSizeChange}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {settings?.paperSizes.map((size) => (
                  <SelectItem key={size.id} value={size.id}>
                    {size.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Photo Size:</Label>
            <Select value={photoSize} onValueChange={onPhotoSizeChange}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {settings?.photoSizes.map((size) => (
                  <SelectItem key={size.id} value={size.id}>
                    {size.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Background Color:</Label>
            <Select value={backgroundColor} onValueChange={onBackgroundColorChange}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {settings?.backgroundColors.map((color) => (
                  <SelectItem key={color.id} value={color.id}>
                    {color.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Visual Preview */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div 
            className="mx-auto border-2 border-gray-300 rounded-lg p-4 bg-white shadow-sm"
            style={{
              width: `${Math.min(500, layout.usableWidth * 25)}px`,
              height: `${Math.min(350, layout.usableHeight * 25)}px`,
              aspectRatio: `${layout.usableWidth} / ${layout.usableHeight}`
            }}
          >
            <div 
              className="grid gap-2 h-full"
              style={{
                gridTemplateRows: `repeat(${layout.rows}, 1fr)`,
                gridTemplateColumns: `repeat(${layout.columns}, 1fr)`
              }}
            >
              {Array.from({ length: layout.totalPhotos }).map((_, index) => (
                <div
                  key={index}
                  className="border border-gray-300 flex items-center justify-center overflow-hidden rounded-sm"
                  style={{ 
                    aspectRatio: '3.5 / 4.5',
                    backgroundColor: bgColor
                  }}
                >
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 text-center">
                      <User className="h-6 w-6 mx-auto mb-1" />
                      <div className="text-xs">Photo</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button variant="outline" className="flex-1">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button 
            onClick={onGenerateLayout}
            disabled={!selectedImage || isGenerating}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
