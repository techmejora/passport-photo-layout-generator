import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import type { CalculateLayoutResponse } from '~backend/photo/calculate';
import type { PhotoSettings } from '~backend/photo/settings';
import SpecificationItem from './ui/SpecificationItem';

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

  const specifications = [
    {
      label: "Sheet Size",
      value: selectedPaper ? `${selectedPaper.width} × ${selectedPaper.height} cm` : 'N/A'
    },
    {
      label: "Photos per sheet",
      value: `${layout.totalPhotos} photos (${layout.rows}×${layout.columns} grid)`
    },
    {
      label: "Photo Size",
      value: selectedPhoto ? `${selectedPhoto.width} × ${selectedPhoto.height} cm (with border)` : 'N/A'
    },
    {
      label: "Image Area",
      value: selectedPhoto ? `${(selectedPhoto.width - 0.6).toFixed(1)} × ${(selectedPhoto.height - 0.6).toFixed(1)} cm (without border)` : 'N/A'
    },
    {
      label: "Border Area",
      value: selectedPhoto ? `${selectedPhoto.borderWidth} mm White Border` : 'N/A'
    },
    {
      label: "Margins",
      value: selectedPaper ? `${selectedPaper.marginLeft} cm L/R, ${selectedPaper.marginTop} cm T/B` : 'N/A'
    },
    {
      label: "Resolution",
      value: "300 DPI with cutting edges"
    }
  ];

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
      <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <span>Layout Specifications</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          {specifications.map((spec, index) => (
            <SpecificationItem
              key={index}
              label={spec.label}
              value={spec.value}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
