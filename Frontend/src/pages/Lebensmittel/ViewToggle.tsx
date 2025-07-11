import type React from "react";
import { Calendar } from "lucide-react";

const ViewToggle: React.FC<{
  showCalendarView: boolean;
  setShowCalendarView: (show: boolean) => void;
  darkMode: boolean;
}> = ({ showCalendarView, setShowCalendarView, darkMode }) => {
  return (
    <div className="mb-4 flex justify-end">
      <button
        onClick={() => setShowCalendarView(!showCalendarView)}
        className={`flex items-center px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all ${
          darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-700"
        }`}
        title={
          showCalendarView
            ? "Zur Listenansicht wechseln"
            : "Zur Kalenderansicht wechseln"
        }
      >
        <Calendar className="w-5 h-5 mr-2" />
        {showCalendarView ? "Liste anzeigen" : "Kalender anzeigen"}
      </button>
    </div>
  );
};

export default ViewToggle;
