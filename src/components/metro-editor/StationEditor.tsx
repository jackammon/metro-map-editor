"use client";

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMapEditor } from '@/lib/context/map-editor-context';
import { EnhancedStation, StationType, TrainSpeedType } from '@/lib/types/metro-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';

const stationSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required"),
  type: z.nativeEnum(StationType),
  importance: z.number().min(0).max(100),
  platforms: z.coerce.number().int().min(1),
  services: z.array(z.nativeEnum(TrainSpeedType)).min(1, "At least one service type is required"),
});

type StationFormValues = z.infer<typeof stationSchema>;

export const StationEditor: React.FC = () => {
  const { selectedStationIds, getStationById, updateStation, clearSelection } = useMapEditor();
  const isVisible = selectedStationIds.length === 1;
  const station = isVisible ? getStationById(selectedStationIds[0]) : null;

  const form = useForm<StationFormValues>({
    resolver: zodResolver(stationSchema),
  });

  useEffect(() => {
    if (station) {
      form.reset({
        id: station.id,
        name: station.name,
        type: station.type,
        importance: station.importance,
        platforms: station.platforms,
        services: station.services,
      });
    }
  }, [station, form]);

  const onSubmit = (data: StationFormValues) => {
    if (!station) return;
    updateStation(station.id, data);
  };

  if (!isVisible || !station) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Station Editor</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Select a single station to edit its properties.</p>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle>Edit Station</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => clearSelection()}>Close</Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="station-id">ID</Label>
            <Input id="station-id" {...form.register('id')} />
            {form.formState.errors.id && <p className="text-red-500 text-xs mt-1">{form.formState.errors.id.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="station-name">Name</Label>
            <Input id="station-name" {...form.register('name')} />
            {form.formState.errors.name && <p className="text-red-500 text-xs mt-1">{form.formState.errors.name.message}</p>}
          </div>
          
          <Controller
            name="type"
            control={form.control}
            render={({ field }) => (
              <div>
                <Label>Type</Label>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.values(StationType).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
          />
          
          <Controller
            name="importance"
            control={form.control}
            render={({ field }) => (
                <div>
                    <Label>Importance: {field.value}</Label>
                    <Slider
                        min={0} max={100} step={1}
                        defaultValue={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                    />
                </div>
            )}
          />

          <div>
            <Label htmlFor="platforms">Platforms</Label>
            <Input id="platforms" type="number" {...form.register('platforms')} />
            {form.formState.errors.platforms && <p className="text-red-500 text-xs mt-1">{form.formState.errors.platforms.message}</p>}
          </div>

          <div>
            <Label>Services</Label>
            <div className="flex flex-wrap gap-4 mt-2">
              {Object.values(TrainSpeedType).map(service => (
                <div key={service} className="flex items-center space-x-2">
                  <Controller
                    name="services"
                    control={form.control}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value?.includes(service)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value, service])
                            : field.onChange(field.value?.filter(s => s !== service));
                        }}
                      />
                    )}
                  />
                  <label className="text-sm">{service}</label>
                </div>
              ))}
            </div>
             {form.formState.errors.services && <p className="text-red-500 text-xs mt-1">{form.formState.errors.services.message}</p>}
          </div>

          <Button type="submit" className="w-full">Save Changes</Button>
        </form>
      </CardContent>
    </Card>
  );
}; 