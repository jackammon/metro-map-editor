"use client";

import { MetroMapData } from '../types/metro-types';

const STORAGE_KEY = 'metroMapEditorData';

// Save metro map data to localStorage
export const saveToLocalStorage = (data: MetroMapData): void => {
  try {
    // Don't save on the server
    if (typeof window === 'undefined') return;
    
    const serializedData = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, serializedData);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Load metro map data from localStorage
export const loadFromLocalStorage = (): MetroMapData | null => {
  try {
    // Don't load on the server
    if (typeof window === 'undefined') return null;
    
    const serializedData = localStorage.getItem(STORAGE_KEY);
    if (!serializedData) return null;
    
    return JSON.parse(serializedData) as MetroMapData;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

// Clear saved data from localStorage
export const clearLocalStorage = (): void => {
  try {
    // Don't clear on the server
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}; 