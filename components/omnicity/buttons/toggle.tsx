const ToggleButton = ({
  isSelected,
  onClick,
  children,
}: {
  isSelected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    className={`${
      isSelected ? "bg-violet-500 text-white" : "bg-transparent text-gray-600"
    } rounded-full px-4 py-2 focus:outline-none transition-colors duration-200`}
    onClick={onClick}
  >
    {children}
  </button>
);

export default ToggleButton;
