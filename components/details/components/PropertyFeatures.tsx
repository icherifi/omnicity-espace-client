import { ProjectType } from '@/types/project.types';

interface PropertyFeaturesProps {
  currentProjectDisplayed: ProjectType;
}

export const PropertyFeatures = ({ currentProjectDisplayed }: PropertyFeaturesProps) => (
  <div className="grid grid-cols-1 my-6 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
    {[
      { 
        label: 'Surface', 
        value: `${currentProjectDisplayed?.iziResponse?.inputQr["Sa surface habitable (m²) :"] || 'N/A'} m²`,
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
          </svg>
        )
      },
      { 
        label: 'Nombre de pièces',
        value: currentProjectDisplayed?.features.roomsNumber,
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        )
      },
      { 
        label: "Nombre d'étages",
        value: currentProjectDisplayed?.iziResponse?.inputQr["Le nombre de niveaux habités :"]?.[0] || 'N/A',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
          </svg>
        )
      }
    ].map((item, index) => (
      <div key={index} className="bg-gray-50 rounded-2xl p-6">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-violet-100 rounded-lg">
              {item.icon}
            </div>
            <span className="text-sm text-gray-600">{item.label}</span>
          </div>
          <p className="text-2xl font-bold">{item.value}</p>
        </div>
      </div>
    ))}
  </div>
); 