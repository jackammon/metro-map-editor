"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Stage, Layer, Circle, Line as KonvaLine, Text, Image as KonvaImage, Rect } from 'react-konva';
import Konva from 'konva';
import { useMapEditor } from '@/lib/context/map-editor-context';
import { EnhancedStation, EnhancedTrack } from '@/lib/types/metro-types';
import { StationCreator } from './StationCreator';

// Utility to calculate distance
const calculateDistance = (p1: {x: number, y: number}, p2: {x: number, y: number}) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

const WORLD_UNITS_PER_KM = 1;
const BASE_RENDER_SCALE = 50; // For pixel preview

export const MapCanvas: React.FC = () => {
    const {
        gameMap,
        addStation, updateStation, addTrack,
        selectedStationIds, selectStation,
        selectedTrackIds, selectTrack,
        getStationById, clearSelection,
        updateGameSettings, deleteStation, deleteTrack,
    } = useMapEditor();
    
    const [newStationPos, setNewStationPos] = useState<{ x: number; y: number } | null>(null);
    const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
    const [stageScale, setStageScale] = useState(1);
    const [pixelPreview, setPixelPreview] = useState(false);
    
    const stageRef = useRef<Konva.Stage>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);

    const stations = useMemo(() => gameMap?.railNetwork.stations || [], [gameMap]);
    const tracks = useMemo(() => gameMap?.railNetwork.tracks || [], [gameMap]);
    const adminSettings = useMemo(() => gameMap?.adminSettings, [gameMap]);

    // --- Camera & Initialization ---
    useEffect(() => {
        // Center map on load or map change
        if (gameMap && containerRef.current) {
            const mapBounds = getMapBounds(gameMap.railNetwork.stations);
            const container = containerRef.current.getBoundingClientRect();
            
            const zoom = Math.min(
                container.width / mapBounds.width,
                container.height / mapBounds.height
            ) * 0.8;

            setStageScale(zoom);
            setStagePos({
                x: container.width / 2 - (mapBounds.x + mapBounds.width / 2) * zoom,
                y: container.height / 2 - (mapBounds.y + mapBounds.height / 2) * zoom,
            });
        }
    }, [gameMap?.id]);


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

    // --- Manual Track Creation Function ---
    const createTrackBetweenSelectedStations = () => {
        if (selectedStationIds.length !== 2) {
            alert('Please select exactly two stations to create a track between them.');
            return;
        }

        const [sourceId, targetId] = selectedStationIds;
        const sourceStation = getStationById(sourceId);
        const targetStation = getStationById(targetId);

        if (sourceStation && targetStation) {
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
                scenicValue: 50
            };
            addTrack(newTrack);
            
            // Keep stations selected so user can see the new track
            console.log(`Created track between ${sourceStation.name} and ${targetStation.name}`);
        }
    };

    // --- Keyboard Event Handling ---
    useEffect(() => {
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
    }, [selectedTrackIds, selectedStationIds, gameMap, deleteTrack, deleteStation, getStationById, createTrackBetweenSelectedStations]);

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
        selectTrack(trackId, false); // Tracks don't support multiselect for now
    }
    
    const handleStationDragEnd = (e: Konva.KonvaEventObject<DragEvent>, stationId: string) => {
        updateStation(stationId, {
            coordinates: {
                x: Math.round(e.target.x()),
                y: Math.round(e.target.y()),
            }
        });
    }

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

    const getMapBounds = (stations: EnhancedStation[]) => {
        if (stations.length === 0) return { x: 0, y: 0, width: 1000, height: 1000 };
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
    
    const renderScale = pixelPreview ? BASE_RENDER_SCALE : WORLD_UNITS_PER_KM;
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
                    {adminSettings?.gridSnap?.enabled && (
                        <Rect x={-5000} y={-5000} width={10000} height={10000} fillPatternImage={createGridPattern(adminSettings.gridSnap.size) as any} />
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

                        return (
                            <KonvaLine
                                key={track.id}
                                points={[
                                    source.coordinates.x, source.coordinates.y,
                                    target.coordinates.x, target.coordinates.y,
                                ]}
                                stroke={isSelected ? '#ff00ff' : '#000000'}
                                strokeWidth={isSelected ? 6 : 4}
                                hitStrokeWidth={12} // makes it easier to click
                                onClick={(e) => handleTrackClick(e, track.id)}
                            />
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
            <div className="absolute top-2 right-2 bg-white p-2 rounded shadow">
                <label className="flex items-center space-x-2 text-sm">
                    <input type="checkbox" checked={pixelPreview} onChange={e => setPixelPreview(e.target.checked)} />
                    <span>Pixel Preview (x{BASE_RENDER_SCALE})</span>
                </label>
            </div>
            
            {newStationPos && (
                <StationCreator
                    position={{
                        x: newStationPos.x * stageScale + stagePos.x,
                        y: newStationPos.y * stageScale + stagePos.y
                    }}
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