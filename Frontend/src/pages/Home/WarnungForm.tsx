import { useState } from "react";
import { createWarnung } from "../../api/warnungenApi";
import { useDarkMode } from "../../context/DarkModeContext";
import { Warnung } from "../../api/warnungenApi";

interface Props {
  setWarnungen: React.Dispatch<React.SetStateAction<Warnung[]>>;
}

const WarnungForm: React.FC<Props> = ({ setWarnungen }) => {
  const [newWarnung, setNewWarnung] = useState("");
  const { darkMode } = useDarkMode();

  const handleAddWarnung = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWarnung) return;

    try {
      const addedWarnung = await createWarnung(newWarnung);
      if (addedWarnung) {
        setWarnungen((prev) => [...prev, addedWarnung]);
        setNewWarnung("");
      }
    } catch (error) {
      console.error("Fehler beim Hinzufügen der Warnung:", error);
    }
  };

  return (
    <form onSubmit={handleAddWarnung} className="space-y-4">
      <div>
        <label
          htmlFor="warnungText"
          className="block text-sm font-medium text-gray-700"
        >
          Warnung Text
        </label>
        <textarea
          id="warnungText"
          placeholder="Warnung Text"
          value={newWarnung}
          onChange={(e) => setNewWarnung(e.target.value)}
          rows={4}
          className={`w-full p-3 rounded-lg border transition-colors ${
            darkMode
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
          } focus:outline-none focus:ring-2 focus:ring-red-500`}
          aria-label="Warnung Text eingeben"
        />
      </div>

      <button
        type="submit"
        className={`w-full p-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium`}
        aria-label="Warnung speichern"
      >
        Warnung Speichern
      </button>
    </form>
  );
};

export default WarnungForm;
