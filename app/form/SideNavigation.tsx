// SideNavigation.tsx
"use client";
import React, { useState } from 'react';

interface NavItem {
  text: string;
  number: number;
}

interface SideNavigationProps {
  setCurrentPage: (page: number) => void;
}

const navItems: NavItem[] = [
  { text: "Votre bien", number: 1 },
  { text: "Travaux d'isolation", number: 2 },
  { text: "Énergétique", number: 3 },
];

const SideNavigation: React.FC<SideNavigationProps> = ({ setCurrentPage }) => {
  const [activeItem, setActiveItem] = useState<number>(1);

  const handleItemClick = (number: number) => {
    setCurrentPage(number);
    setActiveItem(number);
  };

  return (
    <div className="rounded-3xl bg-neutral-700">
      {navItems.map((item) => (
        <div
          key={item.number}
          className={`flex p-10 my-auto ${activeItem === item.number ? 'text-blue-300' : 'text-slate-100'}`}
          onClick={() => handleItemClick(item.number)}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
};

export default SideNavigation;