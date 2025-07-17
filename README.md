# Metro Map Editor for Phaser Games

A standalone, data-driven tool for designing and exporting complex rail networks for use in Phaser-based train simulation games. This editor allows for the creation of stations, tracks, and map-level metadata, all conforming to the `GameMap` schema.

## Core Features

- **Data-Driven Design**: The entire editor is built around the `GameMap` schema, ensuring that all created data is valid and ready for use in-game.
- **Station & Track Editing**: Create, move, and delete stations and tracks with a rich set of editable properties, including station type, importance, services, track speed, condition, and more.
- **Map Management**: Load existing maps from a data collection, or create new maps from scratch. All work is automatically saved to local storage.
- **Visual Feedback**: The editor provides real-time visual feedback, including a grid, pixel preview, and validation status.
- **TypeScript Export**: Export your map data to a TypeScript file, ready to be imported into your game.

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/metromapeditor.git
   cd metromapeditor
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## How to Use

### 1. Load or Create a Map

- Use the **Map Loader** panel to either select an existing map from the dropdown or click **Create New Map** to start from a blank canvas.
- Your progress is automatically saved to your browser's local storage.
- You can also import a map from a local `.ts` file using the **Import Map** panel.

### 2. Edit Map Metadata

- Use the **Map Metadata** panel to edit the map's name, region, description, and other high-level properties.

### 3. Place and Edit Stations

- **Create a station**: Click on an empty area of the canvas. A form will appear to enter the station's ID and name.
- **Select a station**: Click on a station in the **Stations** list or on the canvas.
- **Edit a station**: With a single station selected, use the **Station Editor** panel to modify its properties, such as type, importance, platforms, and services.
- **Move a station**: Click and drag a station on the canvas.
- **Delete a station**: Click the "Del" button next to a station in the **Stations** list.

### 4. Create and Edit Tracks

- **Create a track**: Select two stations on the canvas (hold `Ctrl`/`Cmd` to select the second station), then press the `L` key to create a track between them.
- **Select a track**: Click on a track on the canvas.
- **Edit a track**: With a single track selected, use the **Track Editor** panel to modify its properties, such as speed type, direction, and condition. You can also change which stations the track connects between using the source and target station dropdowns.
- **Delete a track**: With a track selected, click the "Delete Track" button in the **Track Editor** panel, or press the `Delete` key.

### 5. Use the Editor Tools

- **Background Image**: Upload an image to use as a visual guide for your map.
- **Editor Settings**: Toggle grid snapping, layer visibility, and other editor preferences.
- **Validation Panel**: Keep an eye on the validation status to ensure your map data is valid.

### 6. Export Your Map

- Once you're finished, click **Export to JSON** in the **Export Map** panel. This will download a `.json` file containing your map data, ready to be imported into your game.

## Keyboard Shortcuts

- **`Ctrl`/`Cmd` + Click**: Select multiple stations.
- **`L`**: Create a track between two selected stations.
- **Click and Drag Canvas**: Pan the camera.
- **Mouse Wheel**: Zoom the camera in and out.
- **`Delete` or `Backspace`**: Delete selected stations or tracks (with confirmation).

## Tech Stack

- **Framework**: Next.js (React)
- **UI**: shadcn/ui
- **Canvas**: react-konva
- **State Management**: React Context
- **Validation**: Zod
- **File Export**: file-saver
