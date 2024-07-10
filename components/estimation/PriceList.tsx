import React from 'react';

interface PriceListProps {
  items: { category: string; style: string; price: string; }[];
}

const PriceList: React.FC<PriceListProps> = ({ items }) => {
  return (
    <section className="text-black">
      {items.map((item, index) => (
        <div key={index} className="flex justify-between">
            <div className="self-end flex flex-col text-lg font-medium tracking-normal leading-6">
                <div>{item.category}</div>
                <div className="font-light text-sm">{item.style}</div>
            </div>
          <div className="self-end text-base font-bold tracking-normal leading-6 mt-16">
            {item.price}
          </div>
        </div>
      ))}
    </section>
  );
};

export default PriceList;
