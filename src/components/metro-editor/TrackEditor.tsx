"use client";

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMapEditor } from '@/lib/context/map-editor-context';
import { EnhancedTrack, TrainSpeedType, TrackDirection, TrackCondition, PowerType } from '@/lib/types/metro-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';

const trackSchema = z.object({
  id: z.string().min(1, "ID is required"),
  source: z.string().min(1, "Source station is required"),
  target: z.string().min(1, "Target station is required"),
  distanceKm: z.coerce.number().min(0),
  speedType: z.nativeEnum(TrainSpeedType),
  bidirectional: z.boolean(),
  direction: z.nativeEnum(TrackDirection),
  condition: z.nativeEnum(TrackCondition),
  powerType: z.nativeEnum(PowerType),
  scenicValue: z.number().min(0).max(100),
}).refine((data) => data.source !== data.target, {
  message: "Source and target stations must be different",
  path: ["target"],
});

type TrackFormValues = z.infer<typeof trackSchema>;

export const TrackEditor: React.FC = () => {
  const { gameMap, selectedTrackIds, getTrackById, updateTrack, deleteTrack, addTrack, clearSelection } = useMapEditor();
  const isVisible = selectedTrackIds.length === 1;
  const track = isVisible ? getTrackById(selectedTrackIds[0]) : null;
  const stations = gameMap?.railNetwork.stations || [];

  const form = useForm<TrackFormValues>({
    resolver: zodResolver(trackSchema),
  });

  useEffect(() => {
    if (track) {
      form.reset({
        id: track.id,
        source: track.source,
        target: track.target,
        distanceKm: track.distanceKm,
        speedType: track.speedType,
        bidirectional: track.bidirectional,
        direction: track.direction,
        condition: track.condition,
        powerType: track.powerType,
        scenicValue: track.scenicValue,
      });
    }
  }, [track, form]);

  const onSubmit = (data: TrackFormValues) => {
    if (!track || !gameMap) return;
    
    // Check if source/target changed and if a track with the new combination already exists
    const sourceChanged = data.source !== track.source;
    const targetChanged = data.target !== track.target;
    
    if (sourceChanged || targetChanged) {
      const existingTrack = gameMap.railNetwork.tracks.find(
        t => t.id !== track.id && (
          (t.source === data.source && t.target === data.target) ||
          (t.source === data.target && t.target === data.source)
        )
      );
      
      if (existingTrack) {
        alert(`A track already exists between ${data.source} and ${data.target}`);
        return;
      }
      
      // When source/target changes, delete the old track and create a new one
      // Calculate new distance based on station coordinates
      const sourceStation = gameMap.railNetwork.stations.find(s => s.id === data.source);
      const targetStation = gameMap.railNetwork.stations.find(s => s.id === data.target);
      let newDistance = data.distanceKm;
      
      if (sourceStation && targetStation) {
        const calculatedDistance = Math.sqrt(
          Math.pow(targetStation.coordinates.x - sourceStation.coordinates.x, 2) +
          Math.pow(targetStation.coordinates.y - sourceStation.coordinates.y, 2)
        ) / 50; // Convert pixels to km (assuming 50px = 1km)
        newDistance = parseFloat(calculatedDistance.toFixed(1));
      }
      
      const newTrack: EnhancedTrack = {
        ...track,
        ...data,
        id: `${data.source}-${data.target}`,
        distanceKm: newDistance,
      };
      
      deleteTrack(track.id);
      addTrack(newTrack);
    } else {
      // If only other properties changed, just update the track
      updateTrack(track.id, data);
    }
  };

  const handleDelete = () => {
    if (!track) return;
    if (window.confirm(`Are you sure you want to delete the track between ${track.source} and ${track.target}?`)) {
      deleteTrack(track.id);
    }
  };

  if (!isVisible || !track) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Track Editor</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Select a single track on the map to edit its properties.</p>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle>Edit Track</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => clearSelection()}>Close</Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="track-id">ID</Label>
            <Input id="track-id" {...form.register('id')} />
            {form.formState.errors.id && <p className="text-red-500 text-xs mt-1">{form.formState.errors.id.message}</p>}
          </div>

          <Controller name="source" control={form.control} render={({ field }) => (
            <div>
              <Label>Source Station</Label>
              <Select key={`source-${track?.id}`} onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger><SelectValue placeholder="Select source station" /></SelectTrigger>
                <SelectContent>
                  {stations.map(station => (
                    <SelectItem key={station.id} value={station.id}>
                      {station.name} ({station.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.source && <p className="text-red-500 text-xs mt-1">{form.formState.errors.source.message}</p>}
            </div>
          )}/>

          <Controller name="target" control={form.control} render={({ field }) => (
            <div>
              <Label>Target Station</Label>
              <Select key={`target-${track?.id}`} onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger><SelectValue placeholder="Select target station" /></SelectTrigger>
                <SelectContent>
                  {stations.map(station => (
                    <SelectItem key={station.id} value={station.id}>
                      {station.name} ({station.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.target && <p className="text-red-500 text-xs mt-1">{form.formState.errors.target.message}</p>}
            </div>
          )}/>
          
          <div>
            <Label htmlFor="distance">Distance (km)</Label>
            <Input id="distance" type="number" step="0.1" {...form.register('distanceKm')} />
            {form.formState.errors.distanceKm && <p className="text-red-500 text-xs mt-1">{form.formState.errors.distanceKm.message}</p>}
          </div>

          <Controller name="speedType" control={form.control} render={({ field }) => (
            <div><Label>Speed Type</Label><Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.values(TrainSpeedType).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
          )}/>
          
          <Controller name="direction" control={form.control} render={({ field }) => (
            <div><Label>Direction</Label><Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.values(TrackDirection).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
          )}/>
          
          <Controller name="condition" control={form.control} render={({ field }) => (
            <div><Label>Condition</Label><Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.values(TrackCondition).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
          )}/>
          
          <Controller name="powerType" control={form.control} render={({ field }) => (
            <div><Label>Power Type</Label><Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.values(PowerType).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
          )}/>

          <Controller name="bidirectional" control={form.control} render={({ field }) => (
            <div className="flex items-center space-x-2"><Checkbox checked={field.value} onCheckedChange={field.onChange} /><Label>Bidirectional</Label></div>
          )}/>
          
          <Controller name="scenicValue" control={form.control} render={({ field }) => (
            <div><Label>Scenic Value: {field.value}</Label><Slider min={0} max={100} step={1} defaultValue={[field.value]} onValueChange={(value) => field.onChange(value[0])}/></div>
          )}/>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">Save Changes</Button>
            <Button type="button" variant="destructive" onClick={handleDelete}>Delete Track</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}; 