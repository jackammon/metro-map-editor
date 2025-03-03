"use client";

import React, { useState } from 'react';
import { useMetro } from '@/lib/context/metro-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StationForm } from './StationForm';

export const StationsList: React.FC = () => {
  const { stations, deleteStation, selectStation, selectedStationIds } = useMetro();
  const [editingStation, setEditingStation] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleEditStation = (stationId: string) => {
    setEditingStation(stationId);
    setIsFormOpen(true);
  };

  const handleDeleteStation = (stationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this station?')) {
      deleteStation(stationId);
    }
  };

  const handleStationClick = (stationId: string, e: React.MouseEvent) => {
    const multiSelect = e.ctrlKey || e.metaKey;
    selectStation(stationId, multiSelect);
  };

  const stationToEdit = stations.find(station => station.id === editingStation);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Stations</CardTitle>
        <div className="text-sm text-muted-foreground">
          {stations.length} stations
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {stations.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              No stations added yet. Click on the canvas to add stations.
            </div>
          ) : (
            stations.map(station => (
              <div
                key={station.id}
                className={`p-3 border rounded-md flex justify-between items-center cursor-pointer ${
                  selectedStationIds.includes(station.id) ? 'bg-primary/10 border-primary' : ''
                }`}
                onClick={(e) => handleStationClick(station.id, e)}
              >
                <div>
                  <div className="font-medium">{station.name}</div>
                  <div className="text-sm text-muted-foreground">
                    ID: {station.id} | Zone: {station.zone} | Pos: ({Math.round(station.x)}, {Math.round(station.y)})
                  </div>
                  {station.isInterchange && (
                    <div className="text-xs mt-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full inline-block">
                      Interchange
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditStation(station.id);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => handleDeleteStation(station.id, e)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>

      {stationToEdit && (
        <StationForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          initialValues={stationToEdit}
          isEditing={true}
        />
      )}
    </Card>
  );
}; 