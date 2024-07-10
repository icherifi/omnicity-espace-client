import React from 'react';

interface PropertyType {
  image: string;
  label: string;
  selected: boolean;
}

const propertyTypes: PropertyType[] = [
  { image: "https://cdn.builder.io/api/v1/image/assets/TEMP/a54d6ac20a8d9d2f06ec0c30b508dc0898e11d7400a6489a795b5e7056877454?apiKey=74bccfb37e4243edb00646365d401f63&", label: "Une maison individuelle", selected: false },
  { image: "https://cdn.builder.io/api/v1/image/assets/TEMP/926bf6fc514566714fcb7eb3c6dc2310b10c5e5e367b74ffba9a3ed03531e369?apiKey=74bccfb37e4243edb00646365d401f63&", label: "Appartement", selected: true },
  { image: "https://cdn.builder.io/api/v1/image/assets/TEMP/95f18e7e183c365e222083caaf8ee3eb23401ed62c13ec92c04bc5ffd3bd1d28?apiKey=74bccfb37e4243edb00646365d401f63&", label: "Copropriété", selected: false },
];

const PropertySelector: React.FC = () => {
  return (
    <div className="flex-col w-[750px]">
      <div className="flex space-x-4">
        {propertyTypes.map((type, index) => (
          <div key={`${type.label}-${index}`} className={`flex flex-col p-5 w-full text-base font-light tracking-normal leading-6 text-center ${type.selected ? 'text-slate-100 bg-zinc-800' : 'text-zinc-800 bg-slate-100'} rounded-2xl border border-solid border-zinc-800`}>
            <img loading="lazy" src={type.image} alt={type.label} className={"self-center aspect-square"} />
            <div className="mt-2.5">{type.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertySelector;