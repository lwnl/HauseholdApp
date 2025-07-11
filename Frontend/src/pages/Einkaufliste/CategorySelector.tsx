import React from "react";

interface Category {
  id:
    | "obst"
    | "gemüse"
    | "fleisch"
    | "milchprodukt"
    | "getränk"
    | "teigwaren"
    | "brot"
    | "tiefkühl"
    | "anderes";
  name: string;
  color: string;
  icon: React.ElementType;
}

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory:
    | "obst"
    | "gemüse"
    | "fleisch"
    | "milchprodukt"
    | "getränk"
    | "teigwaren"
    | "brot"
    | "tiefkühl"
    | "anderes";
  setSelectedCategory: React.Dispatch<
    React.SetStateAction<
      | "obst"
      | "gemüse"
      | "fleisch"
      | "milchprodukt"
      | "getränk"
      | "teigwaren"
      | "brot"
      | "tiefkühl"
      | "anderes"
    >
  >;
  darkMode: boolean;
  className?: string;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  darkMode,
  className = "",
}) => {
  return (
    <div className="w-full md:w-auto min-w-max rounded-xl shadow-lg p-4">
      {/* Select for mobile view */}
      <div className="block md:hidden">
        <select
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(e.target.value as Category["id"])
          }
          className={`w-full p-3 rounded-lg ${
            darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"
          }`}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Grid for desktop view */}
      <div className="hidden md:grid grid-cols-2 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <div
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`w-[104px] h-[104px] p-4 flex flex-col justify-center items-center text-center cursor-pointer transition-all duration-300 rounded-xl ${
                selectedCategory === category.id
                  ? "shadow-lg hover:shadow-xl"
                  : "shadow-md hover:shadow-lg"
              } hover:-translate-y-1`}
              style={{
                background:
                  selectedCategory === category.id
                    ? `linear-gradient(120deg, ${category.color}, ${category.color}80)`
                    : darkMode
                    ? "bg-gray-700"
                    : "white",
                boxShadow:
                  selectedCategory === category.id
                    ? `0 4px 15px 0 ${category.color}66`
                    : "0 2px 8px 0 rgba(31, 38, 135, 0.1)",
              }}
            >
              <Icon
                className="!w-10 !h-10 mb-2"
                style={{
                  color:
                    selectedCategory === category.id ? "white" : category.color,
                }}
              />
              <div
                className="font-bold text-base"
                style={{
                  color:
                    selectedCategory === category.id
                      ? "white"
                      : darkMode
                      ? "white"
                      : "#374151",
                }}
              >
                {category.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySelector;
