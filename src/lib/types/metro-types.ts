export interface Station {
  id: string;
  name: string;
  x: number;
  y: number;
  zone: number;
  isInterchange: boolean;
  connections: string[]; // IDs of connected stations
  lines: string[]; // IDs of lines this station belongs to
}

export interface Line {
  id: string;
  name: string;
  color: string;
  stations: string[]; // IDs of stations in order
}

export interface CameraPosition {
  x: number;
  y: number;
  scale: number;
}

export interface WorldSettings {
  width: number;
  height: number;
  backgroundImage: string | null;
  cameraPosition?: CameraPosition; // Optional to maintain backward compatibility
}

export interface MetroMapData {
  stations: Station[];
  lines: Line[];
  worldSettings: WorldSettings;
} 