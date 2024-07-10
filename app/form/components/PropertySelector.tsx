import React, {useState} from 'react';
import maisonBlack from '../images/maisonBlack.png';
import masonWhite from '../images/maisonWhite.png';
import appartementBlack from '../images/appartementBlack.png';
import appartementWhite from '../images/appartementWhite.png';
import coproprieteBlack from '../images/coproBlack.png';
import coproprieteWhite from '../images/coproWhite.png';

import { StaticImageData } from 'next/image';

interface PropertyType {
  image: StaticImageData[];
  label: string;
  selected: boolean;
}

interface PropertySelectorProps {
  onChange: (selected: string | null) => void;
}

const PropertySelector: React.FC<PropertySelectorProps> = ({ onChange }) => {
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([
    { image: [masonWhite, maisonBlack], label: "Une maison individuelle", selected: false },
    { image: [appartementWhite, appartementBlack], label: "Appartement", selected: false },
    { image: [coproprieteWhite, coproprieteBlack], label: "Copropriété", selected: false },
  ]);  
  const handlePropertyClick = (index: number) => {
    const newPropertyTypes = propertyTypes.map((property, idx) => {
      const isSelected = idx === index ? !property.selected : false;
      if (isSelected) {
        onChange(property.label); // Appelle onChange avec l'index de la propriété sélectionnée
      }
      return {
        ...property,
        selected: isSelected,
      };
    });
    setPropertyTypes(newPropertyTypes);
  };
  
  return (
    <div className="flex-col w-[750px] select-none">
      <div className="flex space-x-4">
        {propertyTypes.map((type, index) => (
          <div key={`${type.label}-${index}`} onClick={() => handlePropertyClick(index)} className={`flex flex-col p-5 w-full font-light leading-6 text-center cursor-pointer ${type.selected ? 'text-slate-100 bg-zinc-800' : 'text-zinc-800 bg-slate-100'} rounded-2xl border border-solid border-zinc-800`}>
            <img loading="lazy" src={type.selected ? type.image[0].src : type.image[1].src} alt={type.label} className={"self-center aspect-square"} />
            <div className="mt-2.5">{type.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertySelector;