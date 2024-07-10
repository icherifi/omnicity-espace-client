import React from 'react';

interface HeatingTypeButtonProps {
  text: string;
  active: boolean;
}

const HeatingTypeButton: React.FC<HeatingTypeButtonProps> = ({ text, active }) => {
  return (
    <button
      className={`justify-center px-5 py-3 rounded border border-solid ${
        active ? 'bg-slate-500 bg-opacity-60' : ''
      } border-zinc-800`}
    >
      {text}
    </button>
  );
};

export default HeatingTypeButton;