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
  distanceKm: z.coerce.number().min(0),
  speedType: z.nativeEnum(TrainSpeedType),
  bidirectional: z.boolean(),
  direction: z.nativeEnum(TrackDirection),
  condition: z.nativeEnum(TrackCondition),
  powerType: z.nativeEnum(PowerType),
  scenicValue: z.number().min(0).max(100),
});

type TrackFormValues = z.infer<typeof trackSchema>;

export const TrackEditor: React.FC = () => {
  const { selectedTrackIds, getTrackById, updateTrack, clearSelection } = useMapEditor();
  const isVisible = selectedTrackIds.length === 1;
  const track = isVisible ? getTrackById(selectedTrackIds[0]) : null;

  const form = useForm<TrackFormValues>({
    resolver: zodResolver(trackSchema),
  });

  useEffect(() => {
    if (track) {
      form.reset({
        id: track.id,
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
    if (!track) return;
    updateTrack(track.id, data);
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
        <p className="text-sm text-muted-foreground">From: {track.source} To: {track.target}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="track-id">ID</Label>
            <Input id="track-id" {...form.register('id')} />
            {form.formState.errors.id && <p className="text-red-500 text-xs mt-1">{form.formState.errors.id.message}</p>}
          </div>
          
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

          <Button type="submit" className="w-full">Save Changes</Button>
        </form>
      </CardContent>
    </Card>
  );
}; 