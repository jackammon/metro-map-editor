/**
 * @fileoverview Defines the React context for the Metro Map Editor.
 * This context provides the state management for the entire GameMap object,
 * including stations, tracks, metadata, and editor UI state.
 */

"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { GameMap, EnhancedStation, EnhancedTrack, MapMetadata, GameSettings, AdminSettings, MapBackground } from '../types/metro-types';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/storage-utils';

// --- HELPER: CREATE A DEFAULT EMPTY MAP ---

const createDefaultMap = (): GameMap => ({
  id: `new-map-${Date.now()}`,
  metadata: {
    name: 'Untitled Map',
    region: 'Unknown',
    description: 'A new metro map created with the editor.',
    created: new Date().toISOString(),
    version: '1.0',
    seed: Math.floor(Math.random() * 100000),
  },
  railNetwork: {
    stations: [],
    tracks: [],
  },
  gameSettings: {
    initialZoom: 1,
    centerPosition: { x: 0, y: 0 },
  },
  adminSettings: {
    gridSnap: { enabled: true, size: 50 },
    layers: { background: true, stations: true, tracks: true, grid: true },
  },
});


// --- CONTEXT DEFINITION ---

interface MapEditorContextType {
  // State
  gameMap: GameMap | null;
  selectedStationIds: string[];
  selectedTrackIds: string[];
  
  // Actions
  loadMap: (map: GameMap) => void;
  createNewMap: () => void;
  
  // Station Actions
  addStation: (station: EnhancedStation) => void;
  updateStation: (stationId: string, updates: Partial<EnhancedStation>) => void;
  deleteStation: (stationId: string) => void;
  
  // Track Actions
  addTrack: (track: EnhancedTrack) => void;
  updateTrack: (trackId: string, updates: Partial<EnhancedTrack>) => void;
  deleteTrack: (trackId: string) => void;
  
  // Metadata & Settings Actions
  updateMapMetadata: (updates: Partial<MapMetadata>) => void;
  updateGameSettings: (updates: Partial<GameSettings>) => void;
  updateAdminSettings: (updates: Partial<AdminSettings>) => void;
  updateBackground: (background: MapBackground | undefined) => void;
  
  // Selection Actions
  selectStation: (stationId: string, multiSelect?: boolean) => void;
  selectTrack: (trackId: string, multiSelect?: boolean) => void;
  clearSelection: () => void;
  
  // Utility
  getStationById: (id: string) => EnhancedStation | undefined;
  getTrackById: (id: string) => EnhancedTrack | undefined;
  
  // Camera
  resetCamera: () => void;
  registerResetCamera: (callback: () => void) => void;
}

const MapEditorContext = createContext<MapEditorContextType | undefined>(undefined);


// --- PROVIDER COMPONENT ---

