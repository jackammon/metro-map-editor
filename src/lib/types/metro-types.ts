/**
 * @fileoverview Defines the core data structures for the metro map system,
 * based on the new `GameMap` schema. These types are used throughout the editor
 * for state management, component props, and data validation.
 */

// === ENUMERATIONS ===

export const StationType = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
} as const;
export type StationType = typeof StationType[keyof typeof StationType];

export const TrainSpeedType = {
  HIGH_SPEED: 'HIGH_SPEED',
  EXPRESS: 'EXPRESS',
  LOCAL: 'LOCAL',
} as const;
export type TrainSpeedType = typeof TrainSpeedType[keyof typeof TrainSpeedType];

export const TrackDirection = {
  NORTH: 'north',
  SOUTH: 'south',
  EAST: 'east',
  WEST: 'west',
  BOTH: 'both',
} as const;
export type TrackDirection = typeof TrackDirection[keyof typeof TrackDirection];

export const TrackCondition = {
  EXCELLENT: 'excellent',
  GOOD: 'good',
  FAIR: 'fair',
  POOR: 'poor',
} as const;
export type TrackCondition = typeof TrackCondition[keyof typeof TrackCondition];

export const PowerType = {
  ELECTRIC: 'electric',
  DIESEL: 'diesel',
  HYBRID: 'hybrid',
} as const;
export type PowerType = typeof PowerType[keyof typeof PowerType];


// === CORE INTERFACES ===

export interface Coordinates {
  x: number;
  y: number;
}

export interface EnhancedStation {
  id: string;
  name: string;
  type: StationType;
  coordinates: Coordinates;
  importance: number;
  platforms: number;
  services: TrainSpeedType[];
}

export interface CustomBezierPoints {
  p1: Coordinates;
  p2: Coordinates;
  isCustom: boolean;
}

export interface VisualStyle {
  color?: number;
  width?: number;
  alpha?: number;
  dashPattern?: number[];
}

export interface AdminTrackMetadata {
  notes?: string;
  lastModified?: string;
  modifiedBy?: string;
}

export interface EnhancedTrack {
  id: string;
  source: string;
  target: string;
  distanceKm: number;
  speedType: TrainSpeedType;
  bidirectional: boolean;
  direction: TrackDirection;
  condition: TrackCondition;
  powerType: PowerType;
  scenicValue: number;
  points?: Coordinates[];
  electrified?: boolean;
  visualStyle?: VisualStyle;
  adminMetadata?: AdminTrackMetadata;
}

export interface RailNetwork {
  stations: EnhancedStation[];
  tracks: EnhancedTrack[];
}

export interface MapBackground {
  imageUrl: string;
  width: number;
  height: number;
  scale?: number;
  offset?: Coordinates;
  metadata?: {
    filename?: string;
    fileSize?: number;
    uploaded?: string;
  };
}

export interface MapMetadata {
  name: string;
  region: string;
  description: string;
  created: string;
  version: string;
  seed: number;
  author?: string;
  tags?: string[];
}

export interface GameSettings {
  initialZoom?: number;
  centerPosition?: Coordinates;
  cameraConstraints?: {
    minZoom?: number;
    maxZoom?: number;
    bounds?: { x: number; y: number; width: number; height: number };
  };
  theme?: {
    backgroundColor?: number;
    trackStyles?: Record<string, any>;
    stationStyles?: Record<string, any>;
  };
}

export interface EditHistoryEntry {
  id: string;
  timestamp: string;
  operation: 'create' | 'update' | 'delete' | 'move';
  objectType: 'station' | 'track' | 'background' | 'map';
  objectId?: string;
  description: string;
  beforeState?: any;
  afterState?: any;
}

export interface AdminSettings {
  gridSnap?: {
    enabled: boolean;
    size: number;
  };
  layers?: {
    background: boolean;
    stations: boolean;
    tracks: boolean;
    grid: boolean;
  };
  editHistory?: EditHistoryEntry[];
}

export interface GameMap {
  id: string;
  metadata: MapMetadata;
  background?: MapBackground;
  railNetwork: RailNetwork;
  gameSettings?: GameSettings;
  adminSettings?: AdminSettings;
} 