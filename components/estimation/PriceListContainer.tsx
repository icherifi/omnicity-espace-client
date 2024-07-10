import React from 'react';
import PriceList from './PriceList';

const PriceListContainer: React.FC = () => {
  const priceItems = [
    { category: 'Cuisine', style: 'Style élégant', price: '3 375€' },
    { category: 'Salon', style: 'Style élégant', price: '2 275€' },
  ];

  return <PriceList items={priceItems} />;
};

export default PriceListContainer;