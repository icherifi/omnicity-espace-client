import { useDesignPageContext } from "@/contexts/designPage.context";

const ModelTypeSelect = () => {
  const { selectedModelType, setSelectedModelType } = useDesignPageContext();

  return (
    <div className="absolute bottom-[-75px] left-1/2 transform -translate-x-1/2 text-white px-4 py-2 flex items-center justify-center">
      <div className="flex bg-gray-800 rounded-full p-1 shadow-lg">
        <button
          className={`px-4 mx-0.5 py-2 rounded-full text-white font-semibold transition-colors duration-300 ${
            selectedModelType === "2D" ? "bg-purple-700" : "bg-gray-500"
          }`}
          onClick={() => setSelectedModelType("2D")}
        >
          2D
        </button>
        <button
          className={`px-4 mx-0.5 py-2 rounded-full text-white font-semibold transition-colors duration-300 ${
            selectedModelType === "3D" ? "bg-purple-700" : "bg-gray-500"
          }`}
          onClick={() => setSelectedModelType("3D")}
        >
          3D
        </button>
        <button
          className={`px-4 mx-0.5 py-2 rounded-full text-white font-semibold transition-colors duration-300 ${
            selectedModelType === "Virtuelle" ? "bg-purple-700" : "bg-gray-500"
          }`}
          onClick={() => setSelectedModelType("Virtuelle")}
        >
          Virtuelle
        </button>
      </div>
    </div>
  );
};

export default ModelTypeSelect;
