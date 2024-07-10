import React, { useState } from 'react';

interface QuestionWithOptionsProps {
  question: string;
  options: string[];
  selectedOption: string;
  onChange: (selected: string | null) => void; // Ajoutez la propriété onChange
}

const QuestionWithOptions: React.FC<QuestionWithOptionsProps> = ({ question, options, selectedOption: initialSelectedOption, onChange }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(initialSelectedOption);

  // Mettez à jour setSelectedOption et appelez onChange avec la nouvelle valeur
  const handleOptionClick = (option: string) => {
    const newSelectedOption = option === selectedOption ? null : option;
    setSelectedOption(newSelectedOption);
    onChange(newSelectedOption); // Appelle onChange avec la nouvelle option sélectionnée
  };

  return (
    <section className="mb-14 max-md:mb-10">
      <h2 className="w-full text-sm tracking-normal leading-6 text-neutral-700 max-md:max-w-full">{question}</h2>
      <div className="flex gap-3 pr-20 mt-4 text-xs leading-4 text-black max-md:flex-wrap max-md:pr-5">
        {options.map((option) => (
          <button
            key={option} // Ajoutez une clé unique pour chaque bouton
            onClick={() => handleOptionClick(option)}
            className={`justify-center px-3 py-3 rounded bg-grey-200 shadow-md ${
              option === selectedOption
                ? 'bg-opacity-70 border border-solid border-zinc-800 text-neutral-900 shadow-md'
                : 'border border-transparent'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </section>
  );
};

export default QuestionWithOptions;