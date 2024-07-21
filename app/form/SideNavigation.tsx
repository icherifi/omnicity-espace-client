// SideNavigation.tsx
"use client";
import React, { useState } from "react";

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
    <div className="rounded-3xl bg-neutral-700 shadow-lg">
      {navItems.map((item) => (
        <div
          key={item.number}
          className={`p-5 my-2 mx-5 cursor-pointer transition-colors duration-300 rounded-lg hover:bg-neutral-600 ${
            activeItem === item.number
              ? "text-blue-200 bg-neutral-600"
              : "text-slate-100"
          }`}
          onClick={() => handleItemClick(item.number)}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
};

export default SideNavigation;
