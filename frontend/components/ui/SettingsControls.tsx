import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { PhotoSettings } from '~backend/photo/settings';

interface SettingsControlsProps {
  paperSize: string;
  photoSize: string;
  backgroundColor: string;
  settings: PhotoSettings | undefined;
  onPaperSizeChange: (value: string) => void;
  onPhotoSizeChange: (value: string) => void;
  onBackgroundColorChange: (value: string) => void;
}

export default function SettingsControls({
  paperSize,
  photoSize,
  backgroundColor,
  settings,
  onPaperSizeChange,
  onPhotoSizeChange,
  onBackgroundColorChange
}: SettingsControlsProps) {
  return (
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
  );
}
