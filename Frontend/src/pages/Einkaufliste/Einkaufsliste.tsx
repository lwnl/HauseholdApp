import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, ShoppingCart, Trash2, AlertCircle } from "lucide-react";
import {
  fetchEinkaufsliste,
  updateEinkaufsliste,
  deleteEinkaufsliste,
} from "../../api/einkaufslisteApi";
import { useDarkMode } from "../../context/DarkModeContext";
import { useToast } from "../../context/ToastContext";

const Einkaufsliste = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { darkMode } = useDarkMode();
  const { showToast } = useToast();

  const [checkedItemsByList, setCheckedItemsByList] = useState<
    Record<string, Record<string, boolean>>
  >({});
  const [processingList, setProcessingList] = useState<string | null>(null);

  const { data: lists = [] } = useQuery({
    queryKey: ["einkaufsliste"],
    queryFn: fetchEinkaufsliste,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      selectedItems,
    }: {
      id: string;
      selectedItems: string[];
    }) => updateEinkaufsliste(id, selectedItems),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["einkaufsliste"] });
      queryClient.invalidateQueries({ queryKey: ["lebensmittel"] });
      showToast(
        "Die ausgewählten Artikel wurden zur Lebensmittel-Liste hinzugefügt",
        "success"
      );
    },
    onError: () => {
      showToast("Fehler beim Aktualisieren der Liste", "error");
    },
    onSettled: () => {
      setProcessingList(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEinkaufsliste,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["einkaufsliste"] });
      showToast("Liste wurde erfolgreich gelöscht", "success");
    },
    onError: () => {
      showToast("Fehler beim Löschen der Liste", "error");
    },
  });

  const handleStatusChange = async (listId: string) => {
    if (processingList) return;

    const selectedItems = Object.entries(checkedItemsByList[listId] || {})
      .filter(([, checked]) => checked)
      .map(([itemId]) => itemId);

    if (selectedItems.length === 0) {
      showToast("Bitte wählen Sie mindestens einen Artikel aus", "warning");
      return;
    }

    setProcessingList(listId);
    updateMutation.mutate({ id: listId, selectedItems });

    setCheckedItemsByList((prev) => ({
      ...prev,
      [listId]: {},
    }));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Möchten Sie diese Liste wirklich löschen?")) return;
    deleteMutation.mutate(id);
  };

  const handleCheckboxChange = (listId: string, itemId: string) => {
    if (processingList) return;

    setCheckedItemsByList((prev) => ({
      ...prev,
      [listId]: {
        ...(prev[listId] || {}),
        [itemId]: !(prev[listId]?.[itemId] || false),
      },
    }));
  };

  return (
    <div
      className={`min-h-screen py-20 ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-[#f6f8fb] to-[#e5ebf2]"
      }`}
    >
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Neue Liste Card */}
          <div
            onClick={() => navigate("/einkaufliste/create")}
            className="group h-full flex items-center justify-center cursor-pointer transition-all duration-300 bg-gradient-to-br from-[#a1c4fd] to-[#c2e9fb]  rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <div className="text-center p-6">
              <Plus className="w-12 h-12 mb-2 text-[#4a90e2]" />
              <h3 className="text-[#4a90e2] font-bold text-lg">Neue Liste</h3>
            </div>
          </div>

          {/* Existing Lists */}
          {lists.length > 0 ? (
            lists.map((list) => (
              <div
                key={list._id}
                className={`h-full transition-all duration-300 ${
                  darkMode
                    ? "bg-gray-800 text-white"
                    : "bg-white/90 backdrop-blur-sm"
                } rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1`}
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h3 className="font-bold text-blue-600 text-lg mb-1 uppercase ">
                        {list.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(list.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleStatusChange(list._id)}
                        className="p-2 rounded-full text-blue-600 hover:bg-blue-100 transition-colors"
                        title="Ausgewählte Artikel zur Lebensmittel-Liste hinzufügen"
                        disabled={processingList === list._id}
                      >
                        {processingList === list._id ? (
                          <div className="animate-spin">
                            <ShoppingCart className="w-5 h-5" />
                          </div>
                        ) : (
                          <ShoppingCart className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(list._id)}
                        className="p-2 rounded-full text-red-600 hover:bg-red-100"
                        title="Liste löschen"
                        disabled={processingList === list._id}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <p
                    className={`text-sm font-medium mb-3 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Erstellt von {list.owner?.userName || "Unbekannt"}
                  </p>

                  <div
                    className={`mt-3 p-3 rounded-lg ${
                      darkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    {list.liste.length > 0 ? (
                      list.liste.map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center justify-between py-1 px-2 rounded"
                        >
                          <span>{item.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                              {item.menge} {item.einheit}
                            </span>
                            <input
                              type="checkbox"
                              className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300"
                              checked={
                                checkedItemsByList[list._id]?.[item._id] ||
                                false
                              }
                              onChange={() =>
                                handleCheckboxChange(list._id, item._id)
                              }
                              disabled={processingList === list._id}
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <p
                        className={darkMode ? "text-gray-400" : "text-gray-600"}
                      >
                        Keine Produkte in dieser Liste.
                      </p>
                    )}
                  </div>

                  <div className="mt-3 space-y-2">
                    <p
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Anzahl der Produkte: {list.liste.length}
                    </p>

                    {list.note && (
                      <div className="flex items-center gap-2 bg-gradient-to-br from-[#a1c4fd] to-[#c2e9fb]  rounded shadow-lg hover:shadow-xl hover:-translate-y-1 text-[#4a90e2]">
                        <AlertCircle className="w-4 h-4 text-[#4a90e2]" />
                        <p className="text-sm p-2">{list.note}</p>
                      </div>
                    )}

                    {list.lastModified && (
                      <p className="text-xs text-gray-500">
                        Zuletzt aktualisiert:{" "}
                        {new Date(list.lastModified).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 text-center">
              <p className="text-lg text-gray-600">
                Es gibt noch keine Einkaufsliste. Klicken Sie auf "Neue Liste",
                um eine Einkaufsliste zu erstellen.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Einkaufsliste;
