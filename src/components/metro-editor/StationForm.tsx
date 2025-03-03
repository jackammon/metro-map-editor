"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMetro } from '@/lib/context/metro-context';
import { Station } from '@/lib/types/metro-types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
  const { addStation, updateStation } = useMetro();

  const form = useForm<StationFormValues>({
    resolver: zodResolver(stationSchema),
    defaultValues: {
      id: initialValues?.id || '',
      name: initialValues?.name || '',
      zone: initialValues?.zone || 1,
    },
  });

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
            
            <DialogFooter>
              <Button type="submit">{isEditing ? 'Update' : 'Add'} Station</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}; 