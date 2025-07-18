"use client";

import React from 'react';
import { MapEditorProvider, useMapEditor } from '@/lib/context/map-editor-context';
import { KonvaCanvas } from '@/components/metro-editor/KonvaCanvas';
import { LeftSidePanel } from '@/components/metro-editor/LeftSidePanel';
import { RightSidePanel } from '@/components/metro-editor/RightSidePanel';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

const ResetCameraButton: React.FC = () => {
  const { resetCamera } = useMapEditor();
  return (
    <Button onClick={resetCamera} variant="outline" size="sm" className="flex items-center gap-2">
      <RotateCcw className="h-4 w-4" />
      Reset Camera
    </Button>
  );
};

export default function Home() {
  return (
    <MapEditorProvider>
      {/* Full-screen container */}
      <div className="fixed inset-0 bg-gray-50">
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b p-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Map Editor</h1>
              <p className="text-sm text-muted-foreground">
                Design your map for my game. Place stations, create lines, and export to a TS file.
              </p>
            </div>
            <ResetCameraButton />
          </div>
        </header>

        {/* Full-width Canvas */}
        <div className="absolute inset-0 pt-20"> {/* pt-20 to account for header */}
          <KonvaCanvas />
        </div>

        {/* Left Side Panel - Flush with left edge */}
        <LeftSidePanel defaultPosition={{ x: 0, y: 80 }} />

        {/* Right Side Panel - Flush with right edge */}
        <RightSidePanel defaultPosition={{ x: -360, y: 80 }} />

        {/* Footer */}
        <footer className="absolute bottom-4 right-4 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded">
          jck.codes
        </footer>
      </div>
    </MapEditorProvider>
  );
}
