"use client";

import React from 'react';
import { MetroProvider } from '@/lib/context/metro-context';
import { WorldSettings } from '@/components/metro-editor/WorldSettings';
import { StationsList } from '@/components/metro-editor/StationsList';
import { LinesList } from '@/components/metro-editor/LinesList';
import { KonvaCanvas } from '@/components/metro-editor/KonvaCanvas';
import { ExportPanel } from '@/components/metro-editor/ExportPanel';

export default function Home() {
  return (
    <MetroProvider>
      <div className="container mx-auto py-8 px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Metro Map Editor</h1>
          <p className="text-muted-foreground">
            Design your metro map for 2D games. Place stations, create lines, and export to CSV.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <WorldSettings />
            <ExportPanel />
          </div>

          {/* Main canvas */}
          <div className="lg:col-span-2">
            <KonvaCanvas />
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <StationsList />
            <LinesList />
          </div>
        </div>

        <footer className="mt-8 text-center text-sm text-muted-foreground">
          <p>jck.codes</p>
        </footer>
      </div>
    </MetroProvider>
  );
}
