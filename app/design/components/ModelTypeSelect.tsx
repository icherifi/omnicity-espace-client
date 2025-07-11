import { useDesignPageContext } from "@/contexts/designPage.context";

const ModelTypeSelect = () => {
  const { selectedModelType, setSelectedModelType } = useDesignPageContext();

  return (
    <div className="absolute bottom-8 mt-4 text-white px-4 py-2 flex items-center justify-center">
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-full p-1 shadow-lg">
        <button
          className={`px-4 mx-0.5 py-2 rounded-full font-semibold transition-colors duration-300 ${
            selectedModelType === "2D" 
              ? "bg-purple-600 dark:bg-purple-500 text-white shadow-md"
              : "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
          } hover:bg-purple-200 dark:hover:bg-purple-300`}
          onClick={() => setSelectedModelType("2D")}
        >
          2D
        </button>
        <button
          className={`px-4 mx-0.5 py-2 rounded-full font-semibold transition-colors duration-300 ${
            selectedModelType === "3D" 
              ? "bg-purple-600 dark:bg-purple-500 text-white shadow-md" 
              : "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
          } hover:bg-purple-200 dark:hover:bg-purple-300`}
          onClick={() => setSelectedModelType("3D")}
        >
          3D
        </button>
        <button
          className={`px-4 mx-0.5 py-2 rounded-full font-semibold transition-colors duration-300 ${
            selectedModelType === "Virtuelle" 
              ? "bg-purple-600 dark:bg-purple-500 text-white shadow-md" 
              : "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
          } hover:bg-purple-200 dark:hover:bg-purple-300`}
          onClick={() => setSelectedModelType("Virtuelle")}
        >
          Virtuelle
        </button>
      </div>
    </div>
  );
};

export default ModelTypeSelect;
