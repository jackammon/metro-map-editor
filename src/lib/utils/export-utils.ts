/**
 * @fileoverview Provides functionality to export the GameMap object
 * as a JSON file.
 */

import { GameMap } from '../types/metro-types';
import { saveAs } from 'file-saver';

/**
 * Converts the GameMap object to a formatted JSON string.
 * @param gameMap The GameMap data to export.
 * @returns A string containing the JSON file content.
 */
const generateJsonContent = (gameMap: GameMap): string => {
  // Note: This now includes track.points arrays and electrified flags as per game type migration.
  // Optional: Use a replacer to exclude editor-only fields like adminSettings.
  // const replacer = (key: string, value: any) => (key === 'adminSettings' ? undefined : value);
  return JSON.stringify(gameMap, null, 2); // Pretty-print with 2-space indentation
};

/**
 * Triggers a browser download for the generated JSON map file.
 * @param gameMap The GameMap data to export.
 */
export const exportMapToJson = (gameMap: GameMap) => {
  if (!gameMap) {
    console.error("Export failed: No map data available.");
    return;
  }
  
  const jsonContent = generateJsonContent(gameMap);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' });
  const fileName = `${gameMap.id}.json`;
  
  saveAs(blob, fileName);
}; 