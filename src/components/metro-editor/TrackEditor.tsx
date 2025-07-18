"use client";

import React, { useEffect, useRef } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMapEditor } from '@/lib/context/map-editor-context';
import { TrainSpeedType, TrackDirection, TrackCondition, PowerType } from '@/lib/types/metro-types';
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
  points: z.array(z.object({ x: z.number(), y: z.number() })).optional(),
  electrified: z.boolean().optional(),
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
        points: track.points || [],
        electrified: track.electrified || false,
      });
    }
  }, [track, form]);

  const { fields, remove } = useFieldArray({
    control: form.control,
    name: 'points',
  });

  const formValues = form.watch();
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!track || !gameMap) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      const data = form.getValues();
      const sourceChanged = data.source !== track.source;
      const targetChanged = data.target !== track.target;

      const sourceStation = gameMap.railNetwork.stations.find(s => s.id === data.source);
      const targetStation = gameMap.railNetwork.stations.find(s => s.id === data.target);
      if (!sourceStation || !targetStation) return;

      let finalPoints = data.points || [];
      if (finalPoints.length === 0) {
        finalPoints = [sourceStation.coordinates, targetStation.coordinates];
      } else {
        finalPoints[0] = sourceStation.coordinates;
        finalPoints[finalPoints.length - 1] = targetStation.coordinates;
      }

      let newDistance = 0;
      for (let i = 0; i < finalPoints.length - 1; i++) {
        const p1 = finalPoints[i];
        const p2 = finalPoints[i + 1];
        newDistance += Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)) / 50;
      }
      newDistance = parseFloat(newDistance.toFixed(1));

      if (sourceChanged || targetChanged) {
        // Removed existingTrack check to allow multiple tracks between same stations
        const newTrackData = { ...track, ...data, id: `${data.source}-${data.target}-${Date.now()}`, distanceKm: newDistance, points: finalPoints };
        deleteTrack(track.id);
        addTrack(newTrackData);
      } else {
        updateTrack(track.id, { ...data, distanceKm: newDistance, points: finalPoints });
      }
    }, 500);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [formValues, track, gameMap, updateTrack, deleteTrack, addTrack, form]);

  const handleDelete = () => {
    if (!track) return;
    if (window.confirm(`Are you sure you want to delete the track between ${track.source} and ${track.target}?`)) {
      deleteTrack(track.id);
    }
  };

  if (!isVisible || !track) {
    return (
      <div>
        <p className="text-muted-foreground">Select a single track on the map to edit its properties.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Edit Track</h3>
          <Button variant="ghost" size="sm" onClick={() => clearSelection()}>Close</Button>
      </div>
      <div>
        <form className="space-y-4">
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

          <Controller name="electrified" control={form.control} render={({ field }) => (
            <div className="flex items-center space-x-2"><Checkbox checked={field.value} onCheckedChange={field.onChange} /><Label>Electrified</Label></div>
          )}/>

          <div>
            <Label>Intermediate Track Points</Label>
            {fields.slice(1, fields.length - 1).map((field, index) => (
              <div key={field.id} className="flex space-x-2 mb-2 items-center">
                <span>Point {index + 1}: ({field.x.toFixed(1)}, {field.y.toFixed(1)})</span>
                <Button type="button" variant="outline" onClick={() => {
                  const actualIndex = index + 1; // Since slicing
                  remove(actualIndex);
                  // Recalculate distance and update immediately
                  const currentValues = form.getValues();
                  let newDistance = 0;
                  const updatedPoints = currentValues.points || [];
                  for (let i = 0; i < updatedPoints.length - 1; i++) {
                    const p1 = updatedPoints[i];
                    const p2 = updatedPoints[i + 1];
                    newDistance += Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)) / 50;
                  }
                  newDistance = parseFloat(newDistance.toFixed(1));
                  updateTrack(track.id, { points: updatedPoints, distanceKm: newDistance });
                }}>Delete</Button>
              </div>
            ))}
            <p className="text-sm text-muted-foreground">Add points by Command/Ctrl-clicking on the track in the canvas.</p>
          </div>

          <div className="flex gap-2">
            <span className="flex-1 text-green-600">Changes auto-saved</span>
            <Button type="button" variant="destructive" onClick={handleDelete}>Delete Track</Button>
          </div>
        </form>
      </div>
    </div>
  );
}; 