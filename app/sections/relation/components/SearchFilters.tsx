import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RGE_DOMAINS, REGIONS } from "../utils";

interface SearchFiltersProps {
  selectedDomain: string;
  selectedRegion: string;
  onDomainChange: (value: string) => void;
  onRegionChange: (value: string) => void;
}

export default function SearchFilters({
  selectedDomain,
  selectedRegion,
  onDomainChange,
  onRegionChange
}: SearchFiltersProps) {
  return (
    <div className="flex gap-4 mb-6">
      <Select value={selectedDomain} onValueChange={onDomainChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Domaine d'activité" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les domaines</SelectItem>
          {Object.keys(RGE_DOMAINS).map(domain => (
            <SelectItem key={domain} value={domain}>{domain}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={selectedRegion} onValueChange={onRegionChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Région" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les régions</SelectItem>
          {REGIONS.map(region => (
            <SelectItem key={region.value} value={region.value}>
              {region.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 