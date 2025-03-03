"use client";

import React, { useState } from 'react';
import { useMetro } from '@/lib/context/metro-context';
import { exportMetroMapData } from '@/lib/utils/export-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const ExportPanel: React.FC = () => {
  const { getMetroMapData, stations, lines, resetToDefault } = useMetro();
  const [showResetDialog, setShowResetDialog] = useState(false);

  const handleExport = () => {
    const data = getMetroMapData();
    exportMetroMapData(data);
  };

  const handleResetData = () => {
    resetToDefault();
    setShowResetDialog(false);
  };

  const isExportDisabled = stations.length === 0;
  const hasData = stations.length > 0 || lines.length > 0;

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm">
              <p>Export your metro map data to CSV format for use in your Phaser game.</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Stations: {stations.length}</li>
                <li>Lines: {lines.length}</li>
              </ul>
              <p className="mt-2 text-xs text-muted-foreground">
                Your data is automatically saved in your browser&apos;s local storage.
              </p>
            </div>
            
            <Button
              onClick={handleExport}
              className="w-full"
              disabled={isExportDisabled}
            >
              Export to CSV
            </Button>
            
            {isExportDisabled && (
              <p className="text-sm text-muted-foreground">
                Add at least one station before exporting.
              </p>
            )}
            
            <Button
              variant="destructive"
              onClick={() => setShowResetDialog(true)}
              className="w-full"
              disabled={!hasData}
            >
              Reset All Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reset confirmation dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset All Data</DialogTitle>
            <DialogDescription>
              This will delete all stations, lines, and settings. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button variant="outline" onClick={() => setShowResetDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleResetData}>
              Reset All Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}; 