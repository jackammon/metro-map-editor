import type { GameMap } from '../../types/mapSystem';

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
      {
        id: "dongdaegu",
        name: "DONGDAEGU",
        type: "large",
        coordinates: { x: 450, y: 300 },
        importance: 90,
        platforms: 6,
        services: ["HIGH_SPEED", "EXPRESS"]
      },
      {
        id: "osong",
        name: "OSONG",
        type: "large",
        coordinates: { x: 100, y: 50 },
        importance: 85,
        platforms: 4,
        services: ["HIGH_SPEED", "EXPRESS"]
      },
      {
        id: "sangbong",
        name: "SANGBONG",
        type: "medium",
        coordinates: { x: 0, y: -150 },
        importance: 60,
        platforms: 3,
        services: ["EXPRESS", "LOCAL"]
      },
      {
        id: "pyeongtaek",
        name: "PYEONGTAEK",
        type: "medium",
        coordinates: { x: -50, y: 100 },
        importance: 65,
        platforms: 3,
        services: ["EXPRESS", "LOCAL"]
      },
      {
        id: "cheonan",
        name: "CHEONAN",
        type: "medium",
        coordinates: { x: 0, y: 150 },
        importance: 60,
        platforms: 3,
        services: ["EXPRESS", "LOCAL"]
      },
      {
        id: "jochiwon",
        name: "JOCHIWON",
        type: "medium",
        coordinates: { x: 50, y: 200 },
        importance: 50,
        platforms: 2,
        services: ["EXPRESS"]
      },
      {
        id: "iksan",
        name: "IKSAN",
        type: "medium",
        coordinates: { x: -200, y: 350 },
        importance: 70,
        platforms: 3,
        services: ["HIGH_SPEED", "LOCAL"]
      },
      {
        id: "gimcheon",
        name: "GIMCHEON",
        type: "medium",
        coordinates: { x: 300, y: 250 },
        importance: 55,
        platforms: 2,
        services: ["EXPRESS"]
      },
      {
        id: "andong",
        name: "ANDONG",
        type: "medium",
        coordinates: { x: 400, y: 100 },
        importance: 55,
        platforms: 2,
        services: ["EXPRESS", "LOCAL"]
      },
      {
        id: "yeongju",
        name: "YEONGJU",
        type: "medium",
        coordinates: { x: 350, y: 50 },
        importance: 50,
        platforms: 2,
        services: ["EXPRESS", "LOCAL"]
      },
      {
        id: "jecheon",
        name: "JECHEON",
        type: "medium",
        coordinates: { x: 200, y: 0 },
        importance: 50,
        platforms: 2,
        services: ["EXPRESS", "LOCAL"]
      },
      {
        id: "chungju",
        name: "CHUNGJU",
        type: "medium",
        coordinates: { x: 250, y: 50 },
        importance: 45,
        platforms: 2,
        services: ["LOCAL"]
      },
      {
        id: "donghae",
        name: "DONGHAE",
        type: "medium",
        coordinates: { x: 500, y: -100 },
        importance: 45,
        platforms: 2,
        services: ["LOCAL"]
      },
      {
        id: "jeongdongjin",
        name: "JEONGDONGJIN",
        type: "medium",
        coordinates: { x: 550, y: -50 },
        importance: 40,
        platforms: 2,
        services: ["LOCAL"]
      },
      {
        id: "gwangju_songjeong",
        name: "GWANGJU SONGJEONG",
        type: "medium",
        coordinates: { x: -300, y: 450 },
        importance: 75,
        platforms: 3,
        services: ["HIGH_SPEED", "LOCAL"]
      },
      {
        id: "suncheon",
        name: "SUNCHEON",
        type: "medium",
        coordinates: { x: -150, y: 500 },
        importance: 55,
        platforms: 2,
        services: ["LOCAL"]
      },
      {
        id: "sasang",
        name: "SASANG",
        type: "medium",
        coordinates: { x: 550, y: 400 },
        importance: 60,
        platforms: 3,
        services: ["EXPRESS"]
      },
      {
        id: "seogyeongju",
        name: "SEOGYEONGJU",
        type: "medium",
        coordinates: { x: 500, y: 350 },
        importance: 50,
        platforms: 2,
        services: ["EXPRESS"]
      },
      {
        id: "gyeongju",
        name: "GYEONGJU",
        type: "medium",
        coordinates: { x: 520, y: 370 },
        importance: 50,
        platforms: 2,
        services: ["EXPRESS"]
      },
      {
        id: "anjung",
        name: "ANJUNG",
        type: "small",
        coordinates: { x: -150, y: 0 },
        importance: 30,
        platforms: 1,
        services: ["LOCAL"]
      },
      {
        id: "seowunju",
        name: "SEOWUNJU",
        type: "small",
        coordinates: { x: 150, y: -100 },
        importance: 30,
        platforms: 1,
        services: ["LOCAL"]
      },
      {
        id: "bongpyeong",
        name: "BONGPYEONG",
        type: "small",
        coordinates: { x: 100, y: -50 },
        importance: 25,
        platforms: 1,
        services: ["LOCAL"]
      },
      {
        id: "dongbaeksan",
        name: "DONGBAEKSAN",
        type: "small",
        coordinates: { x: 350, y: -100 },
        importance: 25,
        platforms: 1,
        services: ["LOCAL"]
      },
      {
        id: "jinbu",
        name: "JINBU",
        type: "small",
        coordinates: { x: 300, y: -150 },
        importance: 25,
        platforms: 1,
        services: ["LOCAL"]
      },
      {
        id: "hongseong",
        name: "HONGSEONG",
        type: "small",
        coordinates: { x: -100, y: 250 },
        importance: 30,
        platforms: 1,
        services: ["LOCAL"]
      },
      {
        id: "jeongeup",
        name: "JEONGEUP",
        type: "small",
        coordinates: { x: -250, y: 400 },
        importance: 30,
        platforms: 1,
        services: ["LOCAL"]
      },
      {
        id: "yeosu_expo",
        name: "YEOSU EXPO",
        type: "small",
        coordinates: { x: -100, y: 550 },
        importance: 35,
        platforms: 1,
        services: ["LOCAL"]
      },
      {
        id: "samnangjin",
        name: "SAMNANGJIN",
        type: "small",
        coordinates: { x: 400, y: 450 },
        importance: 25,
        platforms: 1,
        services: ["LOCAL"]
      }
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
      {
        id: "osong-dongdaegu",
        source: "osong",
        target: "dongdaegu",
        distanceKm: 180,
        speedType: "HIGH_SPEED",
        bidirectional: true,
        direction: "both",
        condition: "excellent",
        powerType: "electric",
        scenicValue: 70
      },
      {
        id: "dongdaegu-busan",
        source: "dongdaegu",
        target: "busan",
        distanceKm: 90,
        speedType: "HIGH_SPEED",
        bidirectional: true,
        direction: "both",
        condition: "excellent",
        powerType: "electric",
        scenicValue: 75
      },
      {
        id: "osong-iksan",
        source: "osong",
        target: "iksan",
        distanceKm: 140,
        speedType: "HIGH_SPEED",
        bidirectional: true,
        direction: "both",
        condition: "excellent",
        powerType: "electric",
        scenicValue: 65
      },
      {
        id: "iksan-gwangju_songjeong",
        source: "iksan",
        target: "gwangju_songjeong",
        distanceKm: 85,
        speedType: "HIGH_SPEED",
        bidirectional: true,
        direction: "both",
        condition: "excellent",
        powerType: "electric",
        scenicValue: 70
      },
      {
        id: "yongsan-sangbong",
        source: "yongsan",
        target: "sangbong",
        distanceKm: 25,
        speedType: "EXPRESS",
        bidirectional: true,
        direction: "both",
        condition: "good",
        powerType: "electric",
        scenicValue: 40
      },
      {
        id: "yongsan-pyeongtaek",
        source: "yongsan",
        target: "pyeongtaek",
        distanceKm: 45,
        speedType: "EXPRESS",
        bidirectional: true,
        direction: "both",
        condition: "good",
        powerType: "electric",
        scenicValue: 45
      },
      {
        id: "pyeongtaek-cheonan",
        source: "pyeongtaek",
        target: "cheonan",
        distanceKm: 35,
        speedType: "EXPRESS",
        bidirectional: true,
        direction: "both",
        condition: "good",
        powerType: "electric",
        scenicValue: 50
      },
      {
        id: "cheonan-osong",
        source: "cheonan",
        target: "osong",
        distanceKm: 40,
        speedType: "EXPRESS",
        bidirectional: true,
        direction: "both",
        condition: "good",
        powerType: "electric",
        scenicValue: 55
      },
      {
        id: "osong-jochiwon",
        source: "osong",
        target: "jochiwon",
        distanceKm: 25,
        speedType: "EXPRESS",
        bidirectional: true,
        direction: "both",
        condition: "good",
        powerType: "electric",
        scenicValue: 45
      },
      {
        id: "dongdaegu-gimcheon",
        source: "dongdaegu",
        target: "gimcheon",
        distanceKm: 60,
        speedType: "EXPRESS",
        bidirectional: true,
        direction: "both",
        condition: "good",
        powerType: "electric",
        scenicValue: 60
      },
      {
        id: "gimcheon-andong",
        source: "gimcheon",
        target: "andong",
        distanceKm: 75,
        speedType: "EXPRESS",
        bidirectional: true,
        direction: "both",
        condition: "good",
        powerType: "electric",
        scenicValue: 70
      },
      {
        id: "andong-yeongju",
        source: "andong",
        target: "yeongju",
        distanceKm: 45,
        speedType: "EXPRESS",
        bidirectional: true,
        direction: "both",
        condition: "good",
        powerType: "electric",
        scenicValue: 75
      },
      {
        id: "dongdaegu-seogyeongju",
        source: "dongdaegu",
        target: "seogyeongju",
        distanceKm: 35,
        speedType: "EXPRESS",
        bidirectional: true,
        direction: "both",
        condition: "good",
        powerType: "electric",
        scenicValue: 65
      },
      {
        id: "seogyeongju-gyeongju",
        source: "seogyeongju",
        target: "gyeongju",
        distanceKm: 15,
        speedType: "EXPRESS",
        bidirectional: true,
        direction: "both",
        condition: "good",
        powerType: "electric",
        scenicValue: 80
      },
      {
        id: "busan-sasang",
        source: "busan",
        target: "sasang",
        distanceKm: 20,
        speedType: "EXPRESS",
        bidirectional: true,
        direction: "both",
        condition: "good",
        powerType: "electric",
        scenicValue: 40
      },
      {
        id: "yongsan-anjung",
        source: "yongsan",
        target: "anjung",
        distanceKm: 30,
        speedType: "LOCAL",
        bidirectional: true,
        direction: "both",
        condition: "fair",
        powerType: "electric",
        scenicValue: 30
      },
      {
        id: "sangbong-seowunju",
        source: "sangbong",
        target: "seowunju",
        distanceKm: 35,
        speedType: "LOCAL",
        bidirectional: true,
        direction: "both",
        condition: "fair",
        powerType: "electric",
        scenicValue: 40
      },
      {
        id: "seowunju-bongpyeong",
        source: "seowunju",
        target: "bongpyeong",
        distanceKm: 25,
        speedType: "LOCAL",
        bidirectional: true,
        direction: "both",
        condition: "fair",
        powerType: "electric",
        scenicValue: 50
      },
      {
        id: "bongpyeong-jecheon",
        source: "bongpyeong",
        target: "jecheon",
        distanceKm: 40,
        speedType: "LOCAL",
        bidirectional: true,
        direction: "both",
        condition: "fair",
        powerType: "electric",
        scenicValue: 60
      },
      {
        id: "jecheon-chungju",
        source: "jecheon",
        target: "chungju",
        distanceKm: 30,
        speedType: "LOCAL",
        bidirectional: true,
        direction: "both",
        condition: "fair",
        powerType: "electric",
        scenicValue: 65
      },
      {
        id: "chungju-yeongju",
        source: "chungju",
        target: "yeongju",
        distanceKm: 45,
        speedType: "LOCAL",
        bidirectional: true,
        direction: "both",
        condition: "fair",
        powerType: "electric",
        scenicValue: 70
      },
      {
        id: "yeongju-dongbaeksan",
        source: "yeongju",
        target: "dongbaeksan",
        distanceKm: 35,
        speedType: "LOCAL",
        bidirectional: true,
        direction: "both",
        condition: "fair",
        powerType: "electric",
        scenicValue: 75
      },
      {
        id: "dongbaeksan-jinbu",
        source: "dongbaeksan",
        target: "jinbu",
        distanceKm: 25,
        speedType: "LOCAL",
        bidirectional: true,
        direction: "both",
        condition: "fair",
        powerType: "electric",
        scenicValue: 80
      },
      {
        id: "jinbu-jeongdongjin",
        source: "jinbu",
        target: "jeongdongjin",
        distanceKm: 40,
        speedType: "LOCAL",
        bidirectional: true,
        direction: "both",
        condition: "fair",
        powerType: "electric",
        scenicValue: 85
      },
      {
        id: "jeongdongjin-donghae",
        source: "jeongdongjin",
        target: "donghae",
        distanceKm: 15,
        speedType: "LOCAL",
        bidirectional: true,
        direction: "both",
        condition: "fair",
        powerType: "electric",
        scenicValue: 90
      },
      {
        id: "cheonan-hongseong",
        source: "cheonan",
        target: "hongseong",
        distanceKm: 35,
        speedType: "LOCAL",
        bidirectional: true,
        direction: "both",
        condition: "fair",
        powerType: "electric",
        scenicValue: 45
      },
      {
        id: "iksan-jeongeup",
        source: "iksan",
        target: "jeongeup",
        distanceKm: 40,
        speedType: "LOCAL",
        bidirectional: true,
        direction: "both",
        condition: "fair",
        powerType: "electric",
        scenicValue: 50
      },
      {
        id: "gwangju_songjeong-suncheon",
        source: "gwangju_songjeong",
        target: "suncheon",
        distanceKm: 75,
        speedType: "LOCAL",
        bidirectional: true,
        direction: "both",
        condition: "fair",
        powerType: "electric",
        scenicValue: 70
      },
      {
        id: "suncheon-yeosu_expo",
        source: "suncheon",
        target: "yeosu_expo",
        distanceKm: 30,
        speedType: "LOCAL",
        bidirectional: true,
        direction: "both",
        condition: "good",
        powerType: "electric",
        scenicValue: 85
      },
      {
        id: "suncheon-samnangjin",
        source: "suncheon",
        target: "samnangjin",
        distanceKm: 120,
        speedType: "LOCAL",
        bidirectional: true,
        direction: "both",
        condition: "fair",
        powerType: "electric",
        scenicValue: 60
      },
      {
        id: "samnangjin-busan",
        source: "samnangjin",
        target: "busan",
        distanceKm: 45,
        speedType: "LOCAL",
        bidirectional: true,
        direction: "both",
        condition: "good",
        powerType: "electric",
        scenicValue: 55
      },
      {
        id: "anjung-hongseong",
        source: "anjung",
        target: "hongseong",
        distanceKm: 50,
        speedType: "LOCAL",
        bidirectional: true,
        direction: "both",
        condition: "fair",
        powerType: "electric",
        scenicValue: 40
      },
      {
        id: "osong-jecheon",
        source: "osong",
        target: "jecheon",
        distanceKm: 80,
        speedType: "EXPRESS",
        bidirectional: true,
        direction: "both",
        condition: "good",
        powerType: "electric",
        scenicValue: 65
      }
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