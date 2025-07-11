import React from "react";
import { Avatar } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Zap, Droplet, Flame, Shield, Hammer, Grid, Paintbrush, Wrench, Fan, BrickWall } from "lucide-react";
import { Professional, getDomainIcon } from "../utils";

interface ProfessionalDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPro: Professional | null;
  proQualifications: string[];
  isDialogLoading: boolean;
}

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "Zap":
      return <Zap className="w-10 h-10 text-violet-600 dark:text-violet-400" />;
    case "Droplet":
      return <Droplet className="w-10 h-10 text-blue-600 dark:text-blue-400" />;
    case "Flame":
      return <Flame className="w-10 h-10 text-orange-500 dark:text-orange-400" />;
    case "Fan":
      return <Fan className="w-10 h-10 text-teal-600 dark:text-teal-400" />;
    case "BrickWall":
      return <BrickWall className="w-10 h-10 text-amber-700 dark:text-amber-500" />;
    case "Shield":
      return <Shield className="w-10 h-10 text-green-600 dark:text-green-400" />;
    case "Hammer":
      return <Hammer className="w-10 h-10 text-yellow-700 dark:text-yellow-500" />;
    case "Grid":
      return <Grid className="w-10 h-10 text-gray-700 dark:text-gray-300" />;
    case "Paintbrush":
      return <Paintbrush className="w-10 h-10 text-pink-500 dark:text-pink-400" />;
    case "Wrench":
      return <Wrench className="w-10 h-10 text-cyan-700 dark:text-cyan-400" />;
    default:
      return <Wrench className="w-10 h-10 text-gray-400 dark:text-gray-500" />;
  }
};

export default function ProfessionalDialog({
  isOpen,
  onOpenChange,
  selectedPro,
  proQualifications,
  isDialogLoading
}: ProfessionalDialogProps) {
  if (!selectedPro) return null;

  const iconName = getDomainIcon(selectedPro);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{selectedPro.name}</DialogTitle>
          <DialogDescription>
            {selectedPro.role} — {selectedPro.city}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="flex items-center justify-center">
            {getIconComponent(iconName)}
          </Avatar>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">SIRET : {selectedPro.siret || 'Non renseigné'}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{selectedPro.email}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{selectedPro.phone}</div>
          </div>
        </div>
        
        <div className="mb-2 font-bold text-gray-900 dark:text-white">Compétences & qualifications :</div>
        {isDialogLoading ? (
          <div className="text-gray-400 dark:text-gray-500 italic">Chargement…</div>
        ) : (
          <ul className="list-disc list-inside text-base text-gray-800 dark:text-gray-200 mb-4">
            {proQualifications.length > 0 ? proQualifications.map((q, i) => (
              <li key={i}>{q}</li>
            )) : <li>Non renseigné</li>}
          </ul>
        )}
        
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">Adresse : {selectedPro.adresse}</div>
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Site : {selectedPro.companyLink && (
            <a 
              href={selectedPro.companyLink} 
              className="underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {selectedPro.companyLink}
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 