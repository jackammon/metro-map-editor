"use client";

import React from 'react';
import { MapEditorProvider } from '@/lib/context/map-editor-context';
import { MapSelector } from '@/components/metro-editor/MapSelector';
import { MetadataEditor } from '@/components/metro-editor/MetadataEditor';
import { EditorSettingsPanel } from '@/components/metro-editor/EditorSettingsPanel';
import { BackgroundEditor } from '@/components/metro-editor/BackgroundEditor';
import { ValidationPanel } from '@/components/metro-editor/ValidationPanel';
import { ExportPanel } from '@/components/metro-editor/ExportPanel';
import { ImportPanel } from '@/components/metro-editor/ImportPanel';
import { StationsList } from '@/components/metro-editor/StationsList';
import { TracksList } from '@/components/metro-editor/TracksList';
import { StationEditor } from '@/components/metro-editor/StationEditor';
import { TrackEditor } from '@/components/metro-editor/TrackEditor';
import { KonvaCanvas } from '@/components/metro-editor/KonvaCanvas';

export default function Home() {
  return (
    <MapEditorProvider>
      <div className="container mx-auto py-8 px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Map Editor</h1>
          <p className="text-muted-foreground">
            Design your map for my game. Place stations, create lines, and export to a TS file.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <MapSelector />
            <MetadataEditor />
            <EditorSettingsPanel />
            <BackgroundEditor />
            <ValidationPanel />
            <ImportPanel />
            <ExportPanel />
          </div>

          {/* Main canvas */}
          <div className="lg:col-span-2">
            <KonvaCanvas />
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <StationsList />
            <TracksList />
            <StationEditor />
            <TrackEditor />
          </div>
        </div>

        <footer className="mt-8 text-center text-sm text-muted-foreground">
          <p>jck.codes</p>
        </footer>
      </div>
    </MapEditorProvider>
  );
}
