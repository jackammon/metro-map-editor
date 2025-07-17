/**
 * @fileoverview Map collection registry.
 * This file exports all available maps and defines the default map to be loaded.
 */

import { GameMap } from '@/lib/types/metro-types';
import { southKoreaMap } from './south-korea-map';

interface MapCollection {
  [key: string]: GameMap;
}

export const mapCollection: MapCollection = {
  'south-korea': southKoreaMap,
  // Add other maps here as they are created
};

export const defaultMapId = 'south-korea'; 