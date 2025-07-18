"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ChevronLeft, 
  ChevronRight, 
  List,
  Layers,
  Edit3,
  Route
} from 'lucide-react';
import { CollapsibleSection } from './CollapsibleSection';
import { StationsList } from './StationsList';
import { TracksList } from './TracksList';
import { StationEditor } from './StationEditor';
import { TrackEditor } from './TrackEditor';

interface RightSidePanelProps {
  defaultPosition?: { x: number; y: number };
}

export const RightSidePanel: React.FC<RightSidePanelProps> = ({
  defaultPosition
}) => {
  const [position, setPosition] = useState({ x: 20, y: 80 }); // Default position

  React.  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Set initial position from right side
      const defaultX = defaultPosition?.x ?? -360;
      const x = defaultX < 0 ? window.innerWidth + defaultX : defaultX;
      setPosition({ 
        x: Math.max(0, x), 
        y: defaultPosition?.y ?? 80 
      });
    }
  }, [defaultPosition?.x, defaultPosition?.y]); // Include dependencies used in the effect
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
            <Route className="h-4 w-4" />
            {!isCollapsed && <span className="font-medium">Network Tools</span>}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-6 w-6 p-0"
          >
            {isCollapsed ? (
              <ChevronLeft className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
        </div>

        {/* Content */}
        {!isCollapsed && (
          <div className="max-h-[80vh] overflow-y-auto">
            <CollapsibleSection
              title="Stations"
              icon={<List className="h-4 w-4" />}
              defaultExpanded={true}
            >
              <StationsList />
            </CollapsibleSection>

            <CollapsibleSection
              title="Tracks"
              icon={<Layers className="h-4 w-4" />}
              defaultExpanded={true}
            >
              <TracksList />
            </CollapsibleSection>

            <CollapsibleSection
              title="Station Editor"
              icon={<Edit3 className="h-4 w-4" />}
              defaultExpanded={true}
            >
              <StationEditor />
            </CollapsibleSection>

            <CollapsibleSection
              title="Track Editor"
              icon={<Route className="h-4 w-4" />}
              defaultExpanded={true}
            >
              <TrackEditor />
            </CollapsibleSection>
          </div>
        )}
      </Card>
    </div>
  );
}; 