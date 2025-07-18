"use client";
/* eslint-disable jsx-a11y/alt-text */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ChevronLeft, 
  ChevronRight, 
  Map, 
  FileText, 
  Settings, 
  Image, 
  CheckCircle, 
  Upload, 
  Download 
} from 'lucide-react';
import { CollapsibleSection } from './CollapsibleSection';
import { MapSelector } from './MapSelector';
import { MetadataEditor } from './MetadataEditor';
import { EditorSettingsPanel } from './EditorSettingsPanel';
import { BackgroundEditor } from './BackgroundEditor';
import { ValidationPanel } from './ValidationPanel';
import { ImportPanel } from './ImportPanel';
import { ExportPanel } from './ExportPanel';

interface LeftSidePanelProps {
  defaultPosition?: { x: number; y: number };
}

export const LeftSidePanel: React.FC<LeftSidePanelProps> = ({
  defaultPosition
}) => {
  const [position, setPosition] = useState(() => ({
    x: defaultPosition?.x ?? 0,
    y: defaultPosition?.y ?? 80
  }));
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      setPosition({
        x: Math.max(0, Math.min(newX, window.innerWidth - 360)),
        y: Math.max(0, Math.min(newY, window.innerHeight - 100))
      });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      className="fixed z-50"
      style={{
        left: position.x,
        top: position.y,
        width: isCollapsed ? 40 : 360
      }}
    >
      <Card className="shadow-lg border-2 bg-background/95 backdrop-blur-sm">
        {/* Header */}
        <div 
          className="flex items-center justify-between p-3 bg-muted/50 cursor-move border-b"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            {!isCollapsed && <span className="font-medium">Editor Tools</span>}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-6 w-6 p-0"
          >
            {isCollapsed ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronLeft className="h-3 w-3" />
            )}
          </Button>
        </div>

        {/* Content */}
        {!isCollapsed && (
          <div className="max-h-[80vh] overflow-y-auto">
            <CollapsibleSection
              title="Map Loader"
              icon={<Map className="h-4 w-4" />}
              defaultExpanded={true}
            >
              <MapSelector />
            </CollapsibleSection>

            <CollapsibleSection
              title="Metadata"
              icon={<FileText className="h-4 w-4" />}
              defaultExpanded={true}
            >
              <MetadataEditor />
            </CollapsibleSection>

            <CollapsibleSection
              title="Editor Settings"
              icon={<Settings className="h-4 w-4" />}
              defaultExpanded={false}
            >
              <EditorSettingsPanel />
            </CollapsibleSection>

            <CollapsibleSection
              title="Background"
              icon={<Image className="h-4 w-4" />}
              defaultExpanded={false}
            >
              <BackgroundEditor />
            </CollapsibleSection>

            <CollapsibleSection
              title="Validation"
              icon={<CheckCircle className="h-4 w-4" />}
              defaultExpanded={true}
            >
              <ValidationPanel />
            </CollapsibleSection>

            <CollapsibleSection
              title="Import"
              icon={<Upload className="h-4 w-4" />}
              defaultExpanded={false}
            >
              <ImportPanel />
            </CollapsibleSection>

            <CollapsibleSection
              title="Export"
              icon={<Download className="h-4 w-4" />}
              defaultExpanded={true}
            >
              <ExportPanel />
            </CollapsibleSection>
          </div>
        )}
      </Card>
    </div>
  );
}; 