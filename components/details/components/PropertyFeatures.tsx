import { ProjectType } from '@/types/project.types';
import { Home, Calendar, Flame } from 'lucide-react';

interface PropertyFeaturesProps {
  currentProjectDisplayed: ProjectType;
}

export const PropertyFeatures = ({ currentProjectDisplayed }: PropertyFeaturesProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {[
      {
        label: "Surface habitable",
        value: `${currentProjectDisplayed.features.size} m²`,
        icon: <Home className="h-5 w-5 text-primary" />,
      },
      {
        label: "Année de construction",
        value: "Non renseigné",
        icon: <Calendar className="h-5 w-5 text-primary" />,
      },
      {
        label: "Type de chauffage",
        value: "Non renseigné",
        icon: <Flame className="h-5 w-5 text-primary" />,
      },
    ].map((item, index) => (
      <div key={index} className="bg-muted rounded-2xl p-6">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              {item.icon}
            </div>
            <span className="text-sm text-muted-foreground">{item.label}</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{item.value}</p>
        </div>
      </div>
    ))}
  </div>
); 