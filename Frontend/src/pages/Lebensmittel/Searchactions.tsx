import React, { useMemo } from "react";
import { Search, Plus, Filter, ArrowUpDown, ChevronDown } from "lucide-react";
import type { CategoryType, LebensmittelTyp } from "../../types";

interface SearchAndActionsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setShowAddModal: (show: boolean) => void;
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
  darkMode?: boolean; // Varsayılan değer eklenebilir
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  sortDirection: "asc" | "desc";
  setSortDirection: (direction: "asc" | "desc") => void;
  lebensmittelTypen: LebensmittelTyp[];
  selectedProduct: string;
  setSelectedProduct: (product: string) => void;
}

const categories: CategoryType[] = [
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

const sortOptions = [
  { value: "name", label: "Name" },
  { value: "expirationDate", label: "Ablaufdatum" },
];

const SearchAndActions: React.FC<SearchAndActionsProps> = ({
  searchTerm,
  setSearchTerm,
  setShowAddModal,
  filterOpen,
  setFilterOpen,
  darkMode = false, // Varsayılan değer
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  sortBy,
  setSortBy,
  sortDirection,
  setSortDirection,
  lebensmittelTypen,
  selectedProduct,
  setSelectedProduct,
}) => {
  const handleSort = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  // Kategoriye göre filtrelenmiş ürünleri hesapla
  const filteredProducts = useMemo(() => {
    return selectedCategory
      ? lebensmittelTypen.filter((typ) => typ.category === selectedCategory)
      : lebensmittelTypen;
  }, [lebensmittelTypen, selectedCategory]);

  // Kategori değiştiğinde seçili ürünü sıfırla
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    setSelectedProduct(""); // Seçili ürünü sıfırla
  };

  return (
    <div className="mb-8">
      <div
        className={`rounded-xl shadow-lg p-6 backdrop-blur-lg ${
          darkMode ? "bg-gray-800" : "bg-white bg-opacity-90"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-3">
            <div
              className={`flex items-center rounded-lg p-3 border focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all group ${
                darkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <Search className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Suchen Sie nach Lebensmitteln..."
                className={`flex-1 bg-transparent border-none focus:outline-none text-lg ${
                  darkMode
                    ? "placeholder-gray-500 text-gray-200"
                    : "placeholder-gray-400 text-gray-700"
                }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Lebensmittel suchen"
              />
            </div>
          </div>

          <div>
            <button
              onClick={() => setShowAddModal(true)}
              className="group w-full h-full flex items-center justify-center cursor-pointer transition-all duration-300 bg-gradient-to-br from-[#a1c4fd] to-[#c2e9fb]  rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 text-[#4a90e2]"
              title="Neuen Artikel hinzufügen"
              aria-label="Neuen Artikel hinzufügen"
            >
              <Plus className="w-5 h-5 mr-2 text-[#4a90e2]" />
              Artikel hinzufügen
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              darkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            title="Filteroptionen anzeigen"
            aria-label="Filteroptionen anzeigen"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                darkMode
                  ? "bg-gray-700 text-gray-300 border-gray-600"
                  : "bg-gray-100 text-gray-600 border-gray-200"
              } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              aria-label="Sortieren nach"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              onClick={handleSort}
              className={`p-2 rounded-lg transition-all ${
                darkMode
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              title={
                sortDirection === "asc"
                  ? "Aufsteigend sortieren"
                  : "Absteigend sortieren"
              }
              aria-label={
                sortDirection === "asc"
                  ? "Aufsteigend sortieren"
                  : "Absteigend sortieren"
              }
            >
              <ArrowUpDown
                className={`w-4 h-4 transform transition-transform ${
                  sortDirection === "desc" ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {filterOpen && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Kategorie
              </label>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className={`w-full px-4 py-2 rounded-lg appearance-none ${
                    darkMode
                      ? "bg-gray-700 text-gray-200 border-gray-600"
                      : "bg-white text-gray-900 border-gray-200"
                  } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  aria-label="Kategorie auswählen"
                >
                  <option value="">Alle Kategorien</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400" />
              </div>
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Produkt
              </label>
              <div className="relative">
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg appearance-none ${
                    darkMode
                      ? "bg-gray-700 text-gray-200 border-gray-600"
                      : "bg-white text-gray-900 border-gray-200"
                  } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  aria-label="Produkt auswählen"
                >
                  <option value="">Alle Produkte</option>
                  {filteredProducts.map((typ) => (
                    <option key={typ._id} value={typ._id}>
                      {typ.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400" />
              </div>
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Status
              </label>
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg appearance-none ${
                    darkMode
                      ? "bg-gray-700 text-gray-200 border-gray-600"
                      : "bg-white text-gray-900 border-gray-200"
                  } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  aria-label="Status auswählen"
                >
                  <option value="">Alle Status</option>
                  <option value="neu">Neu</option>
                  <option value="verbraucht">verbraucht</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchAndActions;
