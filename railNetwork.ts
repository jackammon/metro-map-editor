/**
 * Rail Network Data Model for Transit Tag
 * 
 * Defines the core data structures for the rail network graph,
 * including stations, tracks, trains, and timetables.
 */

import { type TrainSpeedType } from '../constants/gameConstants';

// === CORE GRAPH STRUCTURES ===

/**
 * Station node in the rail network graph
 */
export interface Station {
  /** Unique identifier for the station */
  id: string;
  
  /** Display name of the station */
  name: string;
  
  /** Type of station affecting complexity and services */
  type: 'small' | 'medium' | 'large';
  
  /** World coordinates (in km from origin) */
  coordinates: {
    x: number;
    y: number;
  };
  
  /** Optional metadata */
  metadata?: {
    /** Population or importance factor */
    importance?: number;
    /** Available services (departures board, shops, etc.) */
    services?: string[];
    /** Platform count */
    platforms?: number;
  };
}

/**
 * Track edge in the rail network graph
 */
export interface Track {
  /** Unique identifier for the track */
  id: string;
  
  /** Source station ID */
  source: string;
  
  /** Target station ID */
  target: string;
  
  /** Distance in kilometers */
  distanceKm: number;
  
  /** Speed type for this track segment */
  speedType: TrainSpeedType;
  
  /** Track is bidirectional (trains can go both ways) */
  bidirectional: boolean;
  
  /** 
   * Explicit point array defining the track path (optional).
   * Points should be in world coordinates (km from origin).
   * 
   */
  points?: Array<{
    x: number;
    y: number;
  }>;
  
  /** Optional metadata */
  metadata?: {
    /** Track condition affecting delays */
    condition?: 'good' | 'fair' | 'poor';
    /** Scenic value for visual effects */
    scenic?: boolean;
    /** Electrified or diesel */
    electrified?: boolean;
  };
}

/**
 * Complete rail network graph
 */
export interface RailNetwork {
  /** Network metadata */
  metadata: {
    /** Network name */
    name: string;
    /** Creation timestamp */
    created: string;
    /** Seed used for generation */
    seed: number;
    /** Version for compatibility */
    version: string;
  };
  
  /** All stations in the network */
  stations: Station[];
  
  /** All tracks in the network */
  tracks: Track[];
  
  /** Adjacency helper for quick lookups */
  adjacency?: Map<string, string[]>;
}

// === TRAIN & MOVEMENT STRUCTURES ===

/**
 * Individual train instance
 */
export interface Train {
  /** Unique identifier for the train */
  id: string;
  
  /** Train number/name for display */
  number: string;
  
  /** Train type affecting speed and capacity */
  type: 'local' | 'express' | 'high_speed';
  
  /** Current route this train is following */
  currentRoute: string | null;
  
  /** Current position along the route (0-1) */
  routeProgress: number;
  
  /** Current station (if at station) */
  currentStation: string | null;
  
  /** Movement state */
  state: 'at_station' | 'in_transit' | 'delayed' | 'cancelled';
  
  /** Player association (if any) */
  playerType?: 'runner' | 'chaser' | null;
}

/**
 * Scheduled train service
 */
export interface TrainService {
  /** Unique identifier for the service */
  id: string;
  
  /** Service number/name */
  number: string;
  
  /** Train type */
  type: TrainSpeedType;
  
  /** Route this service follows */
  route: TrainRoute;
  
  /** Departure times from origin station */
  departures: number[]; // Simulation minutes from start
  
  /** Current delay in simulation minutes */
  delay: number;
  
  /** Service active flag */
  active: boolean;
}

/**
 * Train route definition
 */
export interface TrainRoute {
  /** Unique identifier for the route */
  id: string;
  
  /** Route name */
  name: string;
  
  /** Ordered list of station IDs */
  stations: string[];
  
  /** Ordered list of track IDs */
  tracks: string[];
  
  /** Total distance in km */
  totalDistance: number;
  
  /** Expected travel time in simulation minutes */
  totalTime: number;
  
  /** Route direction (for display) */
  direction: 'northbound' | 'southbound' | 'eastbound' | 'westbound' | 'circular';
}

// === TIMETABLE STRUCTURES ===

/**
 * Timetable entry for a specific train at a specific station
 */
export interface TimetableEntry {
  /** Service ID */
  serviceId: string;
  
  /** Train number */
  trainNumber: string;
  
  /** Station ID */
  stationId: string;
  
  /** Scheduled arrival time (simulation minutes) */
  scheduledArrival: number;
  
  /** Scheduled departure time (simulation minutes) */
  scheduledDeparture: number;
  
  /** Actual arrival time (with delays) */
  actualArrival: number;
  
  /** Actual departure time (with delays) */
  actualDeparture: number;
  
  /** Platform number */
  platform: number;
  
  /** Destination station */
  destination: string;
  
  /** Status */
  status: 'scheduled' | 'early' | 'on-time' | 'delayed' | 'cancelled' | 'arrived' | 'departed';
  
  /** Performance classification based on punctuality */
  performance?: 'early' | 'on-time' | 'late' | 'cancelled';
  
  /** Delay amount in minutes (positive for late, negative for early) */
  delayMinutes?: number;
}

/**
 * Complete timetable for all services
 */
export interface NetworkTimetable {
  /** Generation metadata */
  metadata: {
    /** Generation timestamp */
    generated: string;
    /** Seed used */
    seed: number;
    /** Simulation day */
    day: number;
  };
  
  /** All timetable entries */
  entries: TimetableEntry[];
  
  /** Quick lookup by station */
  byStation: Map<string, TimetableEntry[]>;
  
  /** Quick lookup by service */
  byService: Map<string, TimetableEntry[]>;
}

// === HELPER TYPES ===

/**
 * Position along a track
 */
export interface TrackPosition {
  /** Track ID */
  trackId: string;
  
  /** Position along track (0-1) */
  progress: number;
  
  /** World coordinates */
  worldPosition: {
    x: number;
    y: number;
  };
  
  /** Direction of travel */
  direction: 'forward' | 'backward';
}

/**
 * Station departure information
 */
export interface StationDeparture {
  /** Train number */
  trainNumber: string;
  
  /** Destination station name */
  destination: string;
  
  /** Departure time (simulation minutes) */
  departureTime: number;
  
  /** Platform number */
  platform: number;
  
  /** Status */
  status: 'on_time' | 'delayed' | 'cancelled';
  
  /** Delay in minutes (if any) */
  delay?: number;
}

/**
 * Network statistics for balancing
 */
export interface NetworkStats {
  /** Total stations */
  stationCount: number;
  
  /** Total tracks */
  trackCount: number;
  
  /** Average distance between stations */
  averageDistance: number;
  
  /** Network diameter (longest path) */
  diameter: number;
  
  /** Connectivity (average connections per station) */
  connectivity: number;
  
  /** Total network coverage area */
  coverage: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
}

// === VALIDATION TYPES ===

/**
 * Network validation result
 */
export interface NetworkValidation {
  /** Is network valid */
  isValid: boolean;
  
  /** Validation errors */
  errors: string[];
  
  /** Validation warnings */
  warnings: string[];
  
  /** Network statistics */
  stats: NetworkStats;
}

// === EXPORT TYPES ===

/**
 * Complete game world state
 */
export interface GameWorld {
  /** Rail network */
  network: RailNetwork;
  
  /** Current timetable */
  timetable: NetworkTimetable;
  
  /** Active trains */
  trains: Train[];
  
  /** Active services */
  services: TrainService[];
  
  /** Current simulation time */
  currentTime: number;
  
  /** Random seed */
  seed: number;
} 