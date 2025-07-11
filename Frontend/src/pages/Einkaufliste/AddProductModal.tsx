import React, { useState } from "react";
import type { CategoryType, UnitType } from "../../types";

interface AddProductModalProps {
  modalIsOpen: boolean;
  setModalIsOpen: (isOpen: boolean) => void;
  newProductName: string;
  setNewProductName: (name: string) => void;
  newProductCategory: CategoryType;
  setNewProductCategory: React.Dispatch<React.SetStateAction<CategoryType>>;
  newProductEinheit: UnitType;
  setNewProductEinheit: React.Dispatch<React.SetStateAction<UnitType>>;
  categories: {
    id: CategoryType;
    name: string;
    color: string;
    icon: React.ElementType;
  }[];
  handleAddProduct: () => void;
  darkMode: boolean;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  modalIsOpen,
  setModalIsOpen,
  newProductName,
  setNewProductName,
  newProductCategory,
  setNewProductCategory,
  newProductEinheit,
  setNewProductEinheit,
  categories,
  handleAddProduct,
  darkMode,
}) => {
  const [menge, setMenge] = useState<number>(1);

  const handleSubmit = () => {
    if (!newProductName) {
      alert("Bitte füllen Sie alle erforderlichen Felder aus.");
      return;
    }

    handleAddProduct();

    setNewProductName("");
    setNewProductCategory("obst");
    setNewProductEinheit("stk");
    setMenge(1);
    setModalIsOpen(false);
  };

  if (!modalIsOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className={`rounded-lg p-6 max-w-md w-full ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h3
          className={`text-lg font-semibold mb-4 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Neues Produkt hinzufügen
        </h3>

        <div className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Name
            </label>
            <input
              type="text"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              className={`mt-1 block w-full rounded-md ${
                darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
              } border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
              placeholder="Produktname"
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Kategorie
            </label>
            <select
              value={newProductCategory}
              onChange={(e) =>
                setNewProductCategory(e.target.value as CategoryType)
              }
              className={`mt-1 block w-full rounded-md ${
                darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
              } border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className={`block text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Einheit
            </label>
            <select
              value={newProductEinheit}
              onChange={(e) => setNewProductEinheit(e.target.value as UnitType)}
              className={`mt-1 block w-full rounded-md ${
                darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
              } border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
            >
              <option value="stk">Stück</option>
              <option value="liter">Liter</option>
              <option value="g">Gramm</option>
              <option value="kg">Kilogramm</option>
            </select>
          </div>

          <div>
            <label
              className={`block text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Menge
            </label>
            <input
              type="number"
              value={menge}
              onChange={(e) => setMenge(Number(e.target.value))}
              min="1"
              className={`mt-1 block w-full rounded-md ${
                darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
              } border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={() => setModalIsOpen(false)}
            className="px-4 py-2 rounded-lg  border-2 border-[#a1c4fd] text-[#4a90e2]  hover:border-[#c2e9fb] hover:text-[#2196f3] transition-colors duration-300"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-gradient-to-r from-[#a1c4fd] to-[#c2e9fb] text-[#4a90e2] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Hinzufügen
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
