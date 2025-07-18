"use client";

import React, { useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMapEditor } from '@/lib/context/map-editor-context';
import { StationType, TrainSpeedType } from '@/lib/types/metro-types';
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
  const { gameMap, selectedStationIds, getStationById, updateStation, clearSelection } = useMapEditor();
  const isVisible = selectedStationIds.length === 1;
  const station = isVisible ? getStationById(selectedStationIds[0]) : null;

  // Get tracks connected to this station
  const getConnectedTracks = (stationId: string) => {
    if (!gameMap) return [];
    return gameMap.railNetwork.tracks.filter(track => 
      track.source === stationId || track.target === stationId
    );
  };

  // Get service types from connected tracks
  const getAutoDetectedServices = (stationId: string): TrainSpeedType[] => {
    const connectedTracks = getConnectedTracks(stationId);
    const serviceTypes = new Set(connectedTracks.map(track => track.speedType));
    return Array.from(serviceTypes);
  };

  // Calculate platform count based on directional services for timetable gameplay
  const getRequiredPlatformCount = (stationId: string): number => {
    const connectedTracks = getConnectedTracks(stationId);
    if (connectedTracks.length === 0) return 1;
    
    // Game logic: Each track direction needs its own platform for timetable reading
    // - Bidirectional track = 2 platforms (one for each direction)
    // - Unidirectional track = 1 platform
    // - Players need to find the right platform for their train's direction
    
    let totalPlatforms = 0;
    connectedTracks.forEach(track => {
      if (track.bidirectional) {
        totalPlatforms += 2; // Platform for each direction
      } else {
        totalPlatforms += 1; // Platform for single direction
      }
    });
    
    return Math.max(1, totalPlatforms); // Minimum 1 platform
  };

  // Calculate station type based on platform count for gameplay scaling
  const getRequiredStationType = (platformCount: number): StationType => {
    if (platformCount <= 2) return StationType.SMALL;    // Simple stops
    if (platformCount < 8) return StationType.MEDIUM;    // Interchanges
    return StationType.LARGE;                            // Major hubs
  };

  const connectedTracks = station ? getConnectedTracks(station.id) : [];
  const autoDetectedServices = station ? getAutoDetectedServices(station.id) : [];
  const requiredPlatforms = station ? getRequiredPlatformCount(station.id) : 1;
  const requiredStationType = getRequiredStationType(requiredPlatforms);

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

  // Auto-sync services, platforms, and station type with connected tracks when tracks change
  useEffect(() => {
    if (station && gameMap) {
      const currentAutoServices = getAutoDetectedServices(station.id);
      const currentRequiredPlatforms = getRequiredPlatformCount(station.id);
      const currentRequiredType = getRequiredStationType(currentRequiredPlatforms);
      
      // Auto-update services if there are connected tracks and they differ
      if (currentAutoServices.length > 0) {
        const currentServices = form.getValues('services') || [];
        const shouldUpdateServices = currentAutoServices.some(service => !currentServices.includes(service)) ||
                           currentServices.some(service => !currentAutoServices.includes(service));
        
        if (shouldUpdateServices) {
          form.setValue('services', currentAutoServices);
        }
      }

      // Auto-sync platforms to match required count for timetable gameplay
      const currentPlatforms = form.getValues('platforms') || 1;
      if (currentRequiredPlatforms !== currentPlatforms) {
        form.setValue('platforms', currentRequiredPlatforms);
      }

      // Auto-sync station type based on platform count
      const currentType = form.getValues('type');
      if (currentRequiredType !== currentType) {
        form.setValue('type', currentRequiredType);
      }
    }
  }, [gameMap?.railNetwork.tracks, station, form, getAutoDetectedServices, getRequiredPlatformCount, getRequiredStationType]);

  const formValues = form.watch();
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!station) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      const data = form.getValues();
      updateStation(station.id, data);
    }, 500);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [formValues, station, updateStation, form]);

  if (!isVisible || !station) {
    return (
      <div>
        <p className="text-muted-foreground">Select a single station to edit its properties.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Edit Station</h3>
          <Button variant="ghost" size="sm" onClick={() => clearSelection()}>Close</Button>
      </div>
      <div>
        <form className="space-y-4">
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
          
          <div>
            <Label>Station Type (Auto-synced)</Label>
            <Controller
              name="type"
              control={form.control}
              render={({ field }) => (
                <Select value={requiredStationType} onValueChange={field.onChange} disabled>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.values(StationType).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            />
            <div className="mt-2 p-3 bg-purple-50 rounded-md">
              <p className="text-sm font-medium text-purple-800 mb-1">Type Logic:</p>
              <div className="space-y-1 text-xs text-purple-700">
                <div className={`flex justify-between ${requiredPlatforms <= 2 ? 'font-medium' : ''}`}>
                  <span>Small:</span>
                  <span>≤ 2 platforms (simple stops)</span>
                </div>
                <div className={`flex justify-between ${requiredPlatforms > 2 && requiredPlatforms < 8 ? 'font-medium' : ''}`}>
                  <span>Medium:</span>
                  <span>3-7 platforms (interchanges)</span>
                </div>
                <div className={`flex justify-between ${requiredPlatforms >= 8 ? 'font-medium' : ''}`}>
                  <span>Large:</span>
                  <span>≥ 8 platforms (major hubs)</span>
                </div>
                <div className="border-t border-purple-200 pt-1 mt-2">
                  <div className="flex justify-between font-medium text-purple-800">
                    <span>Current ({requiredPlatforms} platforms):</span>
                    <span className="capitalize">{requiredStationType}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
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
            <Label htmlFor="platforms">Platforms (Auto-synced)</Label>
            <Input id="platforms" type="number" {...form.register('platforms')} readOnly />
            <div className="mt-2 p-3 bg-green-50 rounded-md">
              <p className="text-sm font-medium text-green-800 mb-1">Platform Calculation:</p>
              <div className="space-y-1">
                {connectedTracks.map(track => (
                  <div key={track.id} className="text-xs text-green-700 flex justify-between">
                    <span>→ {track.source === station?.id ? track.target : track.source}</span>
                    <span>{track.bidirectional ? '2 platforms (bidirectional)' : '1 platform (unidirectional)'}</span>
                  </div>
                ))}
                <div className="border-t border-green-200 pt-1 mt-2">
                  <div className="text-xs font-medium text-green-800 flex justify-between">
                    <span>Total Required:</span>
                    <span>{requiredPlatforms} platform{requiredPlatforms !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              For timetable gameplay: Each direction needs its own platform
            </p>
            {form.formState.errors.platforms && <p className="text-red-500 text-xs mt-1">{form.formState.errors.platforms.message}</p>}
          </div>

          <div>
            <Label>Connected Tracks & Services</Label>
            
            {/* Connected tracks summary */}
            <div className="mt-2 p-3 bg-gray-50 rounded-md">
              <p className="text-sm font-medium mb-2">Connected Tracks: {connectedTracks.length}</p>
              {connectedTracks.length > 0 ? (
                <div className="space-y-1">
                  {connectedTracks.map(track => (
                    <div key={track.id} className="text-xs text-gray-600 flex justify-between">
                      <span>→ {track.source === station?.id ? track.target : track.source}</span>
                      <span className="font-medium">{track.speedType}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">No tracks connected</p>
              )}
            </div>

            {/* Auto-detected services */}
            {autoDetectedServices.length > 0 && (
              <div className="mt-3 p-3 bg-blue-50 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-blue-800">Auto-detected Services:</p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => form.setValue('services', autoDetectedServices)}
                    className="text-xs"
                  >
                    Sync Services
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {autoDetectedServices.map(service => (
                    <span key={service} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Manual service override */}
            <div className="mt-3">
              <Label className="text-sm">Manual Service Override:</Label>
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
                    <label className={`text-sm ${autoDetectedServices.includes(service) ? 'font-medium text-blue-600' : ''}`}>
                      {service}
                      {autoDetectedServices.includes(service) && <span className="ml-1 text-xs">(auto)</span>}
                    </label>
                  </div>
                ))}
              </div>
              {form.formState.errors.services && <p className="text-red-500 text-xs mt-1">{form.formState.errors.services.message}</p>}
            </div>
          </div>

          <span className="block text-center text-green-600">Changes auto-saved</span>
        </form>
      </div>
    </div>
  );
}; 