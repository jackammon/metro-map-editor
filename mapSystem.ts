/**
 * Enhanced Map System Types for Multi-Map Support
 * 
 * Extends the existing rail network types to support multiple maps,
 * background images, custom bezier curves, and admin tool functionality.
 */

import { type Station, type Track, type RailNetwork } from './railNetwork';
import { type TrainSpeedType } from '../constants/gameConstants';

// === ENHANCED INTERFACES ===

/**
 * Enhanced station with required metadata properties
 */
export interface EnhancedStation extends Station {
  /** Required importance factor (0-100) */
  importance: number;
  /** Number of platforms */
  platforms: number;
  /** Available service types */
  services: TrainSpeedType[];
}



/**
 * Enhanced rail network with typed stations and tracks
 */
export interface EnhancedRailNetwork {
  stations: EnhancedStation[];
  tracks: EnhancedTrack[];
}

// === BACKGROUND IMAGE SYSTEM ===

/**
 * Background image configuration for a map
 */
export interface MapBackground {
  /** URL or path to the background image */
  imageUrl: string;
  
  /** Original image dimensions */
  width: number;
  height: number;
  
  /** Scale factor for the image (default: 1.0) */
  scale?: number;
  
  /** Offset position for the background */
  offset?: {
    x: number;
    y: number;
  };
  
  /** Image metadata */
  metadata?: {
    /** Original filename */
    filename?: string;
    /** File size in bytes */
    fileSize?: number;
    /** Upload timestamp */
    uploaded?: string;
  };
}

// === ENHANCED BEZIER SYSTEM ===

/**
 * Custom bezier control points for track curves
 */
export interface CustomBezierPoints {
  /** First control point */
  p1: { x: number; y: number };
  
  /** Second control point */
  p2: { x: number; y: number };
  
  /** Whether these are custom points (false = use auto-generation) */
  isCustom: boolean;
}

/**
 * Enhanced track with custom bezier and visual styling support
 */
export interface EnhancedTrack extends Track {
  /** Directional information */
  direction: 'north' | 'south' | 'east' | 'west' | 'both';
  /** Track condition */
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  /** Power system type */
  powerType: 'electric' | 'diesel' | 'hybrid';
  /** Scenic value (0-100) */
  scenicValue: number;
  /** Custom bezier control points (optional) */
  customBezier?: CustomBezierPoints;
  
  /** Visual styling overrides */
  visualStyle?: {
    /** Track color override */
    color?: number;
    /** Track width override */
    width?: number;
    /** Track opacity */
    alpha?: number;
    /** Custom dash pattern */
    dashPattern?: number[];
  };
  
  /** Additional metadata for admin tool */
  adminMetadata?: {
    /** Track notes */
    notes?: string;
    /** Last modified timestamp */
    lastModified?: string;
    /** Modified by user */
    modifiedBy?: string;
  };
}

// === MAP SYSTEM ===

/**
 * Complete game map definition
 */
export interface GameMap {
  /** Unique identifier for the map */
  id: string;
  
  /** Map metadata */
  metadata: {
    /** Display name */
    name: string;
    /** Geographic region */
    region: string;
    /** Map description */
    description: string;
    /** Creation timestamp */
    created: string;
    /** Map version */
    version: string;
    /** Random seed for consistent generation */
    seed: number;
    /** Author/creator information */
    author?: string;
    /** Tags for categorization */
    tags?: string[];
  };
  
  /** Background image (optional) */
  background?: MapBackground;
  
  /** Enhanced rail network with custom features */
  railNetwork: {
    /** All stations in the network */
    stations: EnhancedStation[];
    /** All tracks with enhanced features */
    tracks: EnhancedTrack[];
  };
  
  /** Game-specific settings for this map */
  gameSettings?: {
    /** Initial camera zoom level */
    initialZoom?: number;
    /** Initial camera center position */
    centerPosition?: { x: number; y: number };
    /** Camera movement constraints */
    cameraConstraints?: {
      minZoom?: number;
      maxZoom?: number;
      bounds?: { x: number; y: number; width: number; height: number };
    };
    /** Map-specific visual theme */
    theme?: {
      backgroundColor?: number;
      trackStyles?: Record<string, any>;
      stationStyles?: Record<string, any>;
    };
  };
  
  /** Admin tool metadata */
  adminSettings?: {
    /** Grid snap settings */
    gridSnap?: {
      enabled: boolean;
      size: number;
    };
    /** Layer visibility */
    layers?: {
      background: boolean;
      stations: boolean;
      tracks: boolean;
      grid: boolean;
    };
    /** Editing history */
    editHistory?: EditHistoryEntry[];
  };
}

/**
 * Collection of multiple maps
 */
