"use client";

import React, { useRef } from 'react';
import { useMapEditor } from '@/lib/context/map-editor-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export const WorldSettings: React.FC = () => {
  const { gameMap, updateBackground } = useMapEditor();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
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
  };

  const handleClearImage = () => {
    updateBackground(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>World Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2 pt-4">
            <Label htmlFor="backgroundImage">Background Image</Label>
            <Input
              ref={fileInputRef}
              id="backgroundImage"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
            
            {gameMap?.background?.imageUrl && (
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-muted-foreground">Image loaded</span>
                <Button variant="destructive" size="sm" onClick={handleClearImage}>
                  Clear Image
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 