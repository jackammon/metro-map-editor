"use client";

import React, { useState } from 'react';
import { useMapEditor } from '@/lib/context/map-editor-context';
import { EnhancedStation, StationType, TrainSpeedType } from '@/lib/types/metro-types';

interface StationCreatorProps {
  position: { x: number; y: number };
  onClose: () => void;
}

export const StationCreator: React.FC<StationCreatorProps> = ({ position, onClose }) => {
  const { addStation } = useMapEditor();
  const [name, setName] = useState('');
  const [id, setId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !name) {
        alert("Please provide both an ID and a Name.");
        return;
    };

    const newStation: EnhancedStation = {
      id,
      name,
      coordinates: position,
      type: 'small',
      importance: 50,
      platforms: 1,
      services: ['LOCAL'],
    };

    addStation(newStation);
    onClose();
  };

  return (
    <div
      className="absolute bg-white p-4 rounded-lg shadow-xl border"
      style={{ left: position.x, top: position.y }}
      onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <h4 className="font-bold">New Station</h4>
        <div>
          <label htmlFor="new-station-id" className="text-xs">ID</label>
          <input
            id="new-station-id"
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
            className="w-full border-gray-300 rounded-md shadow-sm p-1"
            autoFocus
          />
        </div>
        <div>
          <label htmlFor="new-station-name" className="text-xs">Name</label>
          <input
            id="new-station-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm p-1"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="text-xs px-2 py-1 rounded-md">Cancel</button>
          <button type="submit" className="text-xs bg-blue-500 text-white px-2 py-1 rounded-md">Create</button>
        </div>
      </form>
    </div>
  );
}; 