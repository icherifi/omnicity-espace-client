import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

export const StateOfPlay: React.FC<{
  currentProjectDisplayed: { stateOfPlay: string };
}> = ({ currentProjectDisplayed }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Etat des lieux</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{currentProjectDisplayed.stateOfPlay}</p>
      </CardContent>
    </Card>
  );
};