export interface MapCollection {
  /** All available maps */
  maps: GameMap[];
  
  /** Default map to load on startup */
  defaultMapId: string;
  
  /** Collection version */
  version?: string;
  
  /** Last updated timestamp */
  lastUpdated?: string;
  
  /** Collection metadata */
  metadata?: {
    /** Collection name */
    name?: string;
    /** Collection version */
    version?: string;
    /** Last updated */
    updated?: string;
  };
}

// === VALIDATION SYSTEM ===

/**
 * Map validation error
 */
export interface ValidationError {
  /** Error severity */
  severity: 'error' | 'warning' | 'info';
  
  /** Error message */
  message: string;
  
  /** Error category */
  category: 'station' | 'track' | 'network' | 'background' | 'metadata';
  
  /** Related object ID (station/track) */
  relatedId?: string;
  
  /** Suggested fix */
  suggestion?: string;
}

/**
 * Complete map validation result
 */
export interface MapValidationResult {
  /** Is the map valid */
  isValid: boolean;
  
  /** All validation errors and warnings */
  errors: ValidationError[];
  
  /** Validation statistics */
  stats: {
    /** Total stations */
    stationCount: number;
    /** Total tracks */
    trackCount: number;
    /** Connected components */
    components: number;
    /** Average connectivity */
    avgConnectivity: number;
  };
  
  /** Validation timestamp */
  timestamp: string;
}

// === ADMIN TOOL TYPES ===

/**
 * Edit history entry for undo/redo functionality
 */
export interface EditHistoryEntry {
  /** Unique ID for this edit */
  id: string;
  
  /** Timestamp of the edit */
  timestamp: string;
  
  /** Type of operation */
  operation: 'create' | 'update' | 'delete' | 'move';
  
  /** Object type that was modified */
  objectType: 'station' | 'track' | 'background' | 'map';
  
  /** Object ID (if applicable) */
  objectId?: string;
  
  /** Description of the change */
  description: string;
  
  /** Before state (for undo) */
  beforeState?: any;
  
  /** After state (for redo) */
  afterState?: any;
}

/**
 * Admin tool state
 */
export interface AdminToolState {
  /** Current editing mode */
  mode: 'select' | 'station_placement' | 'track_creation' | 'bezier_editing' | 'background_editing';
  
  /** Currently selected objects */
  selection: {
    stations: string[];
    tracks: string[];
    background: boolean;
  };
  
  /** Tool settings */
  settings: {
    /** Snap to grid */
    snapToGrid: boolean;
    /** Grid size */
    gridSize: number;
    /** Show guidelines */
    showGuidelines: boolean;
    /** Auto-connect stations */
    autoConnect: boolean;
  };
  
  /** Current clipboard */
  clipboard?: {
    type: 'station' | 'track' | 'selection';
    data: any;
  };
}

// === EXPORT/IMPORT TYPES ===

/**
 * Map export format
 */
export interface MapExport {
  /** Format version */
  formatVersion: string;
  
  /** Export timestamp */
  exported: string;
  
  /** Exported by */
  exportedBy?: string;
  
  /** The map data */
  map: GameMap;
  
  /** Additional export metadata */
  metadata?: {
    /** Original file path */
    originalPath?: string;
    /** Export settings used */
    exportSettings?: any;
  };
}

/**
 * Import result
 */
export interface MapImportResult {
  /** Was import successful */
  success: boolean;
  
  /** Imported map (if successful) */
  map?: GameMap;
  
  /** Import errors */
  errors: string[];
  
  /** Import warnings */
  warnings: string[];
  
  /** Validation result */
  validation?: MapValidationResult;
}

// === TEMPLATE TYPES ===

/**
 * Map template for quick creation
 */
export interface MapTemplate {
  /** Template ID */
  id: string;
  
  /** Template name */
  name: string;
  
  /** Template description */
  description: string;
  
  /** Template category */
  category: 'urban' | 'rural' | 'island' | 'mountain' | 'custom';
  
  /** Default map structure */
  template: Partial<GameMap>;
  
  /** Preview image */
  preview?: string;
}

// === UTILITY TYPES ===

/**
 * Position with optional z-index for layering
 */
export interface LayeredPosition {
  x: number;
  y: number;
  z?: number;
}

/**
 * Bounds rectangle
 */
export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Transform matrix for positioning and scaling
 */
export interface Transform {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
}

// === RE-EXPORTS ===

// Re-export original types for convenience
export type {
  Station,
  Track,
  RailNetwork,
  Train,
  TrainService,
  TrainRoute,
  TimetableEntry,
  NetworkTimetable,
  TrackPosition,
  StationDeparture,
  NetworkStats,
  NetworkValidation,
  GameWorld
} from './railNetwork'; 