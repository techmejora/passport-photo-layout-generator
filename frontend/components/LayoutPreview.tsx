import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Grid, Ruler } from 'lucide-react';
import type { CalculateLayoutResponse } from '~backend/photo/calculate';

interface LayoutPreviewProps {
  layout: CalculateLayoutResponse;
  selectedImage: string | null;
  backgroundColor: string;
  isLoading: boolean;
}

const backgroundColors = {
  white: '#FFFFFF',
  'light-gray': '#F5F5F5',
  blue: '#E3F2FD',
  red: '#FFEBEE'
};

export default function LayoutPreview({
  layout,
  selectedImage,
  backgroundColor,
  isLoading
}: LayoutPreviewProps) {
  const bgColor = backgroundColors[backgroundColor as keyof typeof backgroundColors] || '#FFFFFF';

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>Layout Preview</span>
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
          <Eye className="h-5 w-5" />
          <span>Layout Preview</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Layout Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-gray-50 p-3 rounded-lg">
            <Grid className="h-5 w-5 mx-auto mb-1 text-blue-600" />
            <div className="text-lg font-semibold">{layout.totalPhotos}</div>
            <div className="text-xs text-gray-600">Total Photos</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <Ruler className="h-5 w-5 mx-auto mb-1 text-green-600" />
            <div className="text-lg font-semibold">{layout.rows} × {layout.columns}</div>
            <div className="text-xs text-gray-600">Grid Layout</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-lg font-semibold">{layout.usableWidth.toFixed(1)} cm</div>
            <div className="text-xs text-gray-600">Usable Width</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-lg font-semibold">{layout.usableHeight.toFixed(1)} cm</div>
            <div className="text-xs text-gray-600">Usable Height</div>
          </div>
        </div>

        {/* Visual Preview */}
        <div className="border rounded-lg p-4" style={{ backgroundColor: bgColor }}>
          <div className="text-center mb-4">
            <h3 className="font-medium text-gray-700">Layout Preview</h3>
            <p className="text-sm text-gray-500">
              {layout.rows} rows × {layout.columns} columns = {layout.totalPhotos} photos
            </p>
          </div>
          
          <div 
            className="mx-auto border-2 border-dashed border-gray-300 p-2"
            style={{
              width: `${Math.min(400, layout.usableWidth * 20)}px`,
              height: `${Math.min(300, layout.usableHeight * 20)}px`,
              aspectRatio: `${layout.usableWidth} / ${layout.usableHeight}`
            }}
          >
            <div 
              className="grid gap-1 h-full"
              style={{
                gridTemplateRows: `repeat(${layout.rows}, 1fr)`,
                gridTemplateColumns: `repeat(${layout.columns}, 1fr)`
              }}
            >
              {Array.from({ length: layout.totalPhotos }).map((_, index) => (
                <div
                  key={index}
                  className="border border-gray-400 bg-white flex items-center justify-center overflow-hidden"
                  style={{ aspectRatio: '3.5 / 4.5' }}
                >
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-xs text-gray-400 text-center">
                      Photo<br />{index + 1}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Cutting marks will be added to the final PDF for easy trimming
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
