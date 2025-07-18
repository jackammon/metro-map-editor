"use client";

import React from 'react';
import { useMapEditor } from '@/lib/context/map-editor-context';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';

export const EditorSettingsPanel: React.FC = () => {
  const { gameMap, updateAdminSettings } = useMapEditor();
  
  const adminSettings = gameMap?.adminSettings;

  const handleGridSnapChange = (enabled: boolean) => {
    updateAdminSettings({ gridSnap: { enabled, size: adminSettings?.gridSnap?.size ?? 10 } });
  };
  
  const handleGridSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value, 10);
    if (!isNaN(size) && size > 0) {
      updateAdminSettings({ gridSnap: { enabled: adminSettings?.gridSnap?.enabled ?? false, size } });
    }
  };
  
  const handleLayerVisibilityChange = (layer: string, visible: boolean) => {
    updateAdminSettings({
      layers: {
        background: adminSettings?.layers?.background ?? true,
        stations: adminSettings?.layers?.stations ?? true,
        tracks: adminSettings?.layers?.tracks ?? true,
        grid: adminSettings?.layers?.grid ?? true,
        ...adminSettings?.layers,
        [layer]: visible,
      },
    });
  };

  if (!adminSettings) return null;

  return (
    <div className="space-y-4">
      {/* Grid Settings */}
      <div className="space-y-2">
          <h4 className="font-semibold">Grid</h4>
          <div className="flex items-center justify-between">
              <Label htmlFor="grid-snap">Snap to Grid</Label>
              <Switch
                  id="grid-snap"
                  checked={adminSettings.gridSnap?.enabled}
                  onCheckedChange={handleGridSnapChange}
              />
          </div>
           <div className="flex items-center justify-between">
              <Label htmlFor="grid-size">Grid Size</Label>
              <Input
                  id="grid-size"
                  type="number"
                  value={adminSettings.gridSnap?.size}
                  onChange={handleGridSizeChange}
                  className="w-20"
                  disabled={!adminSettings.gridSnap?.enabled}
              />
          </div>
      </div>
      
      {/* Layer Visibility */}
      <div className="space-y-2">
           <h4 className="font-semibold">Layers</h4>
           {adminSettings.layers && Object.entries(adminSettings.layers).map(([layer, isVisible]) => (
              <div key={layer} className="flex items-center justify-between">
                  <Label htmlFor={`layer-${layer}`} className="capitalize">{layer}</Label>
                  <Switch
                      id={`layer-${layer}`}
                      checked={isVisible}
                      onCheckedChange={(checked) => handleLayerVisibilityChange(layer, checked)}
                  />
              </div>
           ))}
      </div>
    </div>
  );
}; 