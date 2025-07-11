import React, { useState } from "react";
import type { LebensmittelItem } from "../../Hooks/useLebensmittelService";

interface DeleteConfirmationModalProps {
  item: LebensmittelItem;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  darkMode: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  item,
  onClose,
  onConfirm,
  darkMode,
}) => {
  const [deleteAmount, setDeleteAmount] = useState<number>(item.quantity || 1);
  const [error, setError] = useState<string>("");

  // Calculate total quantities
  const totalQuantity = item.quantity || 0;
  const totalNew = item.neu || 0;
  const totalverbraucht = item.verbraucht || 0;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseInt(e.target.value);
    if (isNaN(amount) || amount <= 0) {
      setError("Bitte geben Sie eine gültige Zahl ein");
      return;
    }

    if (amount > totalQuantity) {
      setError(
        `Die maximale Menge ist ${totalQuantity} ${item.typ?.einheit || "Stk"}`
      );
      return;
    }

    setError("");
    setDeleteAmount(amount);
  };

  const handleDelete = () => {
    if (deleteAmount > 0 && deleteAmount <= totalQuantity) {
      onConfirm(deleteAmount);
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
          {item.name} löschen
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
            {totalverbraucht > 0 && (
              <div className="flex items-center justify-between">
                <span>verbraucht:</span>
                <span className="font-medium text-orange-500">
                  {totalverbraucht} {item.typ?.einheit || "Stk"}
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Wie viel möchten Sie löschen?
            </label>
            <input
              type="number"
              min="1"
              max={totalQuantity}
              value={deleteAmount}
              onChange={handleAmountChange}
              className={`w-full p-2 rounded-md border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-white border-gray-300 text-gray-900"
              } ${error ? "border-red-500" : ""}`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <p>Möchten Sie diesen Artikel wirklich löschen?</p>
          <p className="text-sm text-yellow-500">
            Hinweis: Bei mehreren Artikeln werden zuerst verbrauchte Artikel
            gelöscht.
          </p>
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
            onClick={handleDelete}
            disabled={
              !!error || deleteAmount <= 0 || deleteAmount > totalQuantity
            }
            className={`px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
              error || deleteAmount <= 0 || deleteAmount > totalQuantity
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-red-700"
            }`}
            aria-label="Löschen"
          >
            Löschen
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
