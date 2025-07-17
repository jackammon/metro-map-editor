"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMapEditor } from '@/lib/context/map-editor-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const metadataSchema = z.object({
  name: z.string().min(1, "Name is required"),
  region: z.string().min(1, "Region is required"),
  description: z.string().optional(),
  version: z.string().optional(),
  author: z.string().optional(),
  seed: z.coerce.number().int().optional(),
});

type MetadataFormValues = z.infer<typeof metadataSchema>;

export const MetadataEditor: React.FC = () => {
  const { gameMap, updateMapMetadata } = useMapEditor();
  
  const form = useForm<MetadataFormValues>({
    resolver: zodResolver(metadataSchema),
  });

  useEffect(() => {
    if (gameMap?.metadata) {
      form.reset(gameMap.metadata);
    }
  }, [gameMap?.metadata, form]);

  const onSubmit = (data: MetadataFormValues) => {
    updateMapMetadata(data);
    form.reset(data); // to update the form state and remove "dirty" status
  };
  
  if (!gameMap) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Map Metadata</CardTitle>
        <CardDescription>Editing: {gameMap.id}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="map-name">Map Name</Label>
            <Input id="map-name" {...form.register('name')} />
            {form.formState.errors.name && <p className="text-red-500 text-xs mt-1">{form.formState.errors.name.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="map-region">Region</Label>
            <Input id="map-region" {...form.register('region')} />
             {form.formState.errors.region && <p className="text-red-500 text-xs mt-1">{form.formState.errors.region.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="map-desc">Description</Label>
            <Textarea id="map-desc" {...form.register('description')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="map-version">Version</Label>
              <Input id="map-version" {...form.register('version')} />
            </div>
            <div>
              <Label htmlFor="map-author">Author</Label>
              <Input id="map-author" {...form.register('author')} />
            </div>
          </div>
          
           <div>
              <Label htmlFor="map-seed">Seed</Label>
              <Input id="map-seed" type="number" {...form.register('seed')} />
            </div>

          <Button type="submit" className="w-full" disabled={!form.formState.isDirty}>
            {form.formState.isDirty ? 'Save Metadata' : 'Saved'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}; 