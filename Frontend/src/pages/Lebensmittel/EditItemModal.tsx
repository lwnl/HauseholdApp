import React, { useState, useEffect } from "react";
import type { Lebensmittel } from "../../types";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Package, Clock, ShoppingBag, Tag } from "lucide-react";

interface EditItemModalProps {
  showEditModal: boolean;
  setShowEditModal: (show: boolean) => void;
  item: Lebensmittel | null;
  onUpdate: (id: string, data: Partial<Lebensmittel>) => void;
  darkMode: boolean;
  allItems?: Lebensmittel[];
}

const EditItemModal: React.FC<EditItemModalProps> = ({
  showEditModal,
  setShowEditModal,
  item,
  onUpdate,
  darkMode,
  allItems = [],
}) => {
  const [status, setStatus] = useState(item?.status || "neu");
  const [expirationDate, setExpirationDate] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [amount, setAmount] = useState(item?.menge || 1);
  const [price, setPrice] = useState(item?.preis?.toString() || "");
  const [selectedItemId, setSelectedItemId] = useState<string>(item?._id || "");
  const [listName, setListName] = useState("");

  // Find items with the same name and sort by date
  const sameNameItems = item
    ? allItems
        .filter((i) => i.typ.name === item.typ.name)
        .sort(
          (a, b) =>
            new Date(b.purchaseDate).getTime() -
            new Date(a.purchaseDate).getTime()
        )
    : [];

  // Group items by purchase date for better organization
  const groupedItems = sameNameItems.reduce((acc, curr) => {
    const purchaseDate = new Date(curr.purchaseDate).toLocaleDateString();
    if (!acc[purchaseDate]) {
      acc[purchaseDate] = [];
    }
    acc[purchaseDate].push(curr);
    return acc;
  }, {} as Record<string, Lebensmittel[]>);

  // Calculate total quantities
  const totalQuantity = sameNameItems.reduce((sum, i) => sum + i.menge, 0);
  const totalNew = sameNameItems
    .filter((i) => i.status === "neu")
    .reduce((sum, i) => sum + i.menge, 0);
  const totalOpened = sameNameItems
    .filter((i) => i.status === "verbraucht")
    .reduce((sum, i) => sum + i.menge, 0);

  useEffect(() => {
    if (item) {
      setStatus(item.status);
      setExpirationDate(
        new Date(item.expirationDate).toISOString().split("T")[0]
      );
      setPurchaseDate(new Date(item.purchaseDate).toISOString().split("T")[0]);
      setAmount(item.menge || 1);
      setPrice(item.preis?.toString() || "");
      setSelectedItemId(item._id);

      // Generate a list name based on purchase date
      const purchaseDate = new Date(item.purchaseDate);
      setListName(`Einkauf vom ${purchaseDate.toLocaleDateString("de-DE")}`);
    }
  }, [item]);

  const handleUpdateItem = () => {
    if (!selectedItemId) return;

    const updatedData: Partial<Lebensmittel> = {
      status,
      expirationDate: new Date(expirationDate).toISOString(),
      purchaseDate: new Date(purchaseDate).toISOString(),
      menge: Number(amount),
      preis: price ? Number(price) : undefined,
    };

    onUpdate(selectedItemId, updatedData);
    setShowEditModal(false);
  };

  if (!showEditModal || !item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className={`rounded-lg p-6 max-w-2xl w-full ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h3
          className={`text-lg font-semibold mb-4 ${
            darkMode ? "text-gray-100" : "text-gray-900"
          }`}
        >
          {item.typ.name} bearbeiten
        </h3>

        <div className="flex gap-6">
          {/* Product Selection */}
          <div className="w-1/2">
            <div
              className={`p-4 rounded-lg mb-4 ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <Package
                  className={darkMode ? "text-gray-300" : "text-gray-600"}
                  size={20}
                />
                <span className="font-medium">Produktdetails</span>
              </div>
              <div
                className={`text-sm space-y-2 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                <div>
                  Kategorie:{" "}
                  <span className="font-medium">{item.typ.category}</span>
                </div>
                <div>
                  Einheit:{" "}
                  <span className="font-medium">{item.typ.einheit}</span>
                </div>
                <div className="mt-4">
                  <div className="font-medium mb-1">Bestand:</div>
                  <div className="flex justify-between">
                    <span>Gesamt:</span>
                    <span>
                      {totalQuantity} {item.typ.einheit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Neu:</span>
                    <span className="text-green-500">
                      {totalNew} {item.typ.einheit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>verbraucht:</span>
                    <span className="text-orange-500">
                      {totalOpened} {item.typ.einheit}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {Object.keys(groupedItems).length > 0 && (
              <div>
                <h4
                  className={`text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Einkaufslisten ({Object.keys(groupedItems).length})
                </h4>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {Object.entries(groupedItems).map(
                      ([date, items], index) => (
                        <div
                          key={date}
                          className={`p-3 rounded-lg border ${
                            darkMode
                              ? "border-gray-700 bg-gray-700/50"
                              : "border-gray-200 bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <ShoppingBag className="w-4 h-4 text-blue-500" />
                            <span
                              className={`text-sm font-medium ${
                                darkMode ? "text-gray-200" : "text-gray-900"
                              }`}
                            >
                              {index === 0 ? listName : `Einkauf vom ${date}`}
                            </span>
                          </div>

                          <div className="space-y-2 mt-3">
                            {items.map((sameItem) => (
                              <div
                                key={sameItem._id}
                                className={`p-2 rounded-lg border transition-all ${
                                  selectedItemId === sameItem._id
                                    ? "border-blue-500 bg-blue-50/10"
                                    : darkMode
                                    ? "border-gray-600 hover:border-gray-500"
                                    : "border-gray-200 hover:border-gray-300"
                                } cursor-pointer`}
                                onClick={() => {
                                  setSelectedItemId(sameItem._id);
                                  setStatus(sameItem.status);
                                  setExpirationDate(
                                    new Date(sameItem.expirationDate)
                                      .toISOString()
                                      .split("T")[0]
                                  );
                                  setPurchaseDate(
                                    new Date(sameItem.purchaseDate)
                                      .toISOString()
                                      .split("T")[0]
                                  );
                                  setAmount(sameItem.menge);
                                  setPrice(sameItem.preis?.toString() || "");
                                }}
                              >
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <Tag
                                      className={`w-3 h-3 ${
                                        sameItem.status === "neu"
                                          ? "text-green-500"
                                          : "text-orange-500"
                                      }`}
                                    />
                                    <span
                                      className={`text-sm ${
                                        sameItem.status === "neu"
                                          ? "text-green-500"
                                          : "text-orange-500"
                                      }`}
                                    >
                                      {sameItem.status === "neu"
                                        ? "Neu"
                                        : "verbraucht"}
                                    </span>
                                  </div>
                                  <span
                                    className={`text-sm font-medium ${
                                      darkMode
                                        ? "text-gray-300"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {sameItem.menge} {sameItem.typ.einheit}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 mt-1 text-xs">
                                  <Clock className="w-3 h-3 text-gray-400" />
                                  <span
                                    className={
                                      darkMode
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                    }
                                  >
                                    Ablauf:{" "}
                                    {new Date(
                                      sameItem.expirationDate
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>

          {/* Edit Form */}
          <div className="w-1/2 space-y-4">
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Status
              </label>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as "neu" | "verbraucht")
                }
                className={`w-full p-2 rounded-md border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="neu">Neu</option>
                <option value="verbraucht">verbraucht</option>
              </select>
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Einkaufdatum
              </label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className={`w-full p-2 rounded-md border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Ablaufdatum
              </label>
              <input
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                className={`w-full p-2 rounded-md border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Menge
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) =>
                  setAmount(Math.max(1, parseInt(e.target.value) || 1))
                }
                min="1"
                className={`w-full p-2 rounded-md border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Preis (€)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                step="0.01"
                className={`w-full p-2 rounded-md border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={() => setShowEditModal(false)}
            className="px-4 py-2 border-2 border-[#a1c4fd] text-[#4a90e2] rounded-xl hover:border-[#c2e9fb] hover:text-[#2196f3] transition-colors duration-300"
            aria-label="Abbrechen"
          >
            Abbrechen
          </button>
          <button
            onClick={handleUpdateItem}
            className="px-4 py-2 bg-gradient-to-r from-[#a1c4fd] to-[#c2e9fb] text-[#4a90e2] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            aria-label="Speichern"
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditItemModal;
