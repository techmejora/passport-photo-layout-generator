import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import type { CalculateLayoutResponse } from '~backend/photo/calculate';
import type { PhotoSettings } from '~backend/photo/settings';

interface LayoutSpecificationsProps {
  layout: CalculateLayoutResponse;
  paperSize: string;
  photoSize: string;
  settings: PhotoSettings | undefined;
}

export default function LayoutSpecifications({
  layout,
  paperSize,
  photoSize,
  settings
}: LayoutSpecificationsProps) {
  const selectedPaper = settings?.paperSizes.find(p => p.id === paperSize);
  const selectedPhoto = settings?.photoSizes.find(p => p.id === photoSize);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5 text-blue-600" />
          <span>Layout Specifications</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium text-gray-700">Sheet Size:</div>
            <div className="text-gray-600">
              {selectedPaper ? `${selectedPaper.width} × ${selectedPaper.height} cm` : 'N/A'}
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Photos per sheet:</div>
            <div className="text-gray-600">{layout.totalPhotos} photos ({layout.rows}×{layout.columns} grid)</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Photo Size:</div>
            <div className="text-gray-600">
              {selectedPhoto ? `${selectedPhoto.width} × ${selectedPhoto.height} cm (with border)` : 'N/A'}
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Image Area:</div>
            <div className="text-gray-600">
              {selectedPhoto ? `${(selectedPhoto.width - 0.6).toFixed(1)} × ${(selectedPhoto.height - 0.6).toFixed(1)} cm (without border)` : 'N/A'}
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Border Area:</div>
            <div className="text-gray-600">
              {selectedPhoto ? `${selectedPhoto.borderWidth} mm White Border` : 'N/A'}
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Margins:</div>
            <div className="text-gray-600">
              {selectedPaper ? `${selectedPaper.marginLeft} cm L/R, ${selectedPaper.marginTop} cm T/B` : 'N/A'}
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Resolution:</div>
            <div className="text-gray-600">300 DPI with cutting edges</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
