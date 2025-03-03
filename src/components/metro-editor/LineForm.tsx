"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMetro } from '@/lib/context/metro-context';
import { Line } from '@/lib/types/metro-types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Unlink } from 'lucide-react';

// Create schema validation with custom ID validation
const createLineSchema = (existingLines: Line[], currentId?: string) => {
  return z.object({
    id: z.string().min(1, 'ID is required')
      .refine(
        (val) => !existingLines.some(line => line.id === val && line.id !== currentId), 
        { message: 'Line ID must be unique' }
      ),
    name: z.string().min(1, 'Name is required'),
    color: z.string().min(1, 'Color is required'),
  });
};

type LineFormValues = z.infer<ReturnType<typeof createLineSchema>>;

interface LineFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<Line>;
  isEditing?: boolean;
}

export const LineForm: React.FC<LineFormProps> = ({
  open,
  onOpenChange,
  initialValues,
  isEditing = false,
}) => {
  const { addLine, updateLine, stations, lines, connectStations, updateStation } = useMetro();
  const [color, setColor] = useState(initialValues?.color || '#FF0000');

  // Create a dynamic schema that has access to the current lines
  const lineSchema = createLineSchema(lines, initialValues?.id);

  const form = useForm<LineFormValues>({
    resolver: zodResolver(lineSchema),
    defaultValues: {
      id: initialValues?.id || '',
      name: initialValues?.name || '',
      color: initialValues?.color || '#FF0000',
    },
  });

  // Auto-fill the ID field with the next available index + 1 when opening the form
  useEffect(() => {
    if (!isEditing && open) {
      const nextId = (lines.length + 1).toString();
      form.setValue('id', nextId);
    }
  }, [open, isEditing, lines.length, form]);

  // Get the stations on this line
  const lineStations = isEditing && initialValues?.stations 
    ? stations.filter(station => initialValues.stations?.includes(station.id))
    : [];

  // Get pairs of directly connected stations on this line
  const getConnectedStationPairs = () => {
    if (!isEditing || !initialValues?.stations) return [];
    
    const pairs: { station1Id: string; station2Id: string; station1: string; station2: string; isBidirectional: boolean }[] = [];
    const processedPairs = new Set<string>();
    
    // For each station on this line
    lineStations.forEach(station => {
      // Check each of its connections
      station.connections.forEach(connectedId => {
        // Only consider connections where both stations are on this line
        if (initialValues.stations?.includes(connectedId)) {
          // Create a unique key for this connection (sorted to avoid duplicates)
          const stationIds = [station.id, connectedId].sort();
          const pairKey = `${stationIds[0]}-${stationIds[1]}`;
          
          // Only add if not already processed
          if (!processedPairs.has(pairKey)) {
            processedPairs.add(pairKey);
            
            // Find the names of the stations
            const connectedStation = stations.find(s => s.id === connectedId);
            if (connectedStation) {
              // Check if this is a valid bidirectional connection
              const isBidirectional = connectedStation.connections.includes(station.id);
              
              pairs.push({
                station1Id: station.id,
                station2Id: connectedStation.id,
                station1: station.name,
                station2: connectedStation.name,
                isBidirectional
              });
            }
          }
        }
      });
    });
    
    return pairs;
  };

  const connectedPairs = getConnectedStationPairs();
  const hasInvalidConnections = connectedPairs.some(pair => !pair.isBidirectional);

  // Function to fix all connection inconsistencies
  const handleFixAllConnections = () => {
    if (!isEditing || !initialValues?.id) return;
    
    connectedPairs.forEach(pair => {
      const { station1Id, station2Id, isBidirectional } = pair;
      
      if (!isBidirectional) {
        // Get both stations
        const station1 = stations.find(s => s.id === station1Id);
        const station2 = stations.find(s => s.id === station2Id);
        
        if (station1 && station2) {
          // Ensure both stations connect to each other
          if (!station1.connections.includes(station2Id)) {
            updateStation({
              ...station1,
              connections: [...station1.connections, station2Id]
            });
          }
          
          if (!station2.connections.includes(station1Id)) {
            updateStation({
              ...station2,
              connections: [...station2.connections, station1Id]
            });
          }
        }
      }
    });
  };

  // Function to disconnect two stations
  const handleDisconnectStations = (station1Id: string, station2Id: string) => {
    if (!isEditing || !initialValues?.id) return;
    
    // Find the stations
    const station1 = stations.find(s => s.id === station1Id);
    const station2 = stations.find(s => s.id === station2Id);
    
    if (station1 && station2) {
      // Create updated stations with connections removed
      const updatedStation1 = {
        ...station1,
        connections: station1.connections.filter(id => id !== station2Id)
      };
      
      const updatedStation2 = {
        ...station2,
        connections: station2.connections.filter(id => id !== station1Id)
      };
      
      // Update the stations (remove connections between them)
      updateStation(updatedStation1);
      updateStation(updatedStation2);
    }
  };

  const onSubmit = (values: LineFormValues) => {
    if (isEditing && initialValues?.id) {
      // Find the existing line to get all its properties
      const existingLine = lines.find(line => line.id === initialValues.id);
      if (existingLine) {
        // Create a new line object with all required properties
        const updatedLine: Line = {
          id: values.id,
          name: values.name,
          color: values.color,
          stations: existingLine.stations
        };
        updateLine(updatedLine);
      }
    } else {
      // Add new line with required properties
      const newLine: Line = {
        id: values.id,
        name: values.name,
        color: values.color,
        stations: []
      };
      addLine(newLine);
    }
    
    onOpenChange(false);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
    form.setValue('color', e.target.value);
  };

  const handleRemoveStation = (stationId: string) => {
    if (isEditing && initialValues?.id) {
      const updatedStations = initialValues.stations?.filter(id => id !== stationId) || [];
      updateLine({
        id: initialValues.id,
        name: initialValues.name || '',
        color: initialValues.color || '',
        stations: updatedStations
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Line' : 'Add New Line'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Line ID</FormLabel>
                  <FormControl>
                    <Input placeholder="line1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Line Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Red Line" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Line Color</FormLabel>
                  <div className="flex space-x-2">
                    <Input
                      type="color"
                      className="w-12 h-10 p-1"
                      value={color}
                      onChange={handleColorChange}
                    />
                    <FormControl>
                      <Input {...field} value={color} onChange={handleColorChange} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {isEditing && initialValues?.stations && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <FormLabel>Stations on this Line</FormLabel>
                  {lineStations.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No stations on this line</div>
                  ) : (
                    <div className="border rounded-md p-2 space-y-1 max-h-40 overflow-y-auto">
                      {lineStations.map(station => (
                        <div key={station.id} className="flex justify-between items-center text-sm p-1 bg-secondary/30 rounded">
                          <span>{station.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleRemoveStation(station.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Add section to display connected station pairs */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <FormLabel>Directly Connected Stations</FormLabel>
                    {hasInvalidConnections && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleFixAllConnections}
                        className="text-xs"
                      >
                        Fix Connection Issues
                      </Button>
                    )}
                  </div>
                  
                  {hasInvalidConnections && (
                    <div className="text-sm text-destructive bg-destructive/10 p-2 rounded-md mb-2">
                      Warning: Some connections may be invalid (one-way only).
                      This can cause rendering issues with lines appearing where no connection exists.
                    </div>
                  )}
                  
                  {connectedPairs.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No connected stations on this line</div>
                  ) : (
                    <div className="border rounded-md p-2 space-y-1 max-h-60 overflow-y-auto">
                      {connectedPairs.map((pair, index) => (
                        <div key={index} className={`flex justify-between items-center text-sm p-1 rounded ${pair.isBidirectional ? 'bg-primary/10' : 'bg-destructive/20'}`}>
                          <span>{pair.station1} ↔ {pair.station2} {!pair.isBidirectional && '⚠️'}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleDisconnectStations(pair.station1Id, pair.station2Id)}
                            title="Disconnect these stations"
                          >
                            <Unlink className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button type="submit">{isEditing ? 'Update' : 'Add'} Line</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}; 