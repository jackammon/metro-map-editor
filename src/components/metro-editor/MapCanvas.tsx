"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Stage, Layer, Circle, Line as KonvaLine, Text, Image as KonvaImage, Rect } from 'react-konva';
import Konva from 'konva';
import { useMapEditor } from '@/lib/context/map-editor-context';
import { EnhancedStation, EnhancedTrack, Coordinates } from '@/lib/types/metro-types';
import { Button } from '@/components/ui/button';
import { StationCreator } from './StationCreator';

// Utility to calculate distance
const calculateDistance = (p1: {x: number, y: number}, p2: {x: number, y: number}) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

const WORLD_UNITS_PER_KM = 1;

export const MapCanvas: React.FC = () => {
    const {
        gameMap,
        updateStation, addTrack,
        selectedStationIds, selectStation,
        selectedTrackIds, selectTrack,
        getStationById, clearSelection,
        deleteStation, deleteTrack,
        updateTrack, 
    } = useMapEditor();
    
    const [newStationPos, setNewStationPos] = useState<Coordinates | null>(null);
    const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
    const [stageScale, setStageScale] = useState(1);
    
    const stageRef = useRef<Konva.Stage>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);
    const [gridPatternImage, setGridPatternImage] = useState<HTMLImageElement | null>(null);

    const stations = useMemo(() => gameMap?.railNetwork.stations || [], [gameMap]);
    const tracks = useMemo(() => gameMap?.railNetwork.tracks || [], [gameMap]);
    const adminSettings = useMemo(() => gameMap?.adminSettings, [gameMap]);

    const resetCamera = useCallback(() => {
        if (gameMap && containerRef.current && stageRef.current) {
            const stage = stageRef.current;
            const mapBounds = getMapBounds(gameMap.railNetwork.stations);
            const container = containerRef.current.getBoundingClientRect();
            
            const zoom = Math.min(
                container.width / mapBounds.width,
                container.height / mapBounds.height
            ) * 0.8;

            const newPos = {
                x: container.width / 2 - (mapBounds.x + mapBounds.width / 2) * zoom,
                y: container.height / 2 - (mapBounds.y + mapBounds.height / 2) * zoom,
            };

            // Imperatively set scale and position
            stage.scale({ x: zoom, y: zoom });
            stage.position(newPos);
            stage.batchDraw();

            // Also update state to keep it in sync
            setStageScale(zoom);
            setStagePos(newPos);
        }
    }, [gameMap]);

    // --- Camera & Initialization ---
    useEffect(() => {
        resetCamera();
    }, [gameMap?.id, gameMap, resetCamera]);


    // --- Background Image Loading ---
    useEffect(() => {
        const bg = gameMap?.background;
        if (bg?.imageUrl) {
            const image = new window.Image();
            image.src = bg.imageUrl;
            image.onload = () => {
                setBackgroundImage(image);
            };
        } else {
            setBackgroundImage(null);
        }
    }, [gameMap?.background]);

    // --- Grid Pattern Loading ---
    useEffect(() => {
        if (adminSettings?.gridSnap?.enabled) {
            const canvas = createGridPattern(adminSettings.gridSnap.size);
            const img = new window.Image();
            img.src = canvas.toDataURL();
            img.onload = () => {
                setGridPatternImage(img);
            };
        } else {
            setGridPatternImage(null);
        }
    }, [adminSettings?.gridSnap]);

    // --- Keyboard Event Handling ---
    useEffect(() => {
      const createTrackBetweenSelectedStations = () => {
          if (selectedStationIds.length !== 2) {
              alert('Please select exactly two stations to create a track between them.');
              return;
          }
  
          const [sourceId, targetId] = selectedStationIds;
          const sourceStation = getStationById(sourceId);
          const targetStation = getStationById(targetId);
  
          if (sourceStation && targetStation) {
              const tracks = gameMap?.railNetwork.tracks || [];
              // Check if a track already exists
              const existingTrack = tracks.find(
                  t => (t.source === sourceId && t.target === targetId) || (t.source === targetId && t.target === sourceId)
              );
  
              if (existingTrack) {
                  alert(`A track already exists between ${sourceStation.name} and ${targetStation.name}`);
                  return;
              }
  
              const distance = calculateDistance(sourceStation.coordinates, targetStation.coordinates);
              
              const newTrack: EnhancedTrack = {
                  id: `${sourceId}-${targetId}`,
                  source: sourceId,
                  target: targetId,
                  distanceKm: parseFloat((distance / 50).toFixed(1)), // Convert pixels to km
                  speedType: 'LOCAL',
                  bidirectional: true,
                  direction: 'both',
                  condition: 'good',
                  powerType: 'electric',
                  scenicValue: 50,
                  points: [sourceStation.coordinates, targetStation.coordinates],
              };
              addTrack(newTrack);
              
              // Keep stations selected so user can see the new track
              console.log(`Created track between ${sourceStation.name} and ${targetStation.name}`);
          }
      };
      
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                // Delete selected tracks
                if (selectedTrackIds.length > 0) {
                    selectedTrackIds.forEach(trackId => {
                        const track = gameMap?.railNetwork.tracks.find(t => t.id === trackId);
                        if (track && window.confirm(`Are you sure you want to delete the track between ${track.source} and ${track.target}?`)) {
                            deleteTrack(trackId);
                        }
                    });
                }
                // Delete selected stations (and their connected tracks)
                else if (selectedStationIds.length > 0) {
                    selectedStationIds.forEach(stationId => {
                        const station = getStationById(stationId);
                        if (station && window.confirm(`Are you sure you want to delete station "${station.name}" and all its connected tracks?`)) {
                            deleteStation(stationId);
                        }
                    });
                }
            }
            else if (e.key === 'l' || e.key === 'L') {
                // Create track between selected stations
                e.preventDefault();
                createTrackBetweenSelectedStations();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [selectedTrackIds, selectedStationIds, gameMap, deleteTrack, deleteStation, getStationById, addTrack]);

    // --- Event Handlers ---

    const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
        // Check if we clicked on empty space (not on a station or track)
        const stage = e.target.getStage();
        if (!stage) return;
        
        // If the target is the Layer, Grid, or Background Image (empty space), create a station
        const isEmptySpace = e.target.className === 'Layer' || e.target.className === 'Rect' || e.target.className === 'Image';
        console.log('Layer clicked, empty space:', isEmptySpace, 'target className:', e.target.className);
        
        if (isEmptySpace) {
            const pos = stage.getPointerPosition();
            console.log('Pointer position:', pos);
            console.log('Stage position:', stage.x(), stage.y());
            console.log('Stage scale:', stage.scaleX(), stage.scaleY());
            
            if(pos) {
                // Convert screen coordinates to world coordinates
                const worldPos = {
                    x: Math.round((pos.x - stage.x()) / stage.scaleX()),
                    y: Math.round((pos.y - stage.y()) / stage.scaleY())
                };
                console.log('Calculated world position:', worldPos);
                setNewStationPos(worldPos);
            }
        }
        
        clearSelection();
    };
    
    const handleStationClick = (e: Konva.KonvaEventObject<MouseEvent>, stationId: string) => {
        e.cancelBubble = true;
        const multiSelect = e.evt.ctrlKey || e.evt.metaKey;
        selectStation(stationId, multiSelect);
    };

    const handleTrackClick = (e: Konva.KonvaEventObject<MouseEvent>, trackId: string) => {
        e.cancelBubble = true;
        const isCommandClick = e.evt.metaKey || e.evt.ctrlKey;
        console.log('Track clicked:', trackId, 'Command:', isCommandClick, 'Selected:', selectedTrackIds.includes(trackId));
        const track = tracks.find(t => t.id === trackId);
        if (isCommandClick && selectedTrackIds.includes(trackId) && track) {
            const stage = e.target.getStage();
            if (!stage) return;
            const pos = stage.getPointerPosition();
            if (!pos) return;
            const worldPos = {
                x: (pos.x - stage.x()) / stage.scaleX(),
                y: (pos.y - stage.y()) / stage.scaleY(),
            };
            console.log('Adding point at:', worldPos);

            let currentPoints = track.points || [];
            if (currentPoints.length < 2) {
                const source = getStationById(track.source);
                const target = getStationById(track.target);
                if (source && target) {
                    currentPoints = [source.coordinates, target.coordinates];
                }
            }

            // Find closest segment and insert point
            let minDist = Infinity;
            let insertIndex = -1;
            for (let i = 0; i < currentPoints.length - 1; i++) {
                const p1 = currentPoints[i];
                const p2 = currentPoints[i + 1];
                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const t = Math.max(0, Math.min(1, ((worldPos.x - p1.x) * dx + (worldPos.y - p1.y) * dy) / (dx * dx + dy * dy)));
                const projX = p1.x + t * dx;
                const projY = p1.y + t * dy;
                const dist = Math.sqrt(Math.pow(worldPos.x - projX, 2) + Math.pow(worldPos.y - projY, 2));
                console.log(`Segment ${i}: dist=${dist}`);
                if (dist < minDist) {
                    minDist = dist;
                    insertIndex = i + 1;
                }
            }
            if (insertIndex === -1 && currentPoints.length >= 2) {
                insertIndex = currentPoints.length - 1; // Insert before the last point as a fallback
            }
            if (insertIndex !== -1) {
                const newPoints = [...currentPoints];
                newPoints.splice(insertIndex, 0, worldPos);
                updateTrack(track.id, { points: newPoints });
            }
        } else {
            selectTrack(trackId, isCommandClick);
        }
    };

    const handlePointDragMove = (trackId: string, pointIndex: number, e: Konva.KonvaEventObject<DragEvent>) => {
        const track = tracks.find(t => t.id === trackId);
        if (track && track.points) {
            const newPoints = [...track.points];
            newPoints[pointIndex] = { x: e.target.x(), y: e.target.y() };
            updateTrack(track.id, { points: newPoints });
        }
    };

    const handlePointDblClick = (trackId: string, pointIndex: number) => {
        const track = tracks.find(t => t.id === trackId);
        if (track && track.points && track.points.length > 2) { // Can't remove start/end points
            const newPoints = [...track.points];
            newPoints.splice(pointIndex, 1);
            updateTrack(track.id, { points: newPoints });
        }
    };

    const handleStationDragEnd = (e: Konva.KonvaEventObject<DragEvent>, stationId: string) => {
        const newCoords = { x: e.target.x(), y: e.target.y() };
        updateStation(stationId, { coordinates: newCoords });

        // Update connected tracks
        tracks.forEach(track => {
            if (track.source === stationId || track.target === stationId) {
                const newPoints = track.points ? [...track.points] : [];
                if (track.source === stationId) {
                    newPoints[0] = newCoords;
                }
                if (track.target === stationId) {
                    newPoints[newPoints.length - 1] = newCoords;
                }
                updateTrack(track.id, { points: newPoints });
            }
        });
    };
    
    const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault();
        const stage = stageRef.current;
        if (!stage) return;
        
        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();
        if(!pointer) return;

        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };
        
        const newScale = e.evt.deltaY > 0 ? oldScale * 1.1 : oldScale / 1.1;
        setStageScale(newScale);

        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };
        setStagePos(newPos);
    };

    const getMapBounds = (stations: EnhancedStation[]): { x: number, y: number, width: number, height: number } => {
        if (stations.length === 0) {
            return { x: -250, y: -250, width: 500, height: 500 };
        }
        const coords = stations.map(s => s.coordinates);
        const xs = coords.map(c => c.x);
        const ys = coords.map(c => c.y);
        const minX = Math.min(...xs);
        const minY = Math.min(...ys);
        const maxX = Math.max(...xs);
        const maxY = Math.max(...ys);
        return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
    }

    if (!gameMap) return <div className="w-full h-full bg-gray-200 flex items-center justify-center"><p>Loading map...</p></div>;
    
    const renderScale = WORLD_UNITS_PER_KM;
    const effectiveStageScale = stageScale * renderScale;

    return (
        <div ref={containerRef} className="w-full h-full border rounded-md overflow-hidden bg-gray-100 relative">
            <Stage
                ref={stageRef}
                width={containerRef.current?.clientWidth}
                height={containerRef.current?.clientHeight}
                x={stagePos.x}
                y={stagePos.y}
                scaleX={effectiveStageScale}
                scaleY={effectiveStageScale}
                draggable
                onWheel={handleWheel}
            >
                <Layer onClick={handleStageClick}>
                    {/* Grid */}
                    {adminSettings?.gridSnap?.enabled && gridPatternImage && (
                        <Rect x={-5000} y={-5000} width={10000} height={10000} fillPatternImage={gridPatternImage} />
                    )}
                    {/* Render Background */}
                    {backgroundImage && gameMap?.background && (
                        <KonvaImage
                            image={backgroundImage}
                            x={gameMap.background.offset?.x || 0}
                            y={gameMap.background.offset?.y || 0}
                            scaleX={gameMap.background.scale || 1}
                            scaleY={gameMap.background.scale || 1}
                            opacity={0.5}
                        />
                    )}

                    {/* Render Tracks */}
                    {tracks.map(track => {
                        const source = getStationById(track.source);
                        const target = getStationById(track.target);
                        if (!source || !target) return null;

                        const isSelected = selectedTrackIds.includes(track.id);

                        // Use points if available, else fallback to straight line
                        let linePoints: number[] = [];
                        if (track.points && track.points.length > 0) {
                            linePoints = track.points.flatMap(p => [p.x, p.y]);
                        } else {
                            linePoints = [
                                source.coordinates.x, source.coordinates.y,
                                target.coordinates.x, target.coordinates.y,
                            ];
                        }
                        console.log(`Rendering track ${track.id} with points:`, linePoints);

                        return (
                            <React.Fragment key={track.id}>
                                <KonvaLine
                                    points={linePoints}
                                    stroke={isSelected ? '#ff00ff' : '#000000'}
                                    strokeWidth={isSelected ? 6 : 4}
                                    hitStrokeWidth={20} // makes it easier to click
                                    onClick={(e) => handleTrackClick(e, track.id)}
                                />
                                {isSelected && track.points && track.points.length > 2 && track.points.slice(1, -1).map((point, index) => (
                                    <Circle
                                        key={`track-point-${track.id}-${index}`}
                                        x={point.x}
                                        y={point.y}
                                        radius={adminSettings?.gridSnap?.size ? adminSettings.gridSnap.size / 4 : 4}
                                        fill="white"
                                        stroke="black"
                                        strokeWidth={1}
                                        draggable
                                        onDragMove={(e) => handlePointDragMove(track.id, index, e)}
                                        onDblClick={() => handlePointDblClick(track.id, index)}
                                    />
                                ))}
                            </React.Fragment>
                        );
                    })}

                    {/* Render Stations */}
                    {stations.map(station => {
                        const isSelected = selectedStationIds.includes(station.id);
                        return (
                            <Circle
                                key={station.id}
                                x={station.coordinates.x}
                                y={station.coordinates.y}
                                radius={station.type === 'large' ? 12 : station.type === 'medium' ? 9 : 6}
                                fill={isSelected ? 'yellow' : 'white'}
                                stroke="black"
                                strokeWidth={2}
                                draggable
                                onClick={(e) => handleStationClick(e, station.id)}
                                onDragEnd={(e) => handleStationDragEnd(e, station.id)}
                            />
                        );
                    })}
                    
                    {/* Render Station Names */}
                     {stations.map(station => (
                        <Text
                            key={`${station.id}-label`}
                            x={station.coordinates.x + 15}
                            y={station.coordinates.y - 10}
                            text={station.name}
                            fontSize={12}
                            fill="#333"
                        />
                     ))}

                </Layer>
            </Stage>
            <div className="absolute top-2 right-2 rounded">
                <Button onClick={resetCamera} variant="outline" size="sm">Reset Camera</Button>
            </div>
            
            {newStationPos && (
                <StationCreator
                    position={newStationPos}
                    onClose={() => setNewStationPos(null)}
                />
            )}
        </div>
    );
};

const createGridPattern = (size: number): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    if(context){
        context.strokeStyle = '#e0e0e0';
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(size, 0);
        context.lineTo(size, size);
        context.lineTo(0, size);
        context.stroke();
    }
    return canvas;
} 