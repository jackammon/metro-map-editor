/**
 * @fileoverview Provides functionality to export the GameMap object
 * as a TypeScript file.
 */

import { GameMap } from '../types/metro-types';
import { saveAs } from 'file-saver';

/**
 * Converts a JavaScript object into a TypeScript string representation.
 * This is a simplified version; a more robust solution might handle more edge cases.
 * @param obj The object to stringify.
 * @returns A string representation of the object.
 */
const objectToTsString = (obj: any): string => {
  // Using JSON.stringify with a replacer function for better formatting.
  // The 'null, 2' arguments add indentation for readability.
  return JSON.stringify(obj, null, 2);
};

/**
 * Generates the full content of the TypeScript file for a given GameMap.
 * @param gameMap The GameMap data to export.
 * @returns A string containing the TypeScript file content.
 */
const generateTsContent = (gameMap: GameMap): string => {
  const mapVariableName = gameMap.id.replace(/-/g, '_'); // e.g., 'south-korea' -> 'south_korea'
  
  const content = `
import { GameMap } from '@/lib/types/metro-types'; // Adjust this import path as needed

export const ${mapVariableName}: GameMap = ${objectToTsString(gameMap)};
`;
  
  return content.trim();
};

/**
 * Triggers a browser download for the generated TypeScript map file.
 * @param gameMap The GameMap data to export.
 */
export const exportMapToTypeScript = (gameMap: GameMap) => {
  if (!gameMap) {
    console.error("Export failed: No map data available.");
    return;
  }
  
  const tsContent = generateTsContent(gameMap);
  const blob = new Blob([tsContent], { type: 'application/typescript;charset=utf-8' });
  const fileName = `${gameMap.id}.ts`;
  
  saveAs(blob, fileName);
}; 