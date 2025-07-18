"use client";

import React from 'react';
import { useMapEditor } from '@/lib/context/map-editor-context';
import { exportMapToJson } from '@/lib/utils/export-utils';
import { validateMap } from '@/lib/utils/validation-utils';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export const ExportPanel: React.FC = () => {
  const { gameMap } = useMapEditor();

  const handleExport = () => {
    if (gameMap) {
      exportMapToJson(gameMap);
    }
  };
  
  const validationErrors = gameMap ? validateMap(gameMap) : [];
  const hasErrors = validationErrors.some(e => e.severity === 'error');

  return (
    <div className="space-y-4">
      <Button onClick={handleExport} className="w-full" disabled={!gameMap || hasErrors}>
        Export to JSON
      </Button>
      {hasErrors && (
          <div className="flex items-center space-x-2 text-red-600 text-sm">
              <AlertTriangle className="h-4 w-4" />
              <p>Fix validation errors before exporting.</p>
          </div>
      )}
       {!gameMap && (
          <p className="text-sm text-muted-foreground">Load a map to export.</p>
      )}
    </div>
  );
}; 