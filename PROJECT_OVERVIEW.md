# Metro Map Editor – Project Overview

## 1. Project Purpose

This repository hosts **Metro Map Editor**, a standalone, web-based tool for designing, validating and exporting rail networks that can be consumed by 2-D train-simulation games written with Phaser (or any other engine that can load the same JSON/TS payload).  
The editor lets game/level designers visually place **stations**, draw **tracks**, tweak **map-level metadata** and instantly export a self-contained data file that adheres to the `GameMap` schema defined in `src/lib/types/metro-types.ts`.

**Why it exists**
* Decouples content creation from game-code changes – designers iterate in the browser, developers just load the exported data.
* Guarantees consistency through strong TypeScript typings and runtime validation (Zod).
* Ships with quality-of-life tooling such as snap-to-grid, pixel-preview scaling, keyboard shortcuts and automatic local-storage persistence.

---

## 2. High-Level Architecture

| Layer | Technology | Key Responsibilities |
|-------|------------|-----------------------|
| UI / App | **Next.js 15** (App Router, React 18) | Routing, server/client component separation, build & dev server |
| Rendering | **react-konva** + **Konva** | Interactive canvas for stations/tracks/grid/background image |
| State | **React Context** (`MapEditorProvider`) | Holds the entire `GameMap`, selection state, CRUD mutation helpers, persists to `localStorage` |
| Validation | **Zod** (`validation-utils.ts`) | Synchronous health-checks (duplicate IDs, broken references, network connectivity, …) |
| UI Components | **shadcn/ui** | Accessible headless primitives re-styled to match editor needs |
| Persistence / Export | browser `localStorage`, `file-saver` | Auto-save on every change, one-click JSON export |

```
Browser <--Next.js / React--> MapEditorProvider (context)
                              |                       
                              |----> react-konva Stage/Layer (MapCanvas)
                              |                       
                              |----> shadcn/ui panels (StationEditor, TrackEditor…)
                              |                       
                              |----> utils (validation, export, storage)
```

---

## 3. Repository Layout

```
metromapeditor/
├─ src/
│  ├─ app/                # Next.js entrypoints (layout, page, global CSS)
│  ├─ components/
│  │  ├─ metro-editor/    # Domain-specific editor widgets (canvas + side-panels)
│  │  └─ ui/              # Re-exported shadcn/ui primitives
│  ├─ data/               # Example maps bundled at build-time
│  ├─ lib/
│  │  ├─ context/         # React Context for global editor state
│  │  ├─ types/           # **GameMap** schema & enums
│  │  └─ utils/           # Validation, export, storage helpers
│  └─ globals             # Static assets & styling
├─ public/                # Static files (favicon, images, headers)
├─ package.json           # Scripts & deps
├─ tsconfig.json          # TypeScript project config
└─ PROJECT_OVERVIEW.md    # You-are-here 🎉
```

### Key UI Components (`src/components/metro-editor`)

* **MapCanvas.tsx** – Main Konva stage. Handles pan/zoom, grid, background image, draws stations/tracks and delegates selection + drag-move. Keyboard shortcuts for link creation & deletion live here.
* **StationCreator.tsx** – Modal that pops up at click-location to enter ID + basic attributes for a new station.
* **StationEditor.tsx** – Side panel for editing a single station’s details (name, type, importance, services, coordinates).
* **TrackEditor.tsx** – Similar side panel for a single track (speed, direction, condition, power type, distance).
* **ValidationPanel.tsx** – UI wrapper around `validateMap()` to surface warnings/errors.
* **WorldSettings / BackgroundEditor / EditorSettingsPanel / ExportPanel / ImportPanel** – Various utility panels for map-wide options.

---

## 4. Core Data Model (`GameMap`)

All editor logic revolves around the immutable **GameMap** object.  
It lives in React Context, gets serialised to localStorage, and is what you’ll receive when you press **Export**.

```ts
interface GameMap {
  id: string;
  metadata: MapMetadata;     // name, region, description, version, seed…
  background?: MapBackground; // optional raster guide placed behind grid
  railNetwork: RailNetwork;   // ↑↓↓ SEE BELOW ↓↓↑
  gameSettings?: GameSettings; // camera & theme hints for runtime
  adminSettings?: AdminSettings; // editor-only toggles & history
}
```

### RailNetwork
```ts
interface RailNetwork {
  stations: EnhancedStation[];
  tracks:   EnhancedTrack[];
}
```

#### Station
* `id` – unique string key (used as node reference)
* `name` – display name
* `type` – `'small' | 'medium' | 'large'`
* `coordinates` – `{ x: number; y: number; }` in **world units** (Konva canvas)
* `importance`, `platforms`, `services` – gameplay-specific metadata

#### Track (current)
* `id` – `${source}-${target}` by convention
* `source` / `target` – station IDs
* `distanceKm` – precalculated based on on-canvas length (used for runtime speed limits)
* `speedType` – `'LOCAL' | 'EXPRESS' | 'HIGH_SPEED'`
* `bidirectional` + `direction` – traffic flow control
* `condition`, `powerType`, `scenicValue` – flavour/maintenance stats
* `customBezier?` – optional `{ p1, p2, isCustom }` for curved lines
* `visualStyle?`, `adminMetadata?` – cosmetic / audit info

> **Upcoming Change:** The game runtime is migrating to a `points: Coordinates[]` array that explicitly lists intermediate control-points along a track. When that lands, extend `EnhancedTrack` accordingly and adjust `MapCanvas` line-drawing logic (probably via `Line` with multiple points or `Spline`). This doc already references that intention so future contributors are aware.

---

## 5. Data-Flow & Persistence Lifecycle

1. **Load** – On mount, `MapEditorProvider` tries `loadFromLocalStorage()`; if absent it creates a blank map via `createDefaultMap()`.
2. **Edit** – User interacts with canvas/side-panels → calls context mutators → React re-renders.
3. **Validate** – Panels or `ValidationPanel` trigger `validateMap(gameMap)` to surface issues.
4. **Persist** – `useEffect` inside provider serialises every change back to `localStorage` (debounce not needed yet).
5. **Export** – `exportMapToJson(gameMap)` pretty-prints JSON and triggers `file-saver` download.

---

## 6. Running & Building

```bash
# Install deps
npm install

# Start dev server (defaults to port 3000, auto-switches if busy)
npm run dev

# Type-check & ESLint
npm run lint

# Production build / static export
npm run build && npm start
```

---

## 7. Extending the Editor

* **Adding new entity fields** – Update the appropriate interface in `metro-types.ts`, then patch forms (Zod schemas + react-hook-form bindings) in corresponding editor panels. Validation rules usually live next to the interface.
* **Changing rail geometry** – Update `EnhancedTrack` and all canvas rendering functions (`MapCanvas`, selection logic, distance calculations).
* **Custom pan/zoom behaviour** – `MapCanvas`’s `handleWheel` and drag handlers centralise camera math.
* **Auto-layout / snapping** – Introduce algorithms inside `utils` and call them from mutator helpers.

---

## 8. Contact / Maintainers

* @TeamName / #channel (update as appropriate)
* Original author: _Jack Ammon_

Happy mapping! 🎉 