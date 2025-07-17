"use client";

import React, { useRef } from 'react';
import { useMapEditor } from '@/lib/context/map-editor-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export const BackgroundEditor: React.FC = () => {
  const { gameMap, updateBackground } = useMapEditor();
  const background = gameMap?.background;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          updateBackground({
            imageUrl,
            width: img.width,
            height: img.height,
            scale: 1,
            offset: { x: 0, y: 0 },
          });
        };
        img.src = imageUrl;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = () => {
    updateBackground(undefined);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };
  
  const handleSettingChange = (field: 'scale' | 'offsetX' | 'offsetY', value: string) => {
    if (!background) return;
    const numValue = parseFloat(value);
    if(isNaN(numValue)) return;
    
    const newBackground = { ...background };
    if(field === 'scale') newBackground.scale = numValue;
    if(field === 'offsetX') newBackground.offset = { ...newBackground.offset, x: numValue, y: newBackground.offset?.y || 0 };
    if(field === 'offsetY') newBackground.offset = { ...newBackground.offset, y: numValue, x: newBackground.offset?.x || 0 };
    
    updateBackground(newBackground);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Background Image</CardTitle>
        <CardDescription>Upload an image to use as a guide.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} />

        {background?.imageUrl && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Image loaded.</p>
                <Button variant="destructive" size="sm" onClick={handleClearImage}>Clear</Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="bg-scale">Scale</Label>
                    <Input id="bg-scale" type="number" step="0.1" value={background.scale || 1} onChange={e => handleSettingChange('scale', e.target.value)} />
                </div>
                <div>
                    <Label>Offset</Label>
                    <div className="flex gap-2">
                        <Input type="number" placeholder="X" value={background.offset?.x || 0} onChange={e => handleSettingChange('offsetX', e.target.value)} />
                        <Input type="number" placeholder="Y" value={background.offset?.y || 0} onChange={e => handleSettingChange('offsetY', e.target.value)} />
                    </div>
                </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 