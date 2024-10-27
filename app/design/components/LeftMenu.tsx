import React, { useState } from "react";
import Cards from "./assets";

type IconProps = {
  src: string;
  alt: string;
  className: string;
};

const Icon: React.FC<IconProps> = ({ src, alt, className }) => (
  <img loading="lazy" src={src} alt={alt} className={className} />
);

type MenuItemProps = {
  icon: string;
  label: string;
  onClick?: () => void;
};

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, onClick }) => (
  <button
    className="flex flex-col items-center p-2 text-white bg-transparent cursor-pointer focus:outline-none hover:border hover:border-white"
    onClick={onClick} // Attach the onClick handler
  >
    <Icon src={icon} alt={label} className="self-center" />
    <div className="mt-2">{label}</div>
  </button>
);

const LeftMenuProps: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const menuItems = [
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/ca6ecc5c816710100a20c0acc7d88d57dc47bda6f755af5f3353cdf8d175c94a?apiKey=858b66c2b4354cc3a906a614db0ca181&",
      label: "chambre",
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/9510a5eb74803ac1616e8fe1984b6c26f1e1b32731c758c226b7a609d00a0f8b?apiKey=858b66c2b4354cc3a906a614db0ca181&",
      label: "cuisine",
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/7470592be65be4fa7fd066a6a97929863f01236ff03a9af26b1eaa97b84d6d4c?apiKey=858b66c2b4354cc3a906a614db0ca181&",
      label: "salle de bain",
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/377c16140943ba2975dcb138c770903f7ead65af43b29a49b96952117afe896b?apiKey=858b66c2b4354cc3a906a614db0ca181&",
      label: "salon",
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/02dda281fab8eae5a808448f9f143a33adf13ba86bab860511713cd7254c69a4?apiKey=858b66c2b4354cc3a906a614db0ca181&",
      label: "entrée",
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/c40560d59f01a659168ff836e1167b38c819898072cf6769df963ad762f576cf?apiKey=858b66c2b4354cc3a906a614db0ca181&",
      label: "buanderie",
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/17d9c87f3cae3cf7c073e3c6788f48f3abfba31119d69ecc72ca480b4045b867?apiKey=858b66c2b4354cc3a906a614db0ca181&",
      label: "luminaires",
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/bf281199ec4c16e49904c3a698a8b6b5e8d786205045df453d17e5287bdb2f47?apiKey=858b66c2b4354cc3a906a614db0ca181&",
      label: "plantes",
    },
  ];

  return (
    <div className="flex justify-start max-h-screen">
      <div className="flex flex-col px-2.5 py-10 rounded-none text-center text-white bg-neutral-800 space-y-4 h-screen">
        {menuItems.slice(0).map((item, index) => (
          <MenuItem
            key={index}
            icon={item.icon}
            label={item.label}
            onClick={() => {
              console.log(`Clicked ${item.label}`);
              setSelectedRoom((prevRoom) =>
                prevRoom === item.label ? null : item.label
              );
            }}
          />
        ))}
      </div>
      {selectedRoom && <Cards room={selectedRoom} />}
    </div>
  );
};

export default LeftMenuProps;
