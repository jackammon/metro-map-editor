"use client";

import React from 'react';
import { useMapEditor } from '@/lib/context/map-editor-context';
import { mapCollection } from '@/data/maps';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      <Card>
        <CardHeader>
          <CardTitle>Loading Map...</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please wait while the map data is being loaded.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Map Loader</CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}; 