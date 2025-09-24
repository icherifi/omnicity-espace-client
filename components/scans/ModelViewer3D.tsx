"use client";

import React, { useState, useRef } from "react";
import ThreeJSRenderer from "./ThreeJSRenderer";
import RoomAreaCalculator from "./RoomAreaCalculator";
import {
  getScanStatistics,
  type Scan,
  type RoomAreaData,
} from "./threeJSUtils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Box,
  Square,
  Ruler,
  Maximize2,
  Calculator,
  HelpCircle,
} from "lucide-react";
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
  const [showAreaCalculator, setShowAreaCalculator] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [selectedWalls, setSelectedWalls] = useState<Set<number>>(new Set());
  const [cameraTarget, setCameraTarget] = useState<
    [number, number, number] | undefined
  >();
  const [roomAreaData, setRoomAreaData] = useState<RoomAreaData[]>([]);

  const roomCalculatorRef = useRef<HTMLDivElement>(null);

  const containerHeight = displayMode === "embedded" ? height : "600px";

  const handleWallClick = (wallIndex: number) => {
    const newSelectedWalls = new Set(selectedWalls);
    if (newSelectedWalls.has(wallIndex)) {
      newSelectedWalls.delete(wallIndex);
    } else {
      newSelectedWalls.add(wallIndex);
    }
    setSelectedWalls(newSelectedWalls);
  };

  const handleAreaCalculationComplete = (data: RoomAreaData[]) => {
    setRoomAreaData(data);
    setShowAreaCalculator(false);
    setSelectedWalls(new Set());
    setCameraTarget(undefined);
  };

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

              {/* Area Calculator Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowAreaCalculator(true);
                  // Scroll to the calculator component after a short delay to ensure it's rendered
                  setTimeout(() => {
                    roomCalculatorRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }, 100);
                }}
                disabled={!scanData?.sections || scanData.sections.length === 0}
                className="flex items-center gap-2"
              >
                <Calculator className="h-4 w-4" />
                Calculate Room Areas
              </Button>

              {/* Statistics */}
              <div className="text-sm text-zinc-600 ml-auto">
                {stats.walls} walls, {stats.doors} doors, {stats.windows}{" "}
                windows, {stats.objects} objects
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3D Renderer */}
        <div className="relative">
          <ThreeJSRenderer
            scanData={scanData}
            viewMode={viewMode}
            showDimensions={showDimensions}
            selectedWalls={selectedWalls}
            onWallClick={showAreaCalculator ? handleWallClick : undefined}
            cameraTarget={cameraTarget}
          />

          {/* Help Icon */}
          <div className="absolute bottom-4 left-4 z-10">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowInstructions(!showInstructions)}
              className="bg-white/90 backdrop-blur-sm border shadow-lg hover:bg-white/95 h-10 w-10 p-0"
              title="Show/Hide Instructions"
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>

          {/* Instructions Overlay */}
          {showInstructions && (
            <div className="absolute bottom-16 left-4 z-10">
              <Card className="bg-white/95 backdrop-blur-sm border shadow-lg max-w-sm">
                <CardContent className="p-4">
                  <div className="text-sm text-zinc-600">
                    <p className="mb-2">
                      <strong>Controls:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Left click + drag: Rotate view (3D mode)</li>
                      <li>Right click + drag: Pan view</li>
                      <li>Mouse wheel: Zoom in/out</li>
                      <li>Toggle between 2D (top-down) and 3D views</li>
                      {showAreaCalculator && (
                        <li>
                          Click on walls to select them for room area
                          calculation
                        </li>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Room Area Calculator */}
        {showAreaCalculator && (
          <div ref={roomCalculatorRef}>
            <RoomAreaCalculator
              scanData={scanData}
              selectedWalls={selectedWalls}
              onWallSelectionChange={setSelectedWalls}
              onCameraFocus={setCameraTarget}
              onComplete={handleAreaCalculationComplete}
            />
          </div>
        )}

        {/* Room Area Results */}
        {roomAreaData && roomAreaData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Room Area Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roomAreaData.map((room, index) => (
                  <div key={index} className="border-b pb-2 last:border-b-0">
                    <p>
                      <strong>Room:</strong> {room.roomLabel}
                    </p>
                    <p>
                      <strong>Area:</strong> {room.area.toFixed(2)} m²
                    </p>
                    <p>
                      <strong>Walls used:</strong> {room.wallIndices.length}
                    </p>
                  </div>
                ))}
                <div className="pt-2 border-t">
                  <p>
                    <strong>Total Area:</strong>{" "}
                    {roomAreaData
                      .reduce((sum, room) => sum + room.area, 0)
                      .toFixed(2)}{" "}
                    m²
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
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
          selectedWalls={selectedWalls}
          onWallClick={showAreaCalculator ? handleWallClick : undefined}
          cameraTarget={cameraTarget}
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
