import React from 'react';

interface SelectFieldProps {
  label: string;
  values: string[];
  onChange: (selected: string) => void;

}

const SelectField: React.FC<SelectFieldProps> = ({ label, values, onChange }) => {

  return (
    <div className="flex flex-col flex-1 grow shrink-0 basis-0 w-fit">
      <label className="tracking-normal leading-6 text-neutral-700">{label}</label>
      <select
        className="justify-center items-start px-3 py-1.5 mt-1 bg-white rounded border border-solid shadow-sm border-neutral-200 leading-[143%] text-neutral-500 max-md:pr-5"
        onChange={(e) => onChange(e.target.value)}
      >
        {values.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;