"use client";

import React from 'react';
import { useMapEditor } from '@/lib/context/map-editor-context';
import { mapCollection } from '@/data/maps';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const MapSelector: React.FC = () => {
  const { gameMap, loadMap, createNewMap } = useMapEditor();

  const handleMapChange = (mapId: string) => {
    const selectedMap = mapCollection[mapId];
    if (selectedMap) {
      loadMap(selectedMap);
    }
  };

  if (!gameMap) {
    return (
      <div>
        <h3 className="font-semibold mb-2">Loading Map...</h3>
        <p className="text-sm text-muted-foreground">Please wait while the map data is being loaded.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="map-select" className="text-sm font-medium">
          Choose a map to edit
        </label>
        <Select onValueChange={handleMapChange} defaultValue={gameMap.id}>
          <SelectTrigger id="map-select">
            <SelectValue placeholder="Select a map" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(mapCollection).map(map => (
              <SelectItem key={map.id} value={map.id}>
                {map.metadata.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="text-center text-sm text-muted-foreground">OR</div>
      <Button onClick={createNewMap} className="w-full">
        Create New Map
      </Button>
    </div>
  );
}; 