import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, RotateCcw, Download, User } from 'lucide-react';
import type { CalculateLayoutResponse } from '~backend/photo/calculate';
import type { PhotoSettings } from '~backend/photo/settings';
import LoadingSpinner from './ui/LoadingSpinner';
import PhotoGrid from './ui/PhotoGrid';
import SettingsControls from './ui/SettingsControls';

interface LayoutPreviewProps {
  layout: CalculateLayoutResponse | undefined;
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
  if (isLoading || !layout) {
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
            <LoadingSpinner size="md" />
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
        <SettingsControls
          paperSize={paperSize}
          photoSize={photoSize}
          backgroundColor={backgroundColor}
          settings={settings}
          onPaperSizeChange={onPaperSizeChange}
          onPhotoSizeChange={onPhotoSizeChange}
          onBackgroundColorChange={onBackgroundColorChange}
        />

        {/* Visual Preview */}
        <PhotoGrid
          layout={layout}
          selectedImage={selectedImage}
          backgroundColor={backgroundColor}
        />

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
                <LoadingSpinner size="sm" className="mr-2" />
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
