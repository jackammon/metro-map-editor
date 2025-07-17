"use client";

import { GameMap } from '../types/metro-types';

const STORAGE_KEY = 'metroMapEditorData';

/**
 * Saves the entire GameMap object to localStorage.
 * @param data The GameMap object to save.
 */
export const saveToLocalStorage = (data: GameMap): void => {
  try {
    if (typeof window === 'undefined') return;
    
    const serializedData = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, serializedData);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Loads the GameMap object from localStorage.
 * @returns The loaded GameMap object, or null if no data is found or an error occurs.
 */
export const loadFromLocalStorage = (): GameMap | null => {
  try {
    if (typeof window === 'undefined') return null;
    
    const serializedData = localStorage.getItem(STORAGE_KEY);
    if (!serializedData) return null;
    
    // Here you might add more robust validation/migration logic in a real app
    const parsedData = JSON.parse(serializedData);
    
    // Basic check to see if it looks like our GameMap structure
    if (parsedData.id && parsedData.metadata && parsedData.railNetwork) {
      return parsedData as GameMap;
    }
    
    return null;

  } catch (error) {
    console.error('Error loading from localStorage:', error);
    // If parsing fails, remove the corrupted data
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

/**
 * Clears all saved map data from localStorage.
 */
export const clearLocalStorage = (): void => {
  try {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}; 