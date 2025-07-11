import { useState } from "react";
import { deleteNotiz, updateNotiz, Notiz } from "../../api/notizenApi";
import { Edit2, Trash2 } from "lucide-react";
import { useDarkMode } from "../../context/DarkModeContext";
import { useToast } from "../../context/ToastContext";

interface Props {
  notizen: Notiz[];
  setNotizen: React.Dispatch<React.SetStateAction<Notiz[]>>;
}

const NotizList: React.FC<Props> = ({ notizen, setNotizen }) => {
  const [editingNotiz, setEditingNotiz] = useState<Notiz | null>(null);
  const [editText, setEditText] = useState("");
  const { darkMode } = useDarkMode();
  const { showToast } = useToast();

  const handleEditNotiz = (notiz: Notiz) => {
    setEditingNotiz(notiz);
    setEditText(notiz.text);
  };

  const handleSaveEdit = async () => {
    if (!editingNotiz) return;
    try {
      const updatedNotiz = await updateNotiz(
        editingNotiz._id,
        editingNotiz.title,
        editText
      );
      if (updatedNotiz) {
        setNotizen((prev) =>
          prev.map((n) => (n._id === updatedNotiz._id ? updatedNotiz : n))
        );
        showToast("Notiz erfolgreich aktualisiert", "success");
      }
      setEditingNotiz(null);
      setEditText("");
    } catch (error) {
      console.error("Fehler beim Aktualisieren:", error);
      showToast("Fehler beim Aktualisieren der Notiz", "error");
    }
  };

  const handleDeleteNotiz = async (id: string) => {
    const confirmed = window.confirm(
      "Bist du sicher, dass du diese Notiz löschen möchtest?"
    );
    if (!confirmed) return;
    try {
      await deleteNotiz(id);
      setNotizen((prev) => prev.filter((n) => n._id !== id));
      showToast("Notiz erfolgreich gelöscht", "success");
    } catch (error) {
      console.error("Fehler beim Löschen:", error);
      showToast("Fehler beim Löschen der Notiz", "error");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.isArray(notizen) && notizen.length > 0 ? (
        notizen.map((item) => (
          <div
            key={item._id}
            className={`p-4 rounded-lg transition-all duration-300 ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-yellow-100 hover:bg-yellow-200"
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <h3
                className={`text-lg font-semibold mb-2 uppercase ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {item.title}
              </h3>
              <h4 className={darkMode ? "text-gray-400" : "text-gray-600"}>
                {new Date(item.createdAt).toLocaleDateString()}
              </h4>
            </div>

            {editingNotiz?._id === item._id ? (
              <div className="space-y-3">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className={`w-full p-2 rounded-lg border ${
                    darkMode
                      ? "bg-gray-800 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  rows={3}
                  aria-label="Notiz bearbeiten"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingNotiz(null)}
                    className="px-3 py-1 border-2 border-[#a1c4fd] text-[#4a90e2] rounded-xl hover:border-[#c2e9fb] hover:text-[#2196f3] transition-colors duration-300"
                    aria-label="Bearbeitung abbrechen"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-3 py-1 bg-gradient-to-r from-[#a1c4fd] to-[#c2e9fb] text-[#4a90e2] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    aria-label="Änderungen speichern"
                  >
                    Speichern
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                  {item.text}
                </p>

                <div className="flex justify-end gap-2 mt-3">
                  <p
                    className={`mt-2 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Erstellt von: {item.owner?.userName || "Unbekannt"}
                  </p>
                  <button
                    onClick={() => handleEditNotiz(item)}
                    className={`p-2 rounded-lg transition-colors ${
                      darkMode
                        ? "hover:bg-gray-500 text-gray-300"
                        : "hover:bg-yellow-300 text-gray-600"
                    }`}
                    aria-label="Notiz bearbeiten"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteNotiz(item._id)}
                    className={`p-2 rounded-lg transition-colors ${
                      darkMode
                        ? "hover:bg-red-900/50 text-red-400"
                        : "hover:bg-red-100 text-red-600"
                    }`}
                    aria-label="Notiz löschen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      ) : (
        <p>Keine Notizen verfügbar</p>
      )}
    </div>
  );
};

export default NotizList;
