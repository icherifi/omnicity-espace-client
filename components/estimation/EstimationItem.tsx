import React, { useState, ReactNode  } from 'react';

interface EstimationItemProps {
  title: string;
  children: ReactNode;
}

const iconSrc = 'https://cdn.builder.io/api/v1/image/assets/TEMP/5a3d1ba99d69b87c7a7feab58d5c1b85ca6e1fe893abc5366ffffbcdf49fa79d?apiKey=74bccfb37e4243edb00646365d401f63&';
const EstimationItem: React.FC<EstimationItemProps> = ({ title, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mt-7">
      <div
        className="flex gap-5 px-3.5 text-xl tracking-tight leading-6 whitespace-nowrap bg-white rounded border border-solid shadow-sm border-neutral-200 text-neutral-700 cursor-pointer"
        onClick={toggleExpand}
      >
        <div className="flex-auto self-start mt-3">{title}</div>
        <img
          loading="lazy"
          src={iconSrc}
          className={`shrink-0 w-11 aspect-[1.37] transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`}
          alt=""
        />
      </div>
      {isExpanded && (
        <div className="p-2 bg-white rounded border border-neutral-200">
          {children}
        </div>
      )}
    </div>
  );
};

export default EstimationItem;