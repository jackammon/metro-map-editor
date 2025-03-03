# Metro Map Editor for Phaser Games

This tool enables you to specify game world dimensions, upload a background image, place stations on a canvas, create connection lines between stations, and export the data to CSV for integration into your game.

## Features

- **World Setup**: Configure game world dimensions (width and height)
- **Background Image**: Upload and display a background image for reference
- **Station Placement**: Click on the canvas to add stations with properties (ID, name, zone)
- **Draggable Stations**: Easily adjust station positions by dragging
- **Line Creation**: Create metro lines with custom colors
- **Station Connections**: Connect stations to form metro lines
- **Interchange Detection**: Automatically mark stations that belong to multiple lines
- **Data Export**: Export all data to CSV format for use in Phaser games

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

### Setting Up the World

1. Use the sliders in the World Settings panel to set the width and height of your game world
2. Click "Apply Dimensions" to update the canvas
3. Optionally upload a background image for reference

### Adding Stations

1. Click anywhere on the canvas to add a new station
2. Fill in the station details (ID, name, zone)
3. The station will appear on the canvas and in the Stations list

### Creating Lines

1. Click "Add Line" in the Lines panel
2. Fill in the line details (ID, name, color)
3. Select the line from the list to make it active
4. Click on stations to add them to the line

### Connecting Stations

1. Select multiple stations by holding Ctrl/Cmd while clicking on them
2. With a line active, the selected stations will be connected in the order they were selected

### Exporting Data

1. Once you've created your metro map, click "Export to CSV" in the Export panel
2. The CSV file will be downloaded, ready to be used in your Phaser game

## Keyboard Shortcuts

- **Ctrl/Cmd + Click**: Select multiple stations
- **Click and Drag**: Move the canvas view
- **Mouse Wheel**: Zoom in/out

## Acknowledgments

- Built with Next.js, React, and Konva
- UI components from shadcn/ui
- CSV export using PapaParse
