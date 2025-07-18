"use client";

import React from 'react';
import { useMapEditor } from '@/lib/context/map-editor-context';
import { Button } from '@/components/ui/button';

export const TracksList: React.FC = () => {
  const { gameMap, selectTrack, selectedTrackIds, deleteTrack, clearSelection } = useMapEditor();
  
  const tracks = gameMap?.railNetwork.tracks || [];

  const handleTrackClick = (e: React.MouseEvent, trackId: string) => {
    e.stopPropagation();
    if (e.ctrlKey || e.metaKey) {
      // Multi-select with Ctrl/Cmd
      selectTrack(trackId, !selectedTrackIds.includes(trackId));
    } else {
      clearSelection();
      selectTrack(trackId, true);
    }
  };

  const handleDelete = (e: React.MouseEvent, trackId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this track?')) {
      deleteTrack(trackId);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold">Tracks</h3>
        <div className="text-sm text-muted-foreground">
          {tracks.length} total
        </div>
      </div>
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
              <div className="flex justify-between items-center">
                  <div>
                      <div className="font-bold text-sm">{track.source} → {track.target}</div>
                      <div className="text-xs text-muted-foreground">
                          {track.speedType} | {track.distanceKm.toFixed(1)}km | {track.bidirectional ? 'Bidirectional' : track.direction}
                      </div>
                  </div>
                  <Button variant="destructive" size="sm" onClick={(e) => handleDelete(e, track.id)}>
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