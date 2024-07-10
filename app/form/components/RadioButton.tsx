import React from 'react';

interface RadioButtonProps {
  label: string;
  checked: boolean;
  image?: string;
}

const RadioButton: React.FC<RadioButtonProps> = ({ label, checked, image }) => {
  return (
    <label className="flex flex-1 gap-0 items-start text-sm tracking-normal leading-6 text-black whitespace-nowrap">
      {image && (
        <img loading="lazy" src={image} alt="" className="shrink-0 self-start mt-0 aspect-[0.78] w-[52px]" />
      )}
      <div className="flex items-center">
        <input
          type="radio"
          checked={checked}
          className="sr-only"
          onChange={() => {}}
        />
        <div className={`w-5 h-5 ${checked ? 'bg-blue-500' : 'bg-white'} rounded-full border border-solid border-stone-300 mr-2`}></div>
        <span className="my-auto">{label}</span>
      </div>
    </label>
  );
};

export default RadioButton;