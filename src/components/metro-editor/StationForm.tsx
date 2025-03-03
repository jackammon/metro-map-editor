"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMetro } from '@/lib/context/metro-context';
import { Station, Line } from '@/lib/types/metro-types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const stationSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.string().min(1, 'Name is required'),
  zone: z.coerce.number().int().min(1, 'Zone must be at least 1'),
});

type StationFormValues = z.infer<typeof stationSchema>;

interface StationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<Station>;
  position?: { x: number; y: number };
  isEditing?: boolean;
}

export const StationForm: React.FC<StationFormProps> = ({
  open,
  onOpenChange,
  initialValues,
  position,
  isEditing = false,
}) => {
  const { addStation, updateStation, lines, updateLine } = useMetro();

  const form = useForm<StationFormValues>({
    resolver: zodResolver(stationSchema),
    defaultValues: {
      id: initialValues?.id || '',
      name: initialValues?.name || '',
      zone: initialValues?.zone || 1,
    },
  });

  // Get the lines this station is on
  const stationLines = isEditing && initialValues?.lines
    ? lines.filter(line => initialValues.lines?.includes(line.id))
    : [];

  const onSubmit = (values: StationFormValues) => {
    if (isEditing && initialValues?.id) {
      // Update existing station
      updateStation({
        ...initialValues,
        id: values.id,
        name: values.name,
        zone: values.zone,
      });
    } else if (position) {
      // Add new station
      addStation({
        id: values.id,
        name: values.name,
        x: position.x,
        y: position.y,
        zone: values.zone,
        isInterchange: false,
        connections: [],
        lines: [],
      });
    }
    
    onOpenChange(false);
  };

  const handleRemoveLine = (lineId: string) => {
    if (isEditing && initialValues?.id) {
      // Get the line
      const line = lines.find(l => l.id === lineId);
      if (line) {
        // Update the line to remove this station
        const updatedStations = line.stations.filter(id => id !== initialValues.id);
        updateLine({
          ...line,
          stations: updatedStations
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Station' : 'Add New Station'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Station ID</FormLabel>
                  <FormControl>
                    <Input placeholder="station1" {...field} />
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
                  <FormLabel>Station Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Central Station" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="zone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zone</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {position && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormLabel>X Position</FormLabel>
                  <Input type="number" value={position.x} disabled />
                </div>
                <div>
                  <FormLabel>Y Position</FormLabel>
                  <Input type="number" value={position.y} disabled />
                </div>
              </div>
            )}
            
            {isEditing && initialValues?.lines && (
              <div className="space-y-2">
                <FormLabel>Lines</FormLabel>
                {stationLines.length === 0 ? (
                  <div className="text-sm text-muted-foreground">This station is not on any lines</div>
                ) : (
                  <div className="border rounded-md p-2 space-y-1 max-h-40 overflow-y-auto">
                    {stationLines.map(line => (
                      <div 
                        key={line.id} 
                        className="flex justify-between items-center text-sm p-1 rounded"
                        style={{ backgroundColor: `${line.color}20` }}
                      >
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: line.color }}
                          ></div>
                          <span>{line.name}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleRemoveLine(line.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <DialogFooter>
              <Button type="submit">{isEditing ? 'Update' : 'Add'} Station</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}; 