import React, { useState } from 'react';

interface EnergySource {
  name: string;
  image: string;
}

interface EnergySourceCardProps {
  options: EnergySource[];
  onChange: (selected: string | null) => void;
  selectedOption: string;
}

const EnergySourceCard: React.FC<EnergySourceCardProps> = ({ options, selectedOption: initialSelectedOption, onChange }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(initialSelectedOption);
  const handleOptionClick = (option: string) => {
    const newSelectedOption = option === selectedOption ? null : option;
    setSelectedOption(newSelectedOption);
    onChange(newSelectedOption); // Appelle onChange avec la nouvelle option sélectionnée
  }
  return (
    <>
      {options.map((option) => {
        const isSelected = option.name === selectedOption;
        const buttonClass = `flex flex-col items-center px-7 py-4 whitespace-nowrap rounded-3xl bg-grey-200 shadow-md h-[130px] w-[130px] max-md:px-5 ${isSelected ? 'border border-solid border-zinc-800' : ''}`;
        return (
          <button key={option.name} onClick={() => handleOptionClick(option.name)} className={buttonClass}>
            <img loading="lazy" src={option.image} alt={`${option.name} icon`} className="aspect-square w-[70px]" />
            <div>{option.name}</div>
          </button>
        );
      })}
    </>
  );
};

export default EnergySourceCard;