"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Circle, Line, Image } from 'react-konva';
import { useMetro } from '@/lib/context/metro-context';
import { StationForm } from './StationForm';
import Konva from 'konva';

export const MapCanvas: React.FC = () => {
  const {
    stations,
    lines,
    worldSettings,
    selectedStationIds,
    activeLineId,
    selectStation,
    clearSelectedStations,
    updateStation,
    connectStations,
    addStationToLine,
    updateWorldSettings
  } = useMetro();

  const [stageScale, setStageScale] = useState(worldSettings.cameraPosition?.scale || 1);
  const [stagePosition, setStagePosition] = useState({ 
    x: worldSettings.cameraPosition?.x || 0, 
    y: worldSettings.cameraPosition?.y || 0 
  });
  const [isDragging, setIsDragging] = useState(false);
  const [newStationPosition, setNewStationPosition] = useState<{ x: number; y: number } | null>(null);
  const [isStationFormOpen, setIsStationFormOpen] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitialCentering = useRef(true);

  // Load background image when it changes
  useEffect(() => {
    if (worldSettings.backgroundImage) {
      const image = new window.Image();
      image.src = worldSettings.backgroundImage;
      image.onload = () => {
        setBackgroundImage(image);
      };
    } else {
      setBackgroundImage(null);
    }
  }, [worldSettings.backgroundImage]);

  // Update camera position from worldSettings when it changes
  useEffect(() => {
    if (worldSettings.cameraPosition) {
      setStageScale(worldSettings.cameraPosition.scale);
      setStagePosition({
        x: worldSettings.cameraPosition.x,
        y: worldSettings.cameraPosition.y
      });
    }
  }, [worldSettings.cameraPosition]);

  // Center the world initially if no camera position is saved
  useEffect(() => {
    if (isInitialCentering.current && containerRef.current && !worldSettings.cameraPosition) {
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;
      
      // Calculate center position
      const centerX = containerWidth / 2 - (worldSettings.width / 2) * stageScale;
      const centerY = containerHeight / 2 - (worldSettings.height / 2) * stageScale;
      
      setStagePosition({ x: centerX, y: centerY });
      isInitialCentering.current = false;
    }
  }, [worldSettings.width, worldSettings.height, stageScale, worldSettings.cameraPosition]);

  // Save camera position when it changes
  useEffect(() => {
    // Debounce to avoid too many updates
    const debounceTimer = setTimeout(() => {
      updateWorldSettings({
        cameraPosition: {
          x: stagePosition.x,
          y: stagePosition.y,
          scale: stageScale
        }
      });
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [stagePosition, stageScale, updateWorldSettings]);

  // Adjust stage size based on container size
  useEffect(() => {
    const resizeStage = () => {
      if (containerRef.current && stageRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;
        
        stageRef.current.width(containerWidth);
        stageRef.current.height(containerHeight);
      }
    };

    resizeStage();
    window.addEventListener('resize', resizeStage);
    
    return () => {
      window.removeEventListener('resize', resizeStage);
    };
  }, []);

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stageScale;
    const pointer = stage.getPointerPosition();
    
    if (!pointer) return;
    
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    // Calculate new scale
    const newScale = e.evt.deltaY < 0 ? oldScale * 1.1 : oldScale / 1.1;
    
    // Limit scale
    const limitedScale = Math.max(0.1, Math.min(newScale, 5));
    setStageScale(limitedScale);

    // Calculate new position
    const newPos = {
      x: pointer.x - mousePointTo.x * limitedScale,
      y: pointer.y - mousePointTo.y * limitedScale,
    };
    
    setStagePosition(newPos);
  };

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Get click position relative to the stage
    const stage = stageRef.current;
    if (!stage) return;
    
    const clickPos = stage.getPointerPosition();
    if (!clickPos) return;
    
    // Convert to world coordinates
    const worldPos = {
      x: (clickPos.x - stage.x()) / stageScale,
      y: (clickPos.y - stage.y()) / stageScale,
    };
    
    // Check if clicked on empty space
    const clickedOnStation = e.target.name() === 'station';
    
    if (!clickedOnStation) {
      // If we have selected stations and active line, connect them
      if (selectedStationIds.length >= 2 && activeLineId) {
        // Connect all selected stations to the active line
        selectedStationIds.forEach(stationId => {
          addStationToLine(activeLineId, stationId);
        });
        
        // Connect adjacent stations
        for (let i = 0; i < selectedStationIds.length - 1; i++) {
          connectStations(selectedStationIds[i], selectedStationIds[i + 1]);
        }
        
        clearSelectedStations();
      } else if (!isDragging) {
        // Add new station at click position
        setNewStationPosition(worldPos);
        setIsStationFormOpen(true);
        clearSelectedStations();
      }
    }
  };

  const handleStationClick = (stationId: string, e: Konva.KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true; // Prevent stage click
    
    const multiSelect = e.evt.ctrlKey || e.evt.metaKey;
    
    if (activeLineId) {
      // If a line is active, add this station to the line
      addStationToLine(activeLineId, stationId);
      
      // If we have selected stations, connect them
      if (selectedStationIds.length > 0) {
        selectedStationIds.forEach(selectedId => {
          connectStations(stationId, selectedId);
        });
      }
      
      selectStation(stationId, true);
    } else {
      // Normal selection
      selectStation(stationId, multiSelect);
    }
  };

  const handleStationDragEnd = (stationId: string, e: Konva.KonvaEventObject<DragEvent>) => {
    const station = stations.find(s => s.id === stationId);
    if (!station) return;
    
    // Update station position
    updateStation({
      ...station,
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full border rounded-md overflow-hidden bg-gray-100"
      style={{ height: 'calc(100vh - 200px)' }}
    >
      <Stage
        ref={stageRef}
        width={containerRef.current?.offsetWidth || worldSettings.width}
        height={containerRef.current?.offsetHeight || worldSettings.height}
        scaleX={stageScale}
        scaleY={stageScale}
        x={stagePosition.x}
        y={stagePosition.y}
        draggable
        onWheel={handleWheel}
        onClick={handleStageClick}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => {
          setIsDragging(false);
          // Update stage position when drag ends
          if (stageRef.current) {
            setStagePosition({
              x: stageRef.current.x(),
              y: stageRef.current.y()
            });
          }
        }}
      >
        <Layer>
          {/* Background */}
          {backgroundImage && (
            <Image
              image={backgroundImage}
              width={worldSettings.width}
              height={worldSettings.height}
              opacity={0.5}
            />
          )}
          
          {/* World boundary */}
          <Line
            points={[0, 0, worldSettings.width, 0, worldSettings.width, worldSettings.height, 0, worldSettings.height, 0, 0]}
            stroke="#999"
            strokeWidth={2}
            dash={[10, 5]}
          />
          
          {/* Lines between stations */}
          {lines.map(line => {
            // Get all stations in this line
            const lineStations = line.stations
              .map(id => stations.find(s => s.id === id))
              .filter(Boolean);
            
            if (lineStations.length < 2) return null;
            
            // Create points array for the line
            const points = lineStations.flatMap(station => [station!.x, station!.y]);
            
            return (
              <Line
                key={line.id}
                points={points}
                stroke={line.color}
                strokeWidth={4}
                tension={0.3}
                lineCap="round"
                lineJoin="round"
              />
            );
          })}
          
          {/* Stations */}
          {stations.map(station => (
            <Circle
              key={station.id}
              name="station"
              x={station.x}
              y={station.y}
              radius={station.isInterchange ? 12 : 8}
              fill="white"
              stroke={station.isInterchange ? "black" : "#666"}
              strokeWidth={2}
              draggable
              onClick={(e) => handleStationClick(station.id, e)}
              onDragEnd={(e) => handleStationDragEnd(station.id, e)}
              shadowColor="rgba(0,0,0,0.3)"
              shadowBlur={5}
              shadowOffset={{ x: 2, y: 2 }}
              shadowOpacity={0.5}
            />
          ))}
          
          {/* Selected stations highlight */}
          {selectedStationIds.map(id => {
            const station = stations.find(s => s.id === id);
            if (!station) return null;
            
            return (
              <Circle
                key={`selection-${id}`}
                x={station.x}
                y={station.y}
                radius={station.isInterchange ? 16 : 12}
                stroke="#3b82f6"
                strokeWidth={2}
                dash={[5, 2]}
              />
            );
          })}
        </Layer>
      </Stage>
      
      {/* Station form for adding new stations */}
      {newStationPosition && (
        <StationForm
          open={isStationFormOpen}
          onOpenChange={setIsStationFormOpen}
          position={newStationPosition}
        />
      )}
    </div>
  );
}; 