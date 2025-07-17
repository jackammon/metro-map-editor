"use client";

import React from 'react';
import { useMapEditor } from '@/lib/context/map-editor-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const StationsList: React.FC = () => {
  const { gameMap, selectStation, selectedStationIds, deleteStation } = useMapEditor();

  const handleStationClick = (e: React.MouseEvent, stationId: string) => {
    const multiSelect = e.ctrlKey || e.metaKey;
    selectStation(stationId, multiSelect);
  };
  
  const handleDelete = (e: React.MouseEvent, stationId: string) => {
    e.stopPropagation(); // Prevent the click from selecting the station
    if (window.confirm('Are you sure you want to delete this station and all its connected tracks?')) {
        deleteStation(stationId);
    }
  }

  if (!gameMap) return null;

  const { stations } = gameMap.railNetwork;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Stations</CardTitle>
        <div className="text-sm text-muted-foreground">
          {stations.length} total
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          {stations.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              No stations yet. Click on the map to add one.
            </div>
          ) : (
            stations.map(station => (
              <div
                key={station.id}
                className={`p-3 border rounded-md cursor-pointer transition-all ${
                  selectedStationIds.includes(station.id)
                    ? 'bg-primary/10 border-primary shadow-md'
                    : 'hover:bg-muted/50'
                }`}
                onClick={(e) => handleStationClick(e, station.id)}
              >
                <div className="flex justify-between items-center">
                    <div>
                        <div className="font-bold">{station.name}</div>
                        <div className="text-xs text-muted-foreground">
                            ID: {station.id} | Type: {station.type}
                        </div>
                    </div>
                    <Button variant="destructive" size="sm" onClick={(e) => handleDelete(e, station.id)}>
                        Del
                    </Button>
                </div>

              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 