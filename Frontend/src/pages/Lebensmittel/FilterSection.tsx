import React from "react";

interface FilterSectionProps {
  filterOpen: boolean;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  darkMode: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  filterOpen,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  darkMode,
}) => {
  if (!filterOpen) return null;

  const categories = [
    "obst",
    "gemüse",
    "fleisch",
    "milchprodukt",
    "getränk",
    "teigwaren",
    "brot",
    "tiefkühl",
    "anderes",
  ];

  const statuses = ["neu", "verbraucht"];

  return (
    <div
      className={`mt-4 p-6 rounded-lg border shadow-sm ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              darkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Kategorie
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`w-full p-3 border rounded-lg ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-gray-200"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            <option value="">Alle Kategorien</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              darkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={`w-full p-3 border rounded-lg ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-gray-200"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            <option value="">Alle Status</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
