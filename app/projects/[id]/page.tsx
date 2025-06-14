'use client';

import { useProjectsContext } from "@/contexts/projects.context";
import { CarbonImpact } from "../components/CarbonImpact/CarbonImpact";
import { FinancialAid } from "../components/FinancialAid";
import { GreenValue } from "../components/GreenValue";
import { EnergySavings } from "../components/EnergySavings/EnergySavings";
import { Works } from "../components/Works";

export default function ProjetPage({ params }: { params: { id: string } }) {
  const { projects } = useProjectsContext();
  const project = projects.find(p => p.id.toString() === params.id);

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
              <div className="h-4 bg-muted rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto snap-y snap-mandatory bg-background">
      <div className="snap-start w-full min-h-[80vh]">
        <Works project={project} />
      </div>
      <div className="snap-start w-full min-h-[80vh]">
        <EnergySavings project={project} />
      </div>
      <div className="snap-start w-full min-h-[80vh]">
        <GreenValue project={project} />
      </div>
      <div className="snap-start w-full min-h-[80vh]">
        <CarbonImpact project={project} />
      </div>
      <div className="snap-start w-full min-h-[80vh]">
        <FinancialAid project={project} />
      </div>
    </div>
  );
} 