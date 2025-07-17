import { GameMap } from '@/lib/types/metro-types';

export const southKoreaMap: GameMap = {
  id: "south-korea",
  metadata: {
    name: "South Korean Rail Network",
    region: "South Korea",
    description: "Complete rail network of South Korea featuring KTX high-speed lines, express regional services, and local branch lines connecting 29 major stations across the country.",
    created: "2024-01-01T00:00:00.000Z",
    version: "2.0",
    seed: 12345,
    author: "Transit Tag Development Team"
  },
  railNetwork: {
    stations: [
      {
        id: "yongsan",
        name: "YONGSAN",
        type: "large",
        coordinates: { x: -100, y: -50 },
        importance: 100,
        platforms: 8,
        services: ["HIGH_SPEED", "EXPRESS", "LOCAL"]
      },
      {
        id: "busan",
        name: "BUSAN",
        type: "large",
        coordinates: { x: 600, y: 450 },
        importance: 95,
        platforms: 6,
        services: ["HIGH_SPEED", "EXPRESS", "LOCAL"]
      },
      // ... Add all other stations from the example
    ],
    tracks: [
      {
        id: "yongsan-osong",
        source: "yongsan",
        target: "osong",
        distanceKm: 120,
        speedType: "HIGH_SPEED",
        bidirectional: true,
        direction: "both",
        condition: "excellent",
        powerType: "electric",
        scenicValue: 60
      },
      // ... Add all other tracks from the example
    ]
  },
  gameSettings: {
    initialZoom: 1.0,
    centerPosition: { x: 200, y: 200 },
    cameraConstraints: {
      minZoom: 0.3,
      maxZoom: 2.5,
      bounds: { x: -400, y: -300, width: 1200, height: 1000 }
    }
  }
}; 