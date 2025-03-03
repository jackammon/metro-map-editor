"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMetro } from '@/lib/context/metro-context';
import { Line, Station } from '@/lib/types/metro-types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const lineSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.string().min(1, 'Name is required'),
  color: z.string().min(1, 'Color is required'),
});

type LineFormValues = z.infer<typeof lineSchema>;

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
  const { addLine, updateLine, stations } = useMetro();
  const [color, setColor] = useState(initialValues?.color || '#FF0000');

  const form = useForm<LineFormValues>({
    resolver: zodResolver(lineSchema),
    defaultValues: {
      id: initialValues?.id || '',
      name: initialValues?.name || '',
      color: initialValues?.color || '#FF0000',
    },
  });

  // Get the stations on this line
  const lineStations = isEditing && initialValues?.stations 
    ? stations.filter(station => initialValues.stations?.includes(station.id))
    : [];

  const onSubmit = (values: LineFormValues) => {
    if (isEditing && initialValues?.id) {
      // Update existing line
      updateLine({
        ...initialValues,
        id: values.id,
        name: values.name,
        color: values.color,
        stations: initialValues.stations || [],
      });
    } else {
      // Add new line
      addLine({
        id: values.id,
        name: values.name,
        color: values.color,
        stations: [],
      });
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
        ...initialValues,
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
              <div className="space-y-2">
                <FormLabel>Stations</FormLabel>
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