import React, { useState } from "react";
import type { LebensmittelItem } from "../../Hooks/useLebensmittelService";

interface OpenAmountModalProps {
  item: LebensmittelItem;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  darkMode: boolean;
  allItems?: LebensmittelItem[];
}

const OpenAmountModal: React.FC<OpenAmountModalProps> = ({
  item,
  onClose,
  onConfirm,
  darkMode,
  allItems = [],
}) => {
  const [amount, setAmount] = useState(1);
  const [error, setError] = useState("");

  // Calculate total quantity for this product
  const sameProducts = allItems.filter((i) => i.name === item.name);
  const totalQuantity = sameProducts.reduce((sum, i) => sum + i.quantity, 0);
  const totalNew = sameProducts
    .filter((i) => i.status === "neu")
    .reduce((sum, i) => sum + i.quantity, 0);
  const totalOpened = sameProducts
    .filter((i) => i.status === "verbraucht")
    .reduce((sum, i) => sum + i.quantity, 0);

  const handleAmountChange = (value: string) => {
    const newAmount = parseInt(value);

    if (isNaN(newAmount)) {
      setError("Bitte geben Sie eine gültige Zahl ein");
    }

    if (newAmount <= 0) {
      setError("Die Menge muss größer als 0 sein");
    }

    if (newAmount > item.quantity) {
      setError(
        `Die maximale Menge ist ${item.quantity} ${item.typ?.einheit || "Stk"}`
      );
    }

    setError("");
    setAmount(newAmount);
  };

  const handleConfirm = () => {
    if (amount > 0 && amount <= item.quantity) {
      onConfirm(amount);
    }
  };

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
          {item.name} als verbraucht markieren
        </h3>
        <div
          className={`mb-6 space-y-4 ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span>Gesamt:</span>
              <span className="font-medium">
                {totalQuantity} {item.typ?.einheit || "Stk"}
              </span>
            </div>
            {totalNew > 0 && (
              <div className="flex items-center justify-between">
                <span>Neu:</span>
                <span className="font-medium text-green-500">
                  {totalNew} {item.typ?.einheit || "Stk"}
                </span>
              </div>
            )}
            {totalOpened > 0 && (
              <div className="flex items-center justify-between">
                <span>verbraucht:</span>
                <span className="font-medium text-orange-500">
                  {totalOpened} {item.typ?.einheit || "Stk"}
                </span>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Wie viel möchten Sie als verbraucht markieren?
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className={`w-full p-2 rounded-md border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-white border-gray-300 text-gray-900"
              } ${error ? "border-red-500" : ""}`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border-2 border-[#a1c4fd] text-[#4a90e2] rounded-xl hover:border-[#c2e9fb] hover:text-[#2196f3] transition-colors duration-300"
            aria-label="Abbrechen"
          >
            Abbrechen
          </button>
          <button
            onClick={handleConfirm}
            disabled={!!error || amount <= 0 || amount > item.quantity}
            className={`px-4 py-2 bg-gradient-to-r from-[#a1c4fd] to-[#c2e9fb] text-[#4a90e2] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
              error || amount <= 0 || amount > item.quantity
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}
            aria-label="Bestätigen"
          >
            Bestätigen
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpenAmountModal;
