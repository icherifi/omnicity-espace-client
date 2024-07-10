"use client";
import React, { useState } from 'react';

type IncomeSliderProps = {
  onChange: (value: number) => void;
};

const IncomeSlider: React.FC<IncomeSliderProps> = ({onChange}) => {
  const [income, setIncome] = useState(5000000);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIncome(Number(event.target.value));
    onChange(Number(event.target.value)); 
  };

  const formattedIncome = new Intl.NumberFormat('fr-FR').format(income);

  return (
    <div className="flex-1 text-sm tracking-normal leading-6 text-neutral-900">
        Revenu annuel moyen de votre foyer fiscal
      <div className="flex">
        <input
          type="range"
          id="income-slider"
          min="0"
          max="25000000"
          step="1000"
          value={income}
          onChange={handleSliderChange}
          className="w-full mt-2"
        />
      </div>
      <div className="self-end mt-6 text-xs leading-4 text-right text-neutral-800">
        {formattedIncome} €
      </div>
    </div>
  );
};

export default IncomeSlider;
