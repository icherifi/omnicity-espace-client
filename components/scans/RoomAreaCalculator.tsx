"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calculator, Check, SkipForward, RotateCcw } from "lucide-react";
import {
  Scan,
  RoomSection,
  RoomAreaData,
  calculateRoomArea,
  getRoomCenter,
} from "./threeJSUtils";

interface RoomAreaCalculatorProps {
  scanData: Scan;
  selectedWalls: Set<number>;
  onWallSelectionChange: (wallIndices: Set<number>) => void;
  onCameraFocus: (center: [number, number, number]) => void;
  onComplete: (roomAreas: RoomAreaData[]) => void;
}

interface RoomCalculationState {
  currentRoomIndex: number;
  roomAreas: RoomAreaData[];
  isActive: boolean;
  selectedWalls: number[];
}

export default function RoomAreaCalculator({
  scanData,
  selectedWalls,
  onWallSelectionChange,
  onCameraFocus,
  onComplete,
}: RoomAreaCalculatorProps) {
  const [calculationState, setCalculationState] =
    useState<RoomCalculationState>({
      currentRoomIndex: -1,
      roomAreas: [],
      isActive: false,
      selectedWalls: [],
    });

  const rooms = scanData.sections || [];
  const walls = scanData.walls || [];

  const startCalculation = useCallback(() => {
    if (rooms.length === 0) return;

    setCalculationState({
      currentRoomIndex: 0,
      roomAreas: [],
      isActive: true,
      selectedWalls: [],
    });

    onWallSelectionChange(new Set());

    // Focus camera on first room
    const firstRoomCenter = getRoomCenter(rooms[0].label, scanData.sections);
    if (firstRoomCenter) {
      onCameraFocus(firstRoomCenter);
    }
  }, [rooms, scanData.sections, onWallSelectionChange, onCameraFocus]);

  const confirmRoomWalls = useCallback(() => {
    const currentRoom = rooms[calculationState.currentRoomIndex];
    if (!currentRoom || selectedWalls.size === 0) return;

    const area = calculateRoomArea(Array.from(selectedWalls), walls);
    const roomCenter = getRoomCenter(currentRoom.label, scanData.sections);

    const roomAreaData: RoomAreaData = {
      roomLabel: currentRoom.label,
      area,
      wallIndices: Array.from(selectedWalls),
      center: roomCenter || [0, 0, 0],
    };

    const newRoomAreas = [...calculationState.roomAreas, roomAreaData];

    if (calculationState.currentRoomIndex < rooms.length - 1) {
      // Move to next room
      const nextRoomIndex = calculationState.currentRoomIndex + 1;
      const nextRoom = rooms[nextRoomIndex];

      setCalculationState({
        ...calculationState,
        currentRoomIndex: nextRoomIndex,
        roomAreas: newRoomAreas,
        selectedWalls: [],
      });

      onWallSelectionChange(new Set());

      // Focus camera on next room
      const nextRoomCenter = getRoomCenter(nextRoom.label, scanData.sections);
      if (nextRoomCenter) {
        onCameraFocus(nextRoomCenter);
      }
    } else {
      // Calculation complete
      setCalculationState({
        ...calculationState,
        isActive: false,
        roomAreas: newRoomAreas,
      });
      onWallSelectionChange(new Set());
      onComplete(newRoomAreas);
    }
  }, [
    calculationState,
    rooms,
    selectedWalls,
    walls,
    scanData.sections,
    onWallSelectionChange,
    onCameraFocus,
    onComplete,
  ]);

  const skipRoom = useCallback(() => {
    const currentRoom = rooms[calculationState.currentRoomIndex];
    if (!currentRoom) return;

    const roomAreaData: RoomAreaData = {
      roomLabel: currentRoom.label,
      area: 0, // Skipped room
      wallIndices: [],
      center: getRoomCenter(currentRoom.label, scanData.sections) || [0, 0, 0],
    };

    const newRoomAreas = [...calculationState.roomAreas, roomAreaData];

    if (calculationState.currentRoomIndex < rooms.length - 1) {
      // Move to next room
      const nextRoomIndex = calculationState.currentRoomIndex + 1;
      const nextRoom = rooms[nextRoomIndex];

      setCalculationState({
        ...calculationState,
        currentRoomIndex: nextRoomIndex,
        roomAreas: newRoomAreas,
        selectedWalls: [],
      });

      onWallSelectionChange(new Set());

      // Focus camera on next room
      const nextRoomCenter = getRoomCenter(nextRoom.label, scanData.sections);
      if (nextRoomCenter) {
        onCameraFocus(nextRoomCenter);
      }
    } else {
      // Calculation complete
      setCalculationState({
        ...calculationState,
        isActive: false,
        roomAreas: newRoomAreas,
      });
      onWallSelectionChange(new Set());
      onComplete(newRoomAreas);
    }
  }, [
    calculationState,
    rooms,
    scanData.sections,
    onWallSelectionChange,
    onCameraFocus,
    onComplete,
  ]);

  const resetCalculation = useCallback(() => {
    setCalculationState({
      currentRoomIndex: -1,
      roomAreas: [],
      isActive: false,
      selectedWalls: [],
    });
    onWallSelectionChange(new Set());
  }, [onWallSelectionChange]);

  const currentRoom =
    calculationState.isActive && calculationState.currentRoomIndex >= 0
      ? rooms[calculationState.currentRoomIndex]
      : null;

  const progress =
    rooms.length > 0
      ? ((calculationState.currentRoomIndex + 1) / rooms.length) * 100
      : 0;

  const totalArea = calculationState.roomAreas.reduce(
    (sum, room) => sum + room.area,
    0
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Room Area Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!calculationState.isActive &&
          calculationState.roomAreas.length === 0 && (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Calculate the area of each room by manually selecting walls.
                {rooms.length > 0 && ` Found ${rooms.length} rooms to process.`}
              </p>
              <Button
                onClick={startCalculation}
                disabled={rooms.length === 0}
                className="w-full"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Start Room Area Calculation
              </Button>
            </div>
          )}

        {calculationState.isActive && currentRoom && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold">Room: {currentRoom.label}</h3>
                <p className="text-sm text-muted-foreground">
                  Step {calculationState.currentRoomIndex + 1} of {rooms.length}
                </p>
              </div>
              <Badge variant="outline">
                {selectedWalls.size} walls selected
              </Badge>
            </div>

            <Progress value={progress} className="w-full" />

            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm">
                <strong>Instructions:</strong> Click on the walls that belong to
                this room. The camera has been focused on the room center.
                Select at least 3 walls to calculate the area.
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={confirmRoomWalls}
                disabled={selectedWalls.size < 3}
                className="flex-1"
              >
                <Check className="h-4 w-4 mr-2" />
                Confirm Selection ({selectedWalls.size} walls)
              </Button>
              <Button onClick={skipRoom} variant="outline">
                <SkipForward className="h-4 w-4 mr-2" />
                Skip Room
              </Button>
            </div>
          </div>
        )}

        {calculationState.roomAreas.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Results</h3>
              <Button onClick={resetCalculation} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>

            <div className="space-y-2">
              {calculationState.roomAreas.map((room, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div>
                    <p className="font-medium">{room.roomLabel}</p>
                    <p className="text-sm text-muted-foreground">
                      {room.wallIndices.length} walls
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {room.area > 0 ? `${room.area.toFixed(2)} m²` : "Skipped"}
                    </p>
                  </div>
                </div>
              ))}

              {totalArea > 0 && (
                <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border-2 border-primary/20">
                  <p className="font-semibold">Total Area</p>
                  <p className="font-bold text-lg">{totalArea.toFixed(2)} m²</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
