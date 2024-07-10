import React from 'react';

const householdSizes = [1, 2, 3, 5, 6, 7, 8, 9];

const HouseholdSizeSelector: React.FC = () => {
  return (
    <div className="flex-1 text-sm tracking-normal leading-6 text-neutral-900">
        Nombre d'habitants composant votre foyer fiscal
      <div className="flex gap-2.5 font-light leading-6 text-black whitespace-nowrap">
        {householdSizes.map((size, index) => (
          <button
            key={index + size.toString()}
            type="button"
            className={`justify-center px-3.5 py-1.5 rounded shadow-sm bg-slate-100 ${size === 2 ? 'border border-solid border-zinc-800' : ''}`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HouseholdSizeSelector;