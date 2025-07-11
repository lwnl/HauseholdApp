import React, { useState } from "react";
import useDarkMode from "../../context/useDarkMode";
import EngineeringIcon from "@mui/icons-material/Engineering";
const Settings: React.FC = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [language, setLanguage] = useState("Deutsch");

  return (
    <div
      className={`mt-4 p-6 border rounded-lg w-full ${
        darkMode
          ? "bg-gray-800 text-white border-gray-700"
          : "bg-white text-gray-900 border-gray-300"
      }`}
    >
      {/* Dark Mode */}
      <div className="flex justify-between items-center mb-4">
        <span>Dark Mode</span>
        <button
          onClick={toggleDarkMode}
          className="px-4 py-2 bg-gradient-to-r from-[#a1c4fd] to-[#c2e9fb] text-[#4a90e2] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          aria-label="Toggle Dark Mode"
        >
          {darkMode ? "An" : "Aus"}
        </button>
      </div>

      {/* Spracheinstellungen */}
      <div className="flex justify-between items-center mb-4">
        <span>Sprache</span>

        <h4>
          In Kürze verfügbar. <EngineeringIcon />
        </h4>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className={`px-4 py-2 rounded-lg ${
            darkMode ? "bg-gray-700 text-white" : "bg-gray-300 text-gray-900"
          }`}
          aria-label="Sprache auswählen"
          disabled
        >
          <option value="Deutsch">Deutsch</option>
          <option value="English">English</option>
        </select>
      </div>
    </div>
  );
};

export default Settings;
