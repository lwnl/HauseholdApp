import { deleteWarnung, resolveWarnung } from "../../api/warnungenApi";
import { Trash2, AlertTriangle, CheckCircle } from "lucide-react";
import { useDarkMode } from "../../context/DarkModeContext";
import type { Warnung } from "../../api/warnungenApi";

interface Props {
  warnungen: Warnung[];
  setWarnungen: React.Dispatch<React.SetStateAction<Warnung[]>>;
}

const WarnungList: React.FC<Props> = ({ warnungen, setWarnungen }) => {
  const { darkMode } = useDarkMode();

  const handleDeleteWarnung = async (id: string) => {
    try {
      await deleteWarnung(id);

      setWarnungen((prev) => prev.filter((w) => w._id !== id));
    } catch (error) {
      console.error("Fehler beim Löschen der Warnung:", error);
    }
  };

  const handleResolveWarnung = async (id: string) => {
    try {
      const updatedWarnung = await resolveWarnung(id);
      setWarnungen((prev) =>
        prev.map((w) => (w._id === id ? updatedWarnung : w))
      );
    } catch (error) {
      console.error("Fehler beim Markieren der Warnung als erledigt:", error);
    }
  };

  const getWarningColor = (
    type: Warnung["type"],
    priority: Warnung["priority"]
  ) => {
    if (type === "expired" || priority === "high") return "text-red-500";
    if (type === "expiring_soon" || priority === "medium")
      return "text-yellow-500";
    return "text-blue-500";
  };

  // Güvenlik kontrolü ekleyelim
  const groupedWarnungen = Array.isArray(warnungen)
    ? warnungen.reduce((acc, warnung) => {
        if (!acc[warnung.type]) {
          acc[warnung.type] = [];
        }
        acc[warnung.type].push(warnung);
        return acc;
      }, {} as Record<string, Warnung[]>)
    : {};

  return (
    <div className="space-y-6">
      {Object.entries(groupedWarnungen).map(([type, warnings]) => (
        <div key={type} className="space-y-2">
          <h3
            className={`font-medium ${
              type === "expired"
                ? "text-red-500"
                : type === "expiring_soon"
                ? "text-yellow-500"
                : type === "low_stock"
                ? "text-orange-500"
                : darkMode
                ? "text-gray-300"
                : "text-gray-700"
            }`}
          >
            {type === "expired"
              ? "Abgelaufene Produkte"
              : type === "expiring_soon"
              ? "Läuft bald ab"
              : type === "low_stock"
              ? "Niedriger Bestand"
              : "Sonstige Warnungen"}
          </h3>

          {warnings.map((warnung) => (
            <div
              key={warnung._id}
              className={`p-4 rounded-lg transition-all duration-300 ${
                darkMode
                  ? warnung.status === "resolved"
                    ? "bg-gray-800/50"
                    : "bg-gray-700"
                  : warnung.status === "resolved"
                  ? "bg-gray-100"
                  : "bg-white"
              } shadow-sm`}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle
                  className={`w-5 h-5 mt-1 ${getWarningColor(
                    warnung.type,
                    warnung.priority
                  )}`}
                  aria-label="Warnung Icon"
                />

                <div className="flex-1">
                  <p
                    className={`text-lg ${
                      warnung.status === "resolved"
                        ? darkMode
                          ? "text-gray-400"
                          : "text-gray-500"
                        : darkMode
                        ? "text-gray-200"
                        : "text-gray-800"
                    }`}
                  >
                    {warnung.text}
                  </p>

                  <div className="flex justify-between items-center mt-3">
                    <span
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {new Date(warnung.createdAt).toLocaleDateString()}
                    </span>

                    <div className="flex gap-2">
                      {/* {warnung.status === "active" && (
                        <button
                          onClick={() => handleResolveWarnung(warnung._id)}
                          className={`p-2 rounded-lg transition-colors ${
                            darkMode
                              ? "hover:bg-green-900/50 text-green-400"
                              : "hover:bg-green-100 text-green-600"
                          }`}
                          aria-label="Als erledigt markieren"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )} */}

                      <button
                        onClick={() => handleDeleteWarnung(warnung._id)}
                        className={`p-2 rounded-lg transition-colors ${
                          darkMode
                            ? "hover:bg-red-900/50 text-red-400"
                            : "hover:bg-red-100 text-red-600"
                        }`}
                        aria-label="Warnung löschen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}

      {warnungen.length === 0 && (
        <div
          className={`text-center py-8 ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Keine aktiven Warnungen</p>
        </div>
      )}
    </div>
  );
};

export default WarnungList;
