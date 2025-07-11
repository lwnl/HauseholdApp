import React, { useState } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import type { LebensmittelItem } from "../../Hooks/useLebensmittelService";
import DeleteConfirmationModal from "./DeleteConfirmationsModal";
import OpenAmountModal from "./OpenAmountModal";
import { useQueryClient } from "@tanstack/react-query";
import { updateLebensmittel } from "../../api/lebensmittelApi";
import HOST from "../../context/HostContext";

interface ListViewProps {
  products: LebensmittelItem[];
  darkMode: boolean;
  onDelete: (id: string) => void;
  onEdit: (item: LebensmittelItem) => void;
}

const ListView: React.FC<ListViewProps> = ({
  products,
  darkMode,
  onDelete,
  onEdit,
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<LebensmittelItem | null>(
    null
  );
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LebensmittelItem | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);

  // Get the queryClient to manually invalidate queries
  const queryClient = useQueryClient();

  // Group products by category and type
  const groupedProducts = products.reduce(
    (acc, product) => {
      const category = product.category;

      if (!acc[category]) {
        acc[category] = [];
      }

      // Check if we already have this product type in the category
      const existingProductIndex = acc[category].findIndex(
        (p) => p.name === product.name
      );

      if (existingProductIndex >= 0) {
        // Update existing product group
        acc[category][existingProductIndex].items.push(product);
        acc[category][existingProductIndex].total += product.quantity;
        acc[category][existingProductIndex].totalPrice += product.status === "neu" ? (product.preis || 0) : 0;
        if (product.status === "neu") {
          acc[category][existingProductIndex].neu += product.quantity;
        } else {
          acc[category][existingProductIndex].verbraucht += product.quantity;
        }
      } else {
        // Add new product group
        acc[category].push({
          name: product.name,
          items: [product],
          total: product.quantity,
          neu: product.status === "neu" ? product.quantity : 0,
          verbraucht: product.status === "verbraucht" ? product.quantity : 0,
          totalPrice: product.preis || 0,
        });
      }

      return acc;
    },
    {} as Record<
      string,
      Array<{
        name: string;
        items: LebensmittelItem[];
        total: number;
        neu: number;
        verbraucht: number;
        totalPrice: number;
      }>
    >
  );

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      obst: darkMode ? "text-green-400" : "text-green-600",
      gemüse: darkMode ? "text-green-400" : "text-green-600",
      fleisch: darkMode ? "text-red-400" : "text-red-600",
      milchprodukt: darkMode ? "text-blue-400" : "text-blue-600",
      getränk: darkMode ? "text-purple-400" : "text-purple-600",
      teigwaren: darkMode ? "text-yellow-400" : "text-yellow-600",
      brot: darkMode ? "text-orange-400" : "text-orange-600",
      tiefkühl: darkMode ? "text-blue-400" : "text-blue-600",
      anderes: darkMode ? "text-gray-400" : "text-gray-600",
    };
    return colors[category] || (darkMode ? "text-gray-200" : "text-gray-800");
  };

  const getExpirationStatus = (date: string) => {
    const expirationDate = new Date(date);
    const now = new Date();
    const diffDays = Math.ceil(
      (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0) return "expired";
    if (diffDays <= 3) return "critical";
    if (diffDays <= 10) return "warning";
    if (diffDays <= 30) return "good";
    return "ok";
  };

  const handleDelete = (item: LebensmittelItem) => {
    // Find all items with the same name to calculate total quantities
    const sameNameItems = products.filter((p) => p.name === item.name);

    // Create a combined item for deletion that represents all items with this name
    const combinedItem = {
      ...item,
      quantity: sameNameItems.reduce((sum, i) => sum + i.quantity, 0),
      // Include information about opened and new items
      neu: sameNameItems
        .filter((i) => i.status === "neu")
        .reduce((sum, i) => sum + i.quantity, 0),
      verbraucht: sameNameItems
        .filter((i) => i.status === "verbraucht")
        .reduce((sum, i) => sum + i.quantity, 0),
    };

    setItemToDelete(combinedItem);
    setShowConfirmDelete(true);
  };

  const handleOpenAmountModal = (item: LebensmittelItem) => {
    // Only show the modal for 'neu' items
    if (item.status === "neu") {
      setSelectedItem(item);
      setShowOpenModal(true);
    }
  };

  const handleOpenAmount = async (amount: number) => {
    if (selectedItem && selectedItem._id && !isProcessing) {
      setIsProcessing(true);

      try {
        // Create a new ID for the "verbraucht" item
        const newId = `${selectedItem._id}_new`;

        // Use the API function instead of direct fetch
        await updateLebensmittel(newId, {
          menge: amount,
        });

        // Invalidate the lebensmittel query to refresh the data
        queryClient.invalidateQueries({ queryKey: ["lebensmittel"] });

        // Close the modal
        setShowOpenModal(false);
        setSelectedItem(null);
      } catch (error) {
        console.error("Error updating item:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleDeleteConfirm = async (amount: number) => {
    if (itemToDelete && !isProcessing) {
      setIsProcessing(true);

      try {
        // First, find all items with the same name
        const sameNameItems = products.filter(
          (p) => p.name === itemToDelete.name
        );

        // Sort items so that "verbraucht" items come first
        const sortedItems = [...sameNameItems].sort((a, b) => {
          if (a.status === "verbraucht" && b.status === "neu") return -1;
          if (a.status === "neu" && b.status === "verbraucht") return 1;
          return 0;
        });

        let remainingAmount = amount;
        const itemsToDelete: string[] = [];

        // First, collect items to delete completely
        for (const item of sortedItems) {
          if (remainingAmount >= item.quantity) {
            // This item will be completely deleted
            itemsToDelete.push(item.id);
            remainingAmount -= item.quantity;
          } else if (remainingAmount > 0) {
            // This item will be partially deleted
            // We'll handle this separately
            break;
          } else {
            // We've already found all items to delete
            break;
          }
        }

        // Delete all complete items first
        const deletePromises = itemsToDelete.map((id) => onDelete(id));

        // If there's still a partial amount to delete
        if (remainingAmount > 0 && sortedItems.length > itemsToDelete.length) {
          const partialItem = sortedItems[itemsToDelete.length];

          // Use the API function with amount parameter
          const response = await fetch(
            `${HOST}/api/lebensmittel/${partialItem.id}?amount=${remainingAmount}`,
            {
              method: "DELETE",
            }
          );

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
        }

        // Wait for all deletions to complete
        await Promise.all(deletePromises);

        // Invalidate the lebensmittel query to refresh the data
        queryClient.invalidateQueries({ queryKey: ["lebensmittel"] });

        setShowConfirmDelete(false);
        setItemToDelete(null);
      } catch (error) {
        console.error("Error deleting items:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <>
      <div
        className={`rounded-xl shadow-lg overflow-hidden ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
                <th
                  className={`px-4 py-3 ${
                    darkMode ? "text-gray-200" : "text-gray-600"
                  }`}
                >
                  Kategorie / Artikel
                </th>
                <th
                  className={`px-4 py-3 ${
                    darkMode ? "text-gray-200" : "text-gray-600"
                  }`}
                >
                  Status & Menge
                </th>
                <th
                  className={`px-4 py-3 ${
                    darkMode ? "text-gray-200" : "text-gray-600"
                  }`}
                >
                  Preis
                </th>
                <th
                  className={`px-4 py-3 ${
                    darkMode ? "text-gray-200" : "text-gray-600"
                  }`}
                >
                  Einkaufdatum
                </th>
                <th
                  className={`px-4 py-3 ${
                    darkMode ? "text-gray-200" : "text-gray-600"
                  }`}
                >
                  Ablaufdatum
                </th>
                <th
                  className={`px-4 py-3 ${
                    darkMode ? "text-gray-200" : "text-gray-600"
                  }`}
                >
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupedProducts).map(
                ([category, productGroups]) =>
                  productGroups.map((group, groupIndex) => {
                    // Get the first item for display purposes
                    const firstItem = group.items[0];

                    // Find earliest expiration date
                    const nonOpenedItems = group.items.filter(
                      (item) => item.status !== "verbraucht"
                    );

                    const earliestExpItem =
                      nonOpenedItems.length > 0
                        ? nonOpenedItems.reduce((earliest, current) => {
                            const earliestDate = new Date(
                              earliest.expirationDate
                            );
                            const currentDate = new Date(
                              current.expirationDate
                            );
                            return currentDate < earliestDate
                              ? current
                              : earliest;
                          })
                        : null;

                    // Find latest purchase date
                    const latestPurchaseItem = group.items.reduce(
                      (latest, current) => {
                        const latestDate = new Date(latest.purchaseDate || "");
                        const currentDate = new Date(
                          current.purchaseDate || ""
                        );
                        return currentDate > latestDate ? current : latest;
                      },
                      group.items[0]
                    );

                    // Find a 'neu' item for the "verbraucht" action
                    const neuItems = group.items.filter(
                      (item) => item.status === "neu"
                    );

                    const newItem =
                      neuItems.length > 0
                        ? neuItems.reduce((earliest, current) => {
                            const earliestDate = new Date(earliest.expiryDate);
                            const currentDate = new Date(current.expiryDate);
                            return currentDate < earliestDate
                              ? current
                              : earliest;
                          })
                        : undefined;

                    // Calculate average price per unit
                    const avgPrice =
                      group.total > 0 ? group.totalPrice / group.total : 0;

                    return (
                      <tr
                        key={`${category}-${groupIndex}`}
                        className={`border-t ${
                          darkMode ? "border-gray-700" : "border-gray-200"
                        }`}
                      >
                        <td
                          className={`px-4 py-3 ${getCategoryColor(category)}`}
                        >
                          <div className="space-y-1">
                            <div
                              className={`text-sm font-medium ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {category.charAt(0).toUpperCase() +
                                category.slice(1)}
                            </div>
                            <div className="font-medium">{group.name}</div>
                            <div
                              className={`text-xs ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              Gesamt: {group.total}{" "}
                              {firstItem.typ?.einheit || "Stk"}
                            </div>
                          </div>
                        </td>
                        <td
                          className={`px-4 py-3 ${
                            darkMode ? "text-gray-200" : "text-gray-800"
                          }`}
                        >
                          <div className="space-y-2">
                            {group.neu > 0 && (
                              <div>
                                <span className="font-medium">Neu: </span>
                                <span>{group.neu}</span>
                              </div>
                            )}
                            {group.verbraucht > 0 && (
                              <div>
                                <span className="font-medium">
                                  verbraucht:{" "}
                                </span>
                                <span>{group.verbraucht}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td
                          className={`px-4 py-3 ${
                            darkMode ? "text-gray-200" : "text-gray-800"
                          }`}
                        >
                          {group.totalPrice > 0 ? (
                            <div className="space-y-1">
                              <div>
                                <span className="font-medium">Gesamt: </span>
                                <span>€{group.totalPrice.toFixed(2)}</span>
                              </div>
                              {/* <div className="text-sm">
                                <span className="font-medium">
                                  Pro Einheit:{" "}
                                </span>
                                <span>€{avgPrice.toFixed(2)}</span>
                              </div> */}
                            </div>
                          ) : (
                            <span>-</span>
                          )}
                        </td>
                        <td
                          className={`px-4 py-3 ${
                            darkMode ? "text-gray-200" : "text-gray-800"
                          }`}
                        >
                          {latestPurchaseItem.purchaseDate
                            ? new Date(
                                latestPurchaseItem.purchaseDate
                              ).toLocaleDateString("de-DE")
                            : "-"}
                        </td>
                        <td className={`px-4 py-3`}>
                          {earliestExpItem ? (
                            <span
                              className={`px-2 py-1 rounded-md ${
                                getExpirationStatus(
                                  earliestExpItem.expiryDate
                                ) === "expired"
                                  ? "bg-red-600 text-white"
                                  : getExpirationStatus(
                                      earliestExpItem.expiryDate
                                    ) === "critical"
                                  ? "bg-red-600 text-white"
                                  : getExpirationStatus(
                                      earliestExpItem.expiryDate
                                    ) === "warning"
                                  ? "bg-yellow-500 text-black"
                                  : getExpirationStatus(
                                      earliestExpItem.expiryDate
                                    ) === "good"
                                  ? "bg-green-500 text-white"
                                  : darkMode
                                  ? "text-gray-200"
                                  : "text-gray-800"
                              }`}
                            >
                              {new Date(
                                earliestExpItem.expiryDate
                              ).toLocaleDateString("de-DE")}
                            </span>
                          ) : (
                            <span
                              className={
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }
                            >
                              --
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            {newItem && (
                              <button
                                onClick={() => handleOpenAmountModal(newItem)}
                                className={`p-1.5 rounded-md transition-colors ${
                                  darkMode
                                    ? "text-blue-400 hover:bg-blue-900/50"
                                    : "text-blue-600 hover:bg-blue-100"
                                }`}
                                title="Als verbraucht markieren"
                                disabled={isProcessing}
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => onEdit(firstItem)}
                              className={`p-1.5 rounded-md transition-colors ${
                                darkMode
                                  ? "text-green-400 hover:bg-green-900/50"
                                  : "text-green-600 hover:bg-green-100"
                              }`}
                              title="Bearbeiten"
                              disabled={isProcessing}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(firstItem)}
                              className={`p-1.5 rounded-md transition-colors ${
                                darkMode
                                  ? "text-red-400 hover:bg-red-900/50"
                                  : "text-red-600 hover:bg-red-100"
                              }`}
                              title="Löschen"
                              disabled={isProcessing}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
              )}

              {products.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className={`px-4 py-8 text-center ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Keine Lebensmittel gefunden
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showConfirmDelete && itemToDelete && (
        <DeleteConfirmationModal
          item={itemToDelete}
          onClose={() => setShowConfirmDelete(false)}
          onConfirm={handleDeleteConfirm}
          darkMode={darkMode}
        />
      )}

      {showOpenModal && selectedItem && (
        <OpenAmountModal
          item={selectedItem}
          onClose={() => setShowOpenModal(false)}
          onConfirm={handleOpenAmount}
          darkMode={darkMode}
          allItems={products.filter((p) => p.name === selectedItem.name)}
        />
      )}
    </>
  );
};

export default ListView;
