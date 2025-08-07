import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings } from 'lucide-react';
import type { PhotoSettings } from '~backend/photo/settings';

interface SettingsPanelProps {
  settings: PhotoSettings;
  paperSize: string;
  photoSize: string;
  backgroundColor: string;
  onPaperSizeChange: (value: string) => void;
  onPhotoSizeChange: (value: string) => void;
  onBackgroundColorChange: (value: string) => void;
}

export default function SettingsPanel({
  settings,
  paperSize,
  photoSize,
  backgroundColor,
  onPaperSizeChange,
  onPhotoSizeChange,
  onBackgroundColorChange
}: SettingsPanelProps) {
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
      </CardContent>
    </Card>
  );
}
