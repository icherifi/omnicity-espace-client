import React from "react";
import ModelViewer from "@/components/scans/ModelViewer3D";
import { exampleScanData } from "@/components/scans/threeJSUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Box, Eye, FileText } from "lucide-react";

export default function ScanDemoPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
          <Box className="h-8 w-8" />
          Three.js Room Visualization Demo
        </h1>
        <p className="text-zinc-600 max-w-2xl mx-auto">
          This demo showcases the new Three.js-based room visualization system
          that replaces the previous GLTF and canvas implementations. You can
          view room plans in both 2D and 3D modes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Interactive 3D View
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-600">
              Navigate through 3D space with mouse controls. Rotate, pan, and
              zoom to explore the room from any angle.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              2D Floor Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-600">
              Switch to top-down 2D view for traditional floor plan
              visualization with accurate measurements.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Box className="h-5 w-5" />
              Element Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-600">
              Visualize walls, doors, windows, openings, and furniture with
              distinct colors and styles.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Demo with example data */}
      <Card>
        <CardHeader>
          <CardTitle>Example Room Data</CardTitle>
        </CardHeader>
        <CardContent>
          <ModelViewer scanData={exampleScanData} displayMode="full" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Features:</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-zinc-600">
              <li>
                <strong>Transform Matrix Support:</strong> Properly handles 4x4
                transformation matrices from scan data
              </li>
              <li>
                <strong>Multiple Element Types:</strong> Walls, doors, windows,
                openings, and furniture/objects
              </li>
              <li>
                <strong>2D/3D Toggle:</strong> Switch between top-down floor
                plan and 3D perspective views
              </li>
              <li>
                <strong>Interactive Controls:</strong> Mouse/touch controls for
                navigation and exploration
              </li>
              <li>
                <strong>Dimension Display:</strong> Optional display of
                measurements and dimensions
              </li>
              <li>
                <strong>Grid Reference:</strong> Visual grid for scale and
                positioning reference
              </li>
              <li>
                <strong>Material Visualization:</strong> Different materials and
                colors for different element types
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Migration Notes:</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-zinc-600">
              <li>
                Replaced GLTF model loading with procedural Three.js geometry
                generation
              </li>
              <li>
                Eliminated canvas-based 2D rendering in favor of Three.js for
                both 2D and 3D views
              </li>
              <li>
                Improved performance through efficient geometry instancing
              </li>
              <li>
                Better handling of transform matrices and coordinate systems
              </li>
              <li>Consistent material and lighting across all views</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
