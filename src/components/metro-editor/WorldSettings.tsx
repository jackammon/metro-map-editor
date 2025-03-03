"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useMetro } from '@/lib/context/metro-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

export const WorldSettings: React.FC = () => {
  const { worldSettings, updateWorldSettings } = useMetro();
  const [width, setWidth] = useState(worldSettings.width);
  const [height, setHeight] = useState(worldSettings.height);
  const [inputWidth, setInputWidth] = useState(worldSettings.width.toString());
  const [inputHeight, setInputHeight] = useState(worldSettings.height.toString());
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with worldSettings when they change (e.g., after loading from localStorage)
  useEffect(() => {
    setWidth(worldSettings.width);
    setInputWidth(worldSettings.width.toString());
  }, [worldSettings.width]);

  useEffect(() => {
    setHeight(worldSettings.height);
    setInputHeight(worldSettings.height.toString());
  }, [worldSettings.height]);

  // Update input fields when slider values change
  useEffect(() => {
    setInputWidth(width.toString());
  }, [width]);

  useEffect(() => {
    setInputHeight(height.toString());
  }, [height]);

  const handleWidthChange = (value: number[]) => {
    setWidth(value[0]);
  };

  const handleHeightChange = (value: number[]) => {
    setHeight(value[0]);
  };

  const handleInputWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputWidth(e.target.value);
    const parsedValue = parseInt(e.target.value);
    if (!isNaN(parsedValue) && parsedValue >= 500 && parsedValue <= 20000) {
      setWidth(parsedValue);
    }
  };

  const handleInputHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputHeight(e.target.value);
    const parsedValue = parseInt(e.target.value);
    if (!isNaN(parsedValue) && parsedValue >= 500 && parsedValue <= 20000) {
      setHeight(parsedValue);
    }
  };

  const handleInputWidthBlur = () => {
    const parsedValue = parseInt(inputWidth);
    if (isNaN(parsedValue) || parsedValue < 500 || parsedValue > 20000) {
      setInputWidth(width.toString());
    }
  };

  const handleInputHeightBlur = () => {
    const parsedValue = parseInt(inputHeight);
    if (isNaN(parsedValue) || parsedValue < 500 || parsedValue > 20000) {
      setInputHeight(height.toString());
    }
  };

  const handleApplyDimensions = () => {
    updateWorldSettings({ width, height });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const backgroundImage = event.target?.result as string;
      updateWorldSettings({ backgroundImage });
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    updateWorldSettings({ backgroundImage: null });
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
          <div className="space-y-2">
            <Label htmlFor="width">Width (px)</Label>
            <div className="flex items-center space-x-2">
              <Slider
                id="width-slider"
                min={500}
                max={20000}
                step={10}
                value={[width]}
                onValueChange={handleWidthChange}
                className="flex-1"
              />
              <Input
                id="width-input"
                type="number"
                min={500}
                max={20000}
                value={inputWidth}
                onChange={handleInputWidthChange}
                onBlur={handleInputWidthBlur}
                className="w-20"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="height">Height (px)</Label>
            <div className="flex items-center space-x-2">
              <Slider
                id="height-slider"
                min={500}
                max={20000}
                step={10}
                value={[height]}
                onValueChange={handleHeightChange}
                className="flex-1"
              />
              <Input
                id="height-input"
                type="number"
                min={500}
                max={20000}
                value={inputHeight}
                onChange={handleInputHeightChange}
                onBlur={handleInputHeightBlur}
                className="w-20"
              />
            </div>
          </div>
          
          <Button onClick={handleApplyDimensions} className="w-full">
            Apply Dimensions
          </Button>
          
          <div className="space-y-2 pt-4">
            <Label htmlFor="backgroundImage">Background Image</Label>
            <Input
              ref={fileInputRef}
              id="backgroundImage"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
            
            {worldSettings.backgroundImage && (
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