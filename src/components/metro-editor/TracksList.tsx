"use client";

import React from 'react';
import { useMapEditor } from '@/lib/context/map-editor-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const TracksList: React.FC = () => {
  const { gameMap, selectTrack, selectedTrackIds, deleteTrack, getStationById } = useMapEditor();

  const handleTrackClick = (e: React.MouseEvent, trackId: string) => {
    const multiSelect = e.ctrlKey || e.metaKey;
    selectTrack(trackId, multiSelect);
  };
  
  const handleDelete = (e: React.MouseEvent, trackId: string) => {
    e.stopPropagation(); // Prevent the click from selecting the track
    const track = gameMap?.railNetwork.tracks.find(t => t.id === trackId);
    if (track && window.confirm(`Are you sure you want to delete the track between ${track.source} and ${track.target}?`)) {
        deleteTrack(trackId);
    }
  };

  const getStationName = (stationId: string): string => {
    const station = getStationById(stationId);
    return station ? station.name : stationId;
  };

  if (!gameMap) return null;

  const { tracks } = gameMap.railNetwork;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Tracks</CardTitle>
        <div className="text-sm text-muted-foreground">
          {tracks.length} total
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          {tracks.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              No tracks yet. Select two stations and press 'L' to create one.
            </div>
          ) : (
            tracks.map(track => (
              <div
                key={track.id}
                className={`p-3 border rounded-md cursor-pointer transition-all ${
                  selectedTrackIds.includes(track.id)
                    ? 'bg-primary/10 border-primary shadow-md'
                    : 'hover:bg-muted/50'
                }`}
                onClick={(e) => handleTrackClick(e, track.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium mb-1">
                      {getStationName(track.source)} → {getStationName(track.target)}
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {track.speedType}
                      </Badge>
                      <Badge variant={track.bidirectional ? "default" : "outline"} className="text-xs">
                        {track.bidirectional ? "Bidirectional" : "Unidirectional"}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {track.distanceKm} km
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ID: {track.id}
                      {track.points && track.points.length > 2 && (
                        <span className="ml-2">• {track.points.length - 2} intermediate points</span>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={(e) => handleDelete(e, track.id)}
                    className="ml-2"
                  >
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