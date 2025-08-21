# Three.js Room Visualization System

This directory contains the new Three.js-based room visualization system that replaces the previous GLTF and canvas implementations.

## Files Overview

### Core Components

- **`ThreeJSRenderer.tsx`** - Main Three.js rendering component with 2D/3D visualization
- **`ModelViewer3D.tsx`** - Updated wrapper component with controls and UI
- **`Plan.tsx`** - Updated plan component using Three.js instead of canvas
- **`threeJSUtils.ts`** - Utility functions for data processing and transformation

### Legacy Files (Deprecated)

- **`utils.ts`** - Canvas-based rendering (replaced by ThreeJSRenderer)
- **`exemple.js`** - Example data (migrated to threeJSUtils.ts)

## Features

### 🎯 Core Functionality

- **Transform Matrix Support**: Properly handles 4x4 transformation matrices from scan data
- **Multiple Element Types**: Walls, doors, windows, openings, and furniture/objects
- **2D/3D Toggle**: Switch between top-down floor plan and 3D perspective views
- **Interactive Controls**: Mouse/touch controls for navigation and exploration

### 🎨 Visualization

- **Material Visualization**: Different materials and colors for different element types
- **Grid Reference**: Visual grid for scale and positioning reference
- **Dimension Display**: Optional display of measurements and dimensions
- **Lighting System**: Ambient and directional lighting for realistic 3D rendering

### 🚀 Performance

- **Efficient Geometry**: Optimized Three.js geometry generation
- **Instancing**: Proper geometry instancing for better performance
- **Responsive Design**: Adapts to different screen sizes and orientations

## Data Structure

The system expects scan data in the following format:

```typescript
interface Transform {
  transform: number[]; // 16-element transformation matrix
  dimensions: number[]; // [width, height, depth]
}

interface Scan {
  name: string;
  walls?: Transform[];
  doors?: Transform[];
  openings?: Transform[];
  windows?: Transform[];
  objects?: Transform[];
}
```

## Usage

### Basic Implementation

```tsx
import ModelViewer from '@/components/scans/ModelViewer3D';

// With project data
<ModelViewer projectId="123" />

// With example data for testing
<ModelViewer useExampleData={true} />
```

### Advanced Usage

```tsx
import ThreeJSRenderer from "@/components/scans/ThreeJSRenderer";
import { fetchScanData } from "@/components/scans/threeJSUtils";

const [scanData, setScanData] = useState<Scan | null>(null);

// Fetch data
useEffect(() => {
  fetchScanData(projectId).then(setScanData);
}, [projectId]);

// Render
<ThreeJSRenderer scanData={scanData} viewMode="3D" showDimensions={true} />;
```

## Controls

### Mouse/Touch Controls

- **Left Click + Drag**: Rotate view (3D mode only)
- **Right Click + Drag**: Pan view
- **Mouse Wheel**: Zoom in/out
- **Touch**: Pinch to zoom, drag to pan/rotate

### UI Controls

- **2D/3D Toggle**: Switch between floor plan and 3D views
- **Show Dimensions**: Toggle dimension labels on elements
- **Project Selector**: Choose different projects from dropdown

## Element Types & Colors

| Element Type      | Color           | Description                                  |
| ----------------- | --------------- | -------------------------------------------- |
| Walls             | Gray (#666666)  | Structural walls with configurable thickness |
| Doors             | Brown (#8B4513) | Door openings with frame visualization       |
| Windows           | Blue (#4A90E2)  | Window openings with transparency            |
| Openings          | Red Wireframe   | Passageways and openings                     |
| Objects/Furniture | Blue Wireframe  | Furniture and room objects                   |

## Migration from Canvas

### What Changed

1. **Rendering Engine**: Canvas 2D → Three.js WebGL
2. **3D Support**: Added true 3D visualization alongside 2D
3. **Performance**: Better performance through GPU acceleration
4. **Interactivity**: Enhanced navigation and controls
5. **Materials**: Realistic materials and lighting

### Benefits

- **Better Performance**: Hardware-accelerated rendering
- **Consistent API**: Same interface for 2D and 3D views
- **Future-Proof**: Easier to extend with new features
- **Mobile Support**: Better touch controls and responsiveness

## Demo

Visit `/scan-demo` to see the Three.js implementation in action with example data.

## Dependencies

- **@react-three/fiber**: React renderer for Three.js
- **@react-three/drei**: Useful helpers and components
- **three**: Core Three.js library
- **@types/three**: TypeScript definitions

## Troubleshooting

### Common Issues

1. **Black Screen**: Check that Three.js dependencies are installed
2. **Performance Issues**: Reduce the number of elements or disable dimension labels
3. **Controls Not Working**: Ensure the canvas has focus and proper event handlers

### Browser Support

- **Modern Browsers**: Chrome 80+, Firefox 78+, Safari 14+, Edge 80+
- **WebGL Required**: The system requires WebGL support
- **Mobile**: iOS 13+ and Android 8+ recommended

## Future Enhancements

- [ ] VR/AR support with WebXR
- [ ] Real-time collaboration features
- [ ] Advanced material editor
- [ ] Animation and walkthrough modes
- [ ] Export to various 3D formats
- [ ] AI-powered room optimization