export const MapEditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameMap, setGameMap] = useState<GameMap | null>(null);
  const [selectedStationIds, setSelectedStationIds] = useState<string[]>([]);
  const [selectedTrackIds, setSelectedTrackIds] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [resetCameraCallback, setResetCameraCallback] = useState<(() => void) | null>(null);

  // --- DATA PERSISTENCE ---

  useEffect(() => {
    // On mount, try to load from localStorage, otherwise create a new default map
    if (typeof window !== 'undefined') {
      const savedMap = loadFromLocalStorage();
      setGameMap(savedMap || createDefaultMap());
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    // Whenever the map changes, save it to localStorage
    if (isInitialized && gameMap) {
      saveToLocalStorage(gameMap);
    }
  }, [gameMap, isInitialized]);
  
  
  // --- CORE ACTIONS ---
  
  const loadMap = (mapToLoad: GameMap) => {
    setGameMap(mapToLoad);
    clearSelection();
  };

  const createNewMap = () => {
    setGameMap(createDefaultMap());
    clearSelection();
  };


  // --- MUTATION ACTIONS ---

  const addStation = (station: EnhancedStation) => {
    setGameMap(prevMap => {
      if (!prevMap) return null;
      // Prevent duplicates
      if (prevMap.railNetwork.stations.some(s => s.id === station.id)) {
        console.warn(`Station with ID "${station.id}" already exists.`);
        return prevMap;
      }
      return {
        ...prevMap,
        railNetwork: {
          ...prevMap.railNetwork,
          stations: [...prevMap.railNetwork.stations, station],
        },
      };
    });
  };

  const updateStation = (stationId: string, updates: Partial<EnhancedStation>) => {
    setGameMap(prevMap => {
      if (!prevMap) return null;
      return {
        ...prevMap,
        railNetwork: {
          ...prevMap.railNetwork,
          stations: prevMap.railNetwork.stations.map(s =>
            s.id === stationId ? { ...s, ...updates } : s
          ),
        },
      };
    });
  };

  const deleteStation = (stationId: string) => {
    setGameMap(prevMap => {
      if (!prevMap) return null;
      
      // Also remove any tracks connected to this station
      const remainingTracks = prevMap.railNetwork.tracks.filter(
        t => t.source !== stationId && t.target !== stationId
      );
      
      return {
        ...prevMap,
        railNetwork: {
          stations: prevMap.railNetwork.stations.filter(s => s.id !== stationId),
          tracks: remainingTracks,
        },
      };
    });
    // Ensure the deleted station is deselected
    setSelectedStationIds(prev => prev.filter(id => id !== stationId));
  };
  
  const addTrack = (track: EnhancedTrack) => {
    setGameMap(prevMap => {
        if (!prevMap) return null;
        if (prevMap.railNetwork.tracks.some(t => t.id === track.id)) {
            console.warn(`Track with ID "${track.id}" already exists.`);
            return prevMap;
        }
        const sourceStation = prevMap.railNetwork.stations.find(s => s.id === track.source);
        const targetStation = prevMap.railNetwork.stations.find(s => s.id === track.target);
        let finalTrack = track;
        if (sourceStation && targetStation && (!track.points || track.points.length === 0)) {
          finalTrack = {
            ...track,
            points: [sourceStation.coordinates, targetStation.coordinates],
          };
        }
        return {
            ...prevMap,
            railNetwork: {
                ...prevMap.railNetwork,
                tracks: [...prevMap.railNetwork.tracks, finalTrack]
            }
        }
    })
  }
  
    const updateTrack = (trackId: string, updates: Partial<EnhancedTrack>) => {
        setGameMap(prevMap => {
            if (!prevMap) return null;
            return {
                ...prevMap,
                railNetwork: {
                    ...prevMap.railNetwork,
                    tracks: prevMap.railNetwork.tracks.map(t => t.id === trackId ? {...t, ...updates} : t)
                }
            }
        })
    }
    
    const deleteTrack = (trackId: string) => {
        setGameMap(prevMap => {
            if (!prevMap) return null;
            return {
                ...prevMap,
                railNetwork: {
                    ...prevMap.railNetwork,
                    tracks: prevMap.railNetwork.tracks.filter(t => t.id !== trackId)
                }
            }
        });
        setSelectedTrackIds(prev => prev.filter(id => id !== trackId));
    }
    
    const updateMapMetadata = (updates: Partial<MapMetadata>) => {
        setGameMap(prevMap => {
            if (!prevMap) return null;
            return {
                ...prevMap,
                metadata: {
                    ...prevMap.metadata,
                    ...updates
                }
            }
        })
    }
    
    const updateGameSettings = (updates: Partial<GameSettings>) => {
        setGameMap(prevMap => {
            if (!prevMap) return null;
            return {
                ...prevMap,
                gameSettings: {
                    ...prevMap.gameSettings,
                    ...updates
                }
            }
        })
    }
    
    const updateAdminSettings = (updates: Partial<AdminSettings>) => {
        setGameMap(prevMap => {
            if (!prevMap) return null;
            return {
                ...prevMap,
                adminSettings: {
                    ...prevMap.adminSettings,
                    ...updates
                }
            }
        })
    }
    
    const updateBackground = (background: MapBackground | undefined) => {
        setGameMap(prevMap => {
            if (!prevMap) return null;
            return {
                ...prevMap,
                background
            }
        })
    }
    
    
  // --- SELECTION ACTIONS ---

    const selectStation = (stationId: string, multiSelect = false) => {
        if (multiSelect) {
            setSelectedStationIds(prev =>
                prev.includes(stationId)
                    ? prev.filter(id => id !== stationId)
                    : [...prev, stationId]
            );
        } else {
            setSelectedStationIds(
                selectedStationIds.length === 1 && selectedStationIds[0] === stationId
                    ? [] // Deselect if clicking the same one again
                    : [stationId]
            );
        }
    };
    
    const selectTrack = (trackId: string, multiSelect = false) => {
        if (multiSelect) {
            setSelectedTrackIds(prev =>
                prev.includes(trackId)
                    ? prev.filter(id => id !== trackId)
                    : [...prev, trackId]
            );
        } else {
            setSelectedTrackIds(
                selectedTrackIds.length === 1 && selectedTrackIds[0] === trackId
                    ? [] // Deselect if clicking the same one again
                    : [trackId]
            );
        }
    };

  const clearSelection = () => {
    setSelectedStationIds([]);
    setSelectedTrackIds([]);
  };
  
  
    // --- UTILITY GETTERS ---

    const getStationById = (id: string): EnhancedStation | undefined => {
        return gameMap?.railNetwork.stations.find(s => s.id === id);
    };

    const getTrackById = (id: string): EnhancedTrack | undefined => {
        return gameMap?.railNetwork.tracks.find(t => t.id === id);
    };

    // --- CAMERA FUNCTIONS ---
    
    const resetCamera = () => {
        if (resetCameraCallback) {
            resetCameraCallback();
        }
    };

    const registerResetCamera = (callback: () => void) => {
        setResetCameraCallback(() => callback);
    };


  // --- PROVIDER VALUE ---

  const value = {
    gameMap,
    selectedStationIds,
    selectedTrackIds,
    loadMap,
    createNewMap,
    addStation,
    updateStation,
    deleteStation,
    addTrack,
    updateTrack,
    deleteTrack,
    updateMapMetadata,
    updateGameSettings,
    updateAdminSettings,
    updateBackground,
    selectStation,
    selectTrack,
    clearSelection,
    getStationById,
    getTrackById,
    resetCamera,
    registerResetCamera
  };

  return (
    <MapEditorContext.Provider value={value}>
      {children}
    </MapEditorContext.Provider>
  );
};


// --- HOOK ---

export const useMapEditor = () => {
  const context = useContext(MapEditorContext);
  if (context === undefined) {
    throw new Error('useMapEditor must be used within a MapEditorProvider');
  }
  return context;
}; 