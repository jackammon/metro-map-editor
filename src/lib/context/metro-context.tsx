"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Station, Line, WorldSettings, MetroMapData } from '../types/metro-types';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/storage-utils';

interface MetroContextType {
  stations: Station[];
  lines: Line[];
  worldSettings: WorldSettings;
  selectedStationIds: string[];
  activeLineId: string | null;
  
  // Station actions
  addStation: (station: Station) => void;
  updateStation: (station: Station) => void;
  deleteStation: (stationId: string) => void;
  selectStation: (stationId: string, multiSelect?: boolean) => void;
  clearSelectedStations: () => void;
  
  // Line actions
  addLine: (line: Line) => void;
  updateLine: (line: Line) => void;
  deleteLine: (lineId: string) => void;
  setActiveLine: (lineId: string | null) => void;
  addStationToLine: (lineId: string, stationId: string) => void;
  
  // World settings actions
  updateWorldSettings: (settings: Partial<WorldSettings>) => void;
  
  // Connection actions
  connectStations: (stationId1: string, stationId2: string) => void;
  
  // Export
  getMetroMapData: () => MetroMapData;
  
  // Storage
  resetToDefault: () => void;
}

const defaultWorldSettings: WorldSettings = {
  width: 1024,
  height: 768,
  backgroundImage: null,
};

const MetroContext = createContext<MetroContextType | undefined>(undefined);

export const MetroProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state with default values
  const [stations, setStations] = useState<Station[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [worldSettings, setWorldSettings] = useState<WorldSettings>(defaultWorldSettings);
  const [selectedStationIds, setSelectedStationIds] = useState<string[]>([]);
  const [activeLineId, setActiveLineId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = loadFromLocalStorage();
      if (savedData) {
        setStations(savedData.stations);
        setLines(savedData.lines);
        setWorldSettings(savedData.worldSettings);
      }
      setIsInitialized(true);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      const data = {
        stations,
        lines,
        worldSettings
      };
      saveToLocalStorage(data);
    }
  }, [stations, lines, worldSettings, isInitialized]);

  // Station actions
  const addStation = (station: Station) => {
    setStations(prev => [...prev, station]);
  };

  const updateStation = (updatedStation: Station) => {
    setStations(prev => 
      prev.map(station => 
        station.id === updatedStation.id ? updatedStation : station
      )
    );
  };

  const deleteStation = (stationId: string) => {
    // Remove station
    setStations(prev => prev.filter(station => station.id !== stationId));
    
    // Remove station from lines
    setLines(prev => 
      prev.map(line => ({
        ...line,
        stations: line.stations.filter(id => id !== stationId)
      }))
    );
    
    // Remove connections to this station
    setStations(prev => 
      prev.map(station => ({
        ...station,
        connections: station.connections.filter(id => id !== stationId)
      }))
    );
    
    // Remove from selected stations if present
    setSelectedStationIds(prev => prev.filter(id => id !== stationId));
  };

  const selectStation = (stationId: string, multiSelect = false) => {
    if (multiSelect) {
      setSelectedStationIds(prev => 
        prev.includes(stationId) 
          ? prev.filter(id => id !== stationId) 
          : [...prev, stationId]
      );
    } else {
      setSelectedStationIds([stationId]);
    }
  };

  const clearSelectedStations = () => {
    setSelectedStationIds([]);
  };

  // Line actions
  const addLine = (line: Line) => {
    setLines(prev => [...prev, line]);
    
    // Update stations to include this line
    if (line.stations.length > 0) {
      setStations(prev => 
        prev.map(station => 
          line.stations.includes(station.id) 
            ? { ...station, lines: [...station.lines, line.id] }
            : station
        )
      );
    }
  };

  const updateLine = (updatedLine: Line) => {
    const oldLine = lines.find(line => line.id === updatedLine.id);
    
    // Update the line
    setLines(prev => 
      prev.map(line => 
        line.id === updatedLine.id ? updatedLine : line
      )
    );
    
    // Update stations' line references
    if (oldLine) {
      // Stations to remove this line from
      const stationsToRemove = oldLine.stations.filter(
        stationId => !updatedLine.stations.includes(stationId)
      );
      
      // Stations to add this line to
      const stationsToAdd = updatedLine.stations.filter(
        stationId => !oldLine.stations.includes(stationId)
      );
      
      setStations(prev => 
        prev.map(station => {
          if (stationsToRemove.includes(station.id)) {
            return {
              ...station,
              lines: station.lines.filter(lineId => lineId !== updatedLine.id)
            };
          }
          if (stationsToAdd.includes(station.id)) {
            return {
              ...station,
              lines: [...station.lines, updatedLine.id]
            };
          }
          return station;
        })
      );
    }
  };

  const deleteLine = (lineId: string) => {
    // Remove line
    setLines(prev => prev.filter(line => line.id !== lineId));
    
    // Remove line from stations
    setStations(prev => 
      prev.map(station => ({
        ...station,
        lines: station.lines.filter(id => id !== lineId)
      }))
    );
    
    // Clear active line if it's the one being deleted
    if (activeLineId === lineId) {
      setActiveLineId(null);
    }
  };

  const setActiveLine = (lineId: string | null) => {
    setActiveLineId(lineId);
  };

  const addStationToLine = (lineId: string, stationId: string) => {
    // Add station to line
    setLines(prev => 
      prev.map(line => {
        if (line.id === lineId && !line.stations.includes(stationId)) {
          return {
            ...line,
            stations: [...line.stations, stationId]
          };
        }
        return line;
      })
    );
    
    // Add line to station
    setStations(prev => 
      prev.map(station => {
        if (station.id === stationId && !station.lines.includes(lineId)) {
          return {
            ...station,
            lines: [...station.lines, lineId],
            isInterchange: [...station.lines, lineId].length > 1
          };
        }
        return station;
      })
    );
  };

  // World settings actions
  const updateWorldSettings = (settings: Partial<WorldSettings>) => {
    setWorldSettings(prev => ({ ...prev, ...settings }));
  };

  // Connection actions
  const connectStations = (stationId1: string, stationId2: string) => {
    setStations(prev => 
      prev.map(station => {
        if (station.id === stationId1 && !station.connections.includes(stationId2)) {
          return {
            ...station,
            connections: [...station.connections, stationId2]
          };
        }
        if (station.id === stationId2 && !station.connections.includes(stationId1)) {
          return {
            ...station,
            connections: [...station.connections, stationId1]
          };
        }
        return station;
      })
    );
  };

  // Reset all data to default
  const resetToDefault = () => {
    setStations([]);
    setLines([]);
    setWorldSettings(defaultWorldSettings);
    setSelectedStationIds([]);
    setActiveLineId(null);
  };

  // Export data
  const getMetroMapData = (): MetroMapData => {
    return {
      stations,
      lines,
      worldSettings
    };
  };

  const value = {
    stations,
    lines,
    worldSettings,
    selectedStationIds,
    activeLineId,
    
    addStation,
    updateStation,
    deleteStation,
    selectStation,
    clearSelectedStations,
    
    addLine,
    updateLine,
    deleteLine,
    setActiveLine,
    addStationToLine,
    
    updateWorldSettings,
    
    connectStations,
    
    getMetroMapData,
    resetToDefault
  };

  return (
    <MetroContext.Provider value={value}>
      {children}
    </MetroContext.Provider>
  );
};

export const useMetro = () => {
  const context = useContext(MetroContext);
  if (context === undefined) {
    throw new Error('useMetro must be used within a MetroProvider');
  }
  return context;
}; 