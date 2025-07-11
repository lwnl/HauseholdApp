import React, { useState } from "react";
import type { CategoryType, UnitType } from "../../types";

interface AddItemModalProps {
  showAddModal: boolean;
  setShowAddModal: (isOpen: boolean) => void;
  onCreate: (data: {
    name: string;
    category: CategoryType;
    einheit: UnitType;
    expirationDate: Date;
    preis?: number;
    menge: number;
  }) => void;
  darkMode: boolean;
}

const AddItemModal: React.FC<AddItemModalProps> = ({
  showAddModal,
  setShowAddModal,
  onCreate,
  darkMode,
}) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<CategoryType>("obst");
  const [einheit, setEinheit] = useState<UnitType>("stk");
  const [expirationDate, setExpirationDate] = useState("");
  const [menge, setMenge] = useState(1);
  const [preis, setPreis] = useState<number | undefined>(undefined);

  const handleSubmit = () => {
    if (!name || !expirationDate) {
      alert("Bitte füllen Sie alle erforderlichen Felder aus.");
      return;
    }

    const expirationDateObj = new Date(expirationDate);
    onCreate({
      name,
      category,
      einheit,
      expirationDate: expirationDateObj,
      preis,
      menge,
    });

    setName("");
    setCategory("obst");
    setEinheit("stk");
    setExpirationDate("");
    setMenge(1);
    setPreis(undefined);
    setShowAddModal(false);
  };

  if (!showAddModal) return null;

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
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryType)}
              className={`mt-1 block w-full rounded-md ${
                darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
              } border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
            >
              <option value="obst">Obst</option>
              <option value="gemüse">Gemüse</option>
              <option value="fleisch">Fleisch</option>
              <option value="milchprodukt">Milch Pro.</option>
              <option value="getränk">Getränk</option>
              <option value="teigwaren">Teigwaren</option>
              <option value="brot">Brot</option>
              <option value="tiefkühl">Tiefkühl</option>
              <option value="anderes">Anderes</option>
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
              value={einheit}
              onChange={(e) => setEinheit(e.target.value as UnitType)}
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
              Ablaufdatum
            </label>
            <input
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              className={`mt-1 block w-full rounded-md ${
                darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
              } border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
            />
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

          <div>
            <label
              className={`block text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Preis
            </label>
            <input
              type="number"
              value={preis}
              onChange={(e) => setPreis(Number(e.target.value))}
              min="0"
              step="0.01"
              className={`mt-1 block w-full rounded-md ${
                darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
              } border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={() => setShowAddModal(false)}
            className="px-4 py-2 border-2 border-[#a1c4fd] text-[#4a90e2] rounded-xl hover:border-[#c2e9fb] hover:text-[#2196f3] transition-colors duration-300"
            aria-label="Abbrechen"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-gradient-to-r from-[#a1c4fd] to-[#c2e9fb] text-[#4a90e2] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            aria-label="Speichern"
          >
            Hinzufügen
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;
