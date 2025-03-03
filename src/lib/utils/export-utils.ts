"use client";

import Papa from 'papaparse';
import { MetroMapData, Station } from '../types/metro-types';

// Convert station data to CSV format
export const stationsToCSV = (stations: Station[]): string => {
  const csvData = stations.map(station => ({
    id: station.id,
    name: station.name,
    x: station.x,
    y: station.y,
    zone: station.zone,
    isInterchange: station.isInterchange ? 'true' : 'false',
    connections: JSON.stringify(station.connections),
    lines: JSON.stringify(station.lines)
  }));

  return Papa.unparse(csvData);
};

// Export the entire metro map data
export const exportMetroMapData = (data: MetroMapData): void => {
  const csvString = stationsToCSV(data.stations);
  
  // Create a blob and download link
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  // Create a temporary link and trigger download
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'metro_map_data.csv');
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}; 