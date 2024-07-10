import React from 'react';
import './form.module.css';
import style from './form.module.css';

interface InputFieldProps {
  label: string;
  type: string;
  defaultValue: string;
  onChange: (selected: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({ label, type, defaultValue, onChange }) => {
  return (
    <div className="flex flex-col flex-1">
      <label htmlFor={label.toLowerCase().replace(/\s/g, '-')} className="text-sm tracking-normal leading-6 text-neutral-700">
        {label}
      </label>
      <input
        type={type}
        id={label.toLowerCase().replace(/\s/g, '-')}
        defaultValue={defaultValue}
        className={`${style.input} justify-center items-start px-5 py-4 mt-1.5 text-xs text-black bg-white rounded-xl border border-solid shadow-sm border-neutral-200`}
        onChange={(e) => onChange(e.target.value)} 
      />
    </div>
  );
};

export default InputField;
