import React from 'react';

interface NavItem {
  text: string;
  number: number;
  active: boolean;
}

const navItems: NavItem[] = [
  { text: "Votre bien", number: 1, active: true },
  { text: "Travaux d'isolation", number: 2, active: false },
  { text: "Énergétique", number: 3, active: false },
];

const SideNavigation: React.FC = () => {
  return (
    <div className="flex flex-col rounded-3xl bg-neutral-700">
      {navItems.map((item, index) => (
        <div key={index} className={`flex p-10 my-auto ${item.active ? 'text-blue-300' : 'text-slate-100'}`}>{item.text}</div>
      ))}
    </div>
  );
};

export default SideNavigation;