"use client";

import React, { useState } from "react";
import ThreeJSRenderer from "./ThreeJSRenderer";
import { getScanStatistics, type Scan } from "./threeJSUtils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Box, Square, Ruler, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModelViewerProps {
  scanData: Scan | null;
  loading?: boolean;
  error?: string | null;
  displayMode?: "full" | "embedded";
  height?: string;
  onFullscreenToggle?: () => void;
}

const ModelViewer: React.FC<ModelViewerProps> = ({
  scanData,
  loading = false,
  error = null,
  displayMode = "full",
  height = "600px",
  onFullscreenToggle,
}) => {
  const [viewMode, setViewMode] = useState<"2D" | "3D">("3D");
  const [showDimensions, setShowDimensions] = useState(false);

  const containerHeight = displayMode === "embedded" ? height : "600px";

  if (loading) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ height: containerHeight }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-zinc-600">Loading 3D model...</p>
        </div>
      </div>
    );
  }

  if (error || !scanData) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ height: containerHeight }}
      >
        <div className="text-center">
          <Box className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
          <p className="text-zinc-600">{error || "No scan data available"}</p>
        </div>
      </div>
    );
  }

  const stats = getScanStatistics(scanData);

  // Full display mode (original layout)
  if (displayMode === "full") {
    return (
      <div className="space-y-4">
        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Box className="h-5 w-5" />
              3D Room Viewer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-6">
              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2">
                <Square className="h-4 w-4" />
                <Label htmlFor="view-mode">2D</Label>
                <Switch
                  id="view-mode"
                  checked={viewMode === "3D"}
                  onCheckedChange={(checked) =>
                    setViewMode(checked ? "3D" : "2D")
                  }
                />
                <Label htmlFor="view-mode">3D</Label>
                <Box className="h-4 w-4" />
              </div>

              {/* Dimensions Toggle */}
              <div className="flex items-center space-x-2">
                <Ruler className="h-4 w-4" />
                <Label htmlFor="show-dimensions">Show Dimensions</Label>
                <Switch
                  id="show-dimensions"
                  checked={showDimensions}
                  onCheckedChange={setShowDimensions}
                />
              </div>

              {/* Statistics */}
              <div className="text-sm text-zinc-600 ml-auto">
                {stats.walls} walls, {stats.doors} doors, {stats.windows}{" "}
                windows, {stats.objects} objects
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3D Renderer */}
        <ThreeJSRenderer
          scanData={scanData}
          viewMode={viewMode}
          showDimensions={showDimensions}
        />

        {/* Instructions */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-zinc-600">
              <p className="mb-2">
                <strong>Controls:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Left click + drag: Rotate view (3D mode)</li>
                <li>Right click + drag: Pan view</li>
                <li>Mouse wheel: Zoom in/out</li>
                <li>Toggle between 2D (top-down) and 3D views</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Embedded display mode (compact with overlapping controls)
  return (
    <div className="relative">
      {/* 3D Renderer */}
      <div style={{ height: containerHeight }}>
        <ThreeJSRenderer
          scanData={scanData}
          viewMode={viewMode}
          showDimensions={showDimensions}
        />
      </div>

      {/* Overlapping Controls */}
      <div className="absolute top-4 left-4 z-10">
        <Card className="bg-white/90 backdrop-blur-sm border shadow-lg">
          <CardContent className="p-3">
            <div className="flex flex-col gap-3">
              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2">
                <Square className="h-3 w-3" />
                <Label htmlFor="embedded-view-mode" className="text-xs">
                  2D
                </Label>
                <Switch
                  id="embedded-view-mode"
                  checked={viewMode === "3D"}
                  onCheckedChange={(checked) =>
                    setViewMode(checked ? "3D" : "2D")
                  }
                  className="scale-75"
                />
                <Label htmlFor="embedded-view-mode" className="text-xs">
                  3D
                </Label>
                <Box className="h-3 w-3" />
              </div>

              {/* Dimensions Toggle */}
              <div className="flex items-center space-x-2">
                <Ruler className="h-3 w-3" />
                <Label htmlFor="embedded-dimensions" className="text-xs">
                  Dimensions
                </Label>
                <Switch
                  id="embedded-dimensions"
                  checked={showDimensions}
                  onCheckedChange={setShowDimensions}
                  className="scale-75"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fullscreen Button */}
      {onFullscreenToggle && (
        <div className="absolute top-4 right-4 z-10">
          <Button
            onClick={onFullscreenToggle}
            size="sm"
            variant="outline"
            className="bg-white/90 backdrop-blur-sm border shadow-lg hover:bg-white/95"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Statistics Overlay */}
      <div className="absolute bottom-4 left-4 z-10">
        <Card className="bg-white/90 backdrop-blur-sm border shadow-lg">
          <CardContent className="p-2">
            <div className="text-xs text-zinc-600">
              {stats.walls}W • {stats.doors}D • {stats.windows}Wi •{" "}
              {stats.objects}O
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModelViewer;
