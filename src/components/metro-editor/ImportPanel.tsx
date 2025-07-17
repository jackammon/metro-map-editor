"use client";

import React, { useRef } from 'react';
import { useMapEditor } from '@/lib/context/map-editor-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GameMap } from '@/lib/types/metro-types';
import { validateMap } from '@/lib/utils/validation-utils';

export const ImportPanel: React.FC = () => {
  const { loadMap } = useMapEditor();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const mapObject = JSON.parse(content);
          
          // Use our validator to check the structure
          const validationErrors = validateMap(mapObject as GameMap);
          const hasFatalErrors = validationErrors.some(err => err.severity === 'error');

          if (!hasFatalErrors) {
            loadMap(mapObject as GameMap);
            alert("Map imported successfully!");
          } else {
            console.error("Import validation failed:", validationErrors);
            alert("Invalid map file format. See console for validation errors.");
          }
        } catch (error) {
          console.error("Error parsing map file:", error);
          alert("Failed to parse the JSON file. Please ensure it's a valid JSON format.");
        }
      };
      reader.readAsText(file);
    }
  };
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Map</CardTitle>
        <CardDescription>Load a .json map file from your computer.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleButtonClick} className="w-full">
          Import from JSON File
        </Button>
        <Input 
          type="file" 
          accept=".json" 
          onChange={handleFileChange} 
          ref={fileInputRef}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
}; 