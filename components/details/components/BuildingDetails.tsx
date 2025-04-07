import { IsolationIcons } from './icons/IsolationIcons';
import { ChauffageIcons } from './icons/ChauffageIcons';
import { VentilationIcon } from './icons/VentilationIcon';
import { ProjectType } from '@/types/project.types';
interface BuildingDetailsProps {
  currentProjectDisplayed: ProjectType;
}

export const BuildingDetails = ({ currentProjectDisplayed }: BuildingDetailsProps) => (
  <div className="grid grid-cols-3 gap-8 bg-gray-50 rounded-2xl py-4 sm:p-6">
    <div>
      <h3 className="font-semibold mb-4">Isolation & menuiserie</h3>
      <div className="space-y-3">
        {Object.entries(IsolationIcons).map(([key, icon]) => (
          <div key={key} className="flex items-center gap-2">
            {icon}
            <span>{key}</span>
          </div>
        ))}
      </div>
    </div>

    <div>
      <h3 className="font-semibold mb-4">Chauffage</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          {ChauffageIcons.AppareilPrincipal}
          <span>Appareil principal</span>
        </div>
        {currentProjectDisplayed.iziResponse?.performanceEnergetique?.chauffage?.EtatInitial?.ApCh2?.Label && (
          <div className="flex items-center gap-2">
            {ChauffageIcons.AppareilSecondaire}
            <span>Appareil secondaire</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          {ChauffageIcons.EauChaude}
          <span>Eau chaude sanitaire</span>
        </div>
      </div>
    </div>

    <div>
      <h3 className="font-semibold mb-4">Ventilation</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          {VentilationIcon}
          <span>Installation</span>
        </div>
      </div>
    </div>
  </div>
); 