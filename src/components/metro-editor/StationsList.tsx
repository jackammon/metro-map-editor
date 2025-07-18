"use client";

import React from 'react';
import { useMapEditor } from '@/lib/context/map-editor-context';
import { Button } from '@/components/ui/button';

export const StationsList: React.FC = () => {
  const { gameMap, selectStation, selectedStationIds, deleteStation, clearSelection } = useMapEditor();
  
  const stations = gameMap?.railNetwork.stations || [];

  const handleStationClick = (e: React.MouseEvent, stationId: string) => {
    e.stopPropagation();
    if (e.ctrlKey || e.metaKey) {
      // Multi-select with Ctrl/Cmd
      selectStation(stationId, !selectedStationIds.includes(stationId));
    } else {
      clearSelection();
      selectStation(stationId, true);
    }
  };

  const handleDelete = (e: React.MouseEvent, stationId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this station?')) {
      deleteStation(stationId);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold">Stations</h3>
        <div className="text-sm text-muted-foreground">
          {stations.length} total
        </div>
      </div>
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
    </div>
  );
}; 