import React from "react";
import { Mail, Phone, MapPin, CheckCircle, Zap, Droplet, Flame, Shield, Hammer, Grid, Paintbrush, Wrench, Fan, BrickWall } from "lucide-react";
import { Professional, getDomainIcon } from "../utils";

interface ProfessionalCardProps {
  pro: Professional;
  onOpenDialog: (pro: Professional) => void;
}

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "Zap":
      return <Zap className="w-5 h-5 text-violet-600 dark:text-violet-400" />;
    case "Droplet":
      return <Droplet className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    case "Flame":
      return <Flame className="w-5 h-5 text-orange-500 dark:text-orange-400" />;
    case "Fan":
      return <Fan className="w-5 h-5 text-teal-600 dark:text-teal-400" />;
    case "BrickWall":
      return <BrickWall className="w-5 h-5 text-amber-700 dark:text-amber-500" />;
    case "Shield":
      return <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />;
    case "Hammer":
      return <Hammer className="w-5 h-5 text-yellow-700 dark:text-yellow-500" />;
    case "Grid":
      return <Grid className="w-5 h-5 text-gray-700 dark:text-gray-300" />;
    case "Paintbrush":
      return <Paintbrush className="w-5 h-5 text-pink-500 dark:text-pink-400" />;
    case "Wrench":
      return <Wrench className="w-5 h-5 text-cyan-700 dark:text-cyan-400" />;
    default:
      return <Wrench className="w-5 h-5 text-gray-400 dark:text-gray-500" />;
  }
};

export default function ProfessionalCard({ pro, onOpenDialog }: ProfessionalCardProps) {
  const iconName = getDomainIcon(pro);

  return (
    <div
      className="relative bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-300 dark:border-gray-600 p-0 overflow-hidden flex flex-col shadow-sm"
      style={{ minHeight: 370 }}
    >
      <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 font-bold text-base text-gray-900 dark:text-white break-words">
              {getIconComponent(iconName)}
              {pro.name.split(' ').length > 2 ? (
                <span className="break-words">{pro.name}</span>
              ) : (
                <span className="break-words">{pro.name}</span>
              )}
            </div>
            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm gap-1 mt-1">
              <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
              <span className="break-words">{pro.city}</span>
            </div>
          </div>
        </div>
        <div className="text-right ml-4 flex-shrink-0">
          <div className="font-bold text-sm text-gray-900 dark:text-white max-w-[200px] break-words">
            <span className="break-words">{pro.role.split(' ')[0].replace(',', '')}</span>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center gap-3">
        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
        <div>
          <span className="font-bold text-base text-gray-900 dark:text-white">Bon à savoir</span>
          <div className="font-semibold text-gray-700 dark:text-gray-300 text-base mt-1">Entreprise RGE certifiée</div>
        </div>
      </div>
      
      <div className="px-6 py-4 flex-1 flex flex-col justify-between bg-gray-50 dark:bg-gray-800">
        <div>
          <div className="font-bold text-base text-gray-900 dark:text-white mb-2">Métiers et compétences</div>
          <ul className="list-disc list-inside text-base text-gray-800 dark:text-gray-200 mb-4">
            {pro.skills.length > 0 ? pro.skills.map((skill, i) => (
              <li key={i} className="break-words">{skill}</li>
            )) : <li className="break-words">Non renseigné</li>}
          </ul>
          <div className="flex flex-col gap-1 text-base text-gray-900 dark:text-gray-100 mb-2">
            <span className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-gray-900 dark:text-gray-100 flex-shrink-0" /> 
              <span className="break-words">{pro.phone || <span className='text-gray-400 dark:text-gray-500'>Non renseigné</span>}</span>
            </span>
            <span className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-gray-900 dark:text-gray-100 flex-shrink-0" /> 
              <span className="break-words">{pro.email || <span className='text-gray-400 dark:text-gray-500'>Non renseigné</span>}</span>
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-900 dark:text-gray-100 flex-shrink-0" />
              <span className="break-words">{pro.adresse || <span className='text-gray-400 dark:text-gray-500'>Non renseigné</span>}</span>
            </span>
          </div>
          {pro.siret && (
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 break-words">
              <strong>SIRET:</strong> {pro.siret}
            </div>
          )}
        </div>
        <a 
          href={pro.companyLink} 
          target="_blank"
          className="block text-base font-semibold text-gray-900 dark:text-white mt-2 underline hover:text-primary transition-colors break-words"
        >
          En savoir plus sur l'entreprise {pro.company}
        </a>
      </div>
    </div>
  );
}