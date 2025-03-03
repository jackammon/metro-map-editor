"use client";

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import the MapCanvas component with no server-side rendering
const MapCanvasWithNoSSR = dynamic(
  () => import('./MapCanvas').then((mod) => mod.MapCanvas),
  { ssr: false } // Disable server-side rendering for this component
);

// This is a wrapper component that will be imported by the page
export const KonvaCanvas: React.FC = () => {
  return <MapCanvasWithNoSSR />;
}; 