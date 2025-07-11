import { useEffect, useState } from "react";
import { fetchNotizen, Notiz } from "../../api/notizenApi";
import { fetchWarnungen, Warnung } from "../../api/warnungenApi";
import NotizList from "./NotizList";
import WarnungList from "./WarnungList";
import NotizForm from "./NotizForm";
import WarnungForm from "./WarnungForm";
import { useDarkMode } from "../../context/DarkModeContext";
import { StickyNote, AlertTriangle } from "lucide-react";

const Home = () => {
  const [notizen, setNotizen] = useState<Notiz[]>([]);
  const [warnungen, setWarnungen] = useState<Warnung[]>([]);
  const { darkMode } = useDarkMode();

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedNotizen = await fetchNotizen();
        setNotizen(Array.isArray(fetchedNotizen) ? fetchedNotizen : []);
        const fetchedWarnungen = await fetchWarnungen();
        setWarnungen(Array.isArray(fetchedWarnungen) ? fetchedWarnungen : []);
      } catch (error: unknown) {
        console.error("Fehler beim Laden der Daten:", error);
      }
    };
    loadData();
  }, []);

  return (
    <div
      className={`min-h-screen py-26 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Forms Section */}
          <div className="lg:col-span-1 space-y-6">
            {/* Notes Form */}
            <div
              className={`p-6 rounded-xl shadow-lg ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <StickyNote
                  className={`w-6 h-6 ${
                    darkMode ? "text-blue-400" : "text-blue-600"
                  }`}
                  aria-label="Neue Notiz Icon"
                />
                <h2 className="text-xl font-semibold">Neue Notiz</h2>
              </div>
              <NotizForm setNotizen={setNotizen} />
            </div>

            {/* Warnings Form */}
            <div
              className={`p-6 rounded-xl shadow-lg ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle
                  className={`w-6 h-6 ${
                    darkMode ? "text-red-400" : "text-red-600"
                  }`}
                  aria-label="Neue Warnung Icon"
                />
                <h2 className="text-xl font-semibold">Neue Warnung</h2>
              </div>
              <WarnungForm setWarnungen={setWarnungen} />
            </div>
          </div>

          {/* Lists Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Notes List */}
            <div
              className={`p-6 rounded-xl shadow-lg ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex items-center gap-2 mb-6">
                <StickyNote
                  className={`w-6 h-6 ${
                    darkMode ? "text-blue-400" : "text-blue-600"
                  }`}
                  aria-label="Meine Notizen Icon"
                />
                <h2 className="text-xl font-semibold">Meine Notizen</h2>
              </div>
              <NotizList notizen={notizen} setNotizen={setNotizen} />
            </div>

            {/* Warnings List */}
            <div
              className={`p-6 rounded-xl shadow-lg ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex items-center gap-2 mb-6">
                <AlertTriangle
                  className={`w-6 h-6 ${
                    darkMode ? "text-red-400" : "text-red-600"
                  }`}
                  aria-label="Aktive Warnungen Icon"
                />
                <h2 className="text-xl font-semibold">Aktive Warnungen</h2>
              </div>
              <WarnungList warnungen={warnungen} setWarnungen={setWarnungen} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
