/**
 * @fileoverview Provides validation functions for the GameMap data structure.
 * These functions check for common errors like duplicate IDs, broken track links,
 * and network connectivity issues.
 */

import { GameMap, EnhancedStation, EnhancedTrack } from '../types/metro-types';

export interface ValidationError {
  severity: 'error' | 'warning' | 'info';
  message: string;
  category: 'station' | 'track' | 'network' | 'metadata';
  relatedId?: string;
}

export const validateMap = (gameMap: GameMap): ValidationError[] => {
  const errors: ValidationError[] = [];
  const { stations, tracks } = gameMap.railNetwork;

  // --- Station Validations ---
  const stationIds = new Set<string>();
  stations.forEach(station => {
    // Check for duplicate station IDs
    if (stationIds.has(station.id)) {
      errors.push({
        severity: 'error',
        message: `Duplicate station ID: "${station.id}"`,
        category: 'station',
        relatedId: station.id,
      });
    }
    stationIds.add(station.id);
    
    // Check for missing station names
    if (!station.name) {
        errors.push({
            severity: 'warning',
            message: `Station is missing a name.`,
            category: 'station',
            relatedId: station.id
        })
    }
  });

  // --- Track Validations ---
  const trackIds = new Set<string>();
  const stationMap = new Map(stations.map(s => [s.id, s]));
  tracks.forEach(track => {
    // Check for duplicate track IDs
    if (trackIds.has(track.id)) {
      errors.push({
        severity: 'error',
        message: `Duplicate track ID: "${track.id}"`,
        category: 'track',
        relatedId: track.id,
      });
    }
    trackIds.add(track.id);

    // Check if source and target stations exist
    if (!stationIds.has(track.source)) {
      errors.push({
        severity: 'error',
        message: `Track "${track.id}" references non-existent source station "${track.source}"`,
        category: 'track',
        relatedId: track.id,
      });
    }
    if (!stationIds.has(track.target)) {
      errors.push({
        severity: 'error',
        message: `Track "${track.id}" references non-existent target station "${track.target}"`,
        category: 'track',
        relatedId: track.id,
      });
    }
    
    // Check for tracks connecting a station to itself
    if (track.source === track.target) {
        errors.push({
            severity: 'error',
            message: `Track "${track.id}" connects a station to itself.`,
            category: 'track',
            relatedId: track.id
        })
    }

    // Validate points if present
    if (track.points && track.points.length > 0) {
      if (track.points.length < 2) {
        errors.push({
          severity: 'error',
          message: `Track "${track.id}" has points array with fewer than 2 points.`,
          category: 'track',
          relatedId: track.id,
        });
      }
      const sourceStation = stationMap.get(track.source);
      const targetStation = stationMap.get(track.target);
      if (sourceStation && targetStation) {
        const firstPoint = track.points[0];
        const lastPoint = track.points[track.points.length - 1];
        if (firstPoint.x !== sourceStation.coordinates.x || firstPoint.y !== sourceStation.coordinates.y) {
          errors.push({
            severity: 'warning',
            message: `Track "${track.id}" first point does not match source station coordinates.`,
            category: 'track',
            relatedId: track.id,
          });
        }
        if (lastPoint.x !== targetStation.coordinates.x || lastPoint.y !== targetStation.coordinates.y) {
          errors.push({
            severity: 'warning',
            message: `Track "${track.id}" last point does not match target station coordinates.`,
            category: 'track',
            relatedId: track.id,
          });
        }
      }
      track.points.forEach((p, index) => {
        if (typeof p.x !== 'number' || isNaN(p.x) || typeof p.y !== 'number' || isNaN(p.y)) {
          errors.push({
            severity: 'error',
            message: `Track "${track.id}" has invalid point at index ${index} (non-number or NaN).`,
            category: 'track',
            relatedId: track.id,
          });
        }
      });
    }
  });
  
    // --- Network Connectivity ---
    if (stations.length > 0) {
        const connectedComponents = findConnectedComponents(stations, tracks);
        if(connectedComponents.length > 1) {
            errors.push({
                severity: 'warning',
                message: `The rail network is disjointed, consisting of ${connectedComponents.length} separate sub-networks.`,
                category: 'network'
            })
        }
    }


  return errors;
};


/**
 * Uses a Breadth-First Search (BFS) or Depth-First Search (DFS) to find all connected components in the rail network.
 * This helps identify "islands" of stations that are not connected to the main network.
 */
const findConnectedComponents = (stations: EnhancedStation[], tracks: EnhancedTrack[]): EnhancedStation[][] => {
    const adjList = new Map<string, string[]>();
    stations.forEach(s => adjList.set(s.id, []));
    tracks.forEach(t => {
        adjList.get(t.source)?.push(t.target);
        adjList.get(t.target)?.push(t.source);
    });
    
    const visited = new Set<string>();
    const components: EnhancedStation[][] = [];

    stations.forEach(station => {
        if (!visited.has(station.id)) {
            const currentComponent: EnhancedStation[] = [];
            const stack = [station];
            visited.add(station.id);
            
            while (stack.length > 0) {
                const u = stack.pop()!;
                const stationData = stations.find(s => s.id === u.id);
                if(stationData) currentComponent.push(stationData);

                adjList.get(u.id)?.forEach(v_id => {
                    if (!visited.has(v_id)) {
                        visited.add(v_id);
                        const v_station = stations.find(s => s.id === v_id);
                        if(v_station) stack.push(v_station);
                    }
                });
            }
            components.push(currentComponent);
        }
    });

    return components;
} 