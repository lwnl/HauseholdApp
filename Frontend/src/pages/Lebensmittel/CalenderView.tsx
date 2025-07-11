import React, { useState } from "react";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit,
} from "lucide-react";
import type { LebensmittelItem } from "../../Hooks/useLebensmittelService";
import DeleteConfirmationModal from "./DeleteConfirmationsModal";

interface CalendarViewProps {
  lebensmittel: LebensmittelItem[];
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  getItemsForDate: (date: Date) => LebensmittelItem[];
  darkMode: boolean;
  onDelete: (id: string) => void;
  onEdit: (item: LebensmittelItem) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  currentMonth,
  setCurrentMonth,
  getItemsForDate,
  darkMode,
  onDelete,
  onEdit,
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<LebensmittelItem | null>(
    null
  );

  const getDaysInMonth = (date: Date): (Date | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const handleDelete = (item: LebensmittelItem) => {
    setItemToDelete(item);
    setShowConfirmDelete(true);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newMonth = new Date(currentMonth);
    if (direction === "prev") {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  return (
    <div
      className={`rounded-xl shadow-lg p-6 mb-8 ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2
          className={`text-xl md:text-2xl font-semibold flex items-center ${
            darkMode ? "text-gray-100" : "text-gray-900"
          }`}
        >
          <CalendarIcon className="w-6 h-6 mr-2 text-blue-600" />
          Ablaufdaten
        </h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateMonth("prev")}
            className={`p-2 rounded-full transition-colors ${
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}
            title="Vorheriger Monat"
          >
            <ChevronLeft className="w-5 h-5 text-blue-600" />
          </button>
          <span
            className={`text-lg md:text-xl font-medium ${
              darkMode ? "text-gray-100" : "text-blue-600"
            }`}
          >
            {currentMonth.toLocaleString("de-DE", {
              month: "long",
              year: "numeric",
            })}
          </span>
          <button
            onClick={() => navigateMonth("next")}
            className={`p-2 rounded-full transition-colors ${
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}
            title="Nächster Monat"
          >
            <ChevronRight className="w-5 h-5 text-blue-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"].map((day) => (
          <div
            key={day}
            className={`text-center font-medium py-2 ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {day}
          </div>
        ))}

        {getDaysInMonth(currentMonth).map((date, index) => (
          <div
            key={index}
            className={`min-h-[100px] p-2 border rounded-lg ${
              date
                ? `hover:shadow-md transition-shadow ${
                    darkMode ? "bg-gray-700" : "bg-white"
                  }`
                : darkMode
                ? "bg-gray-800"
                : "bg-gray-50"
            }`}
          >
            {date && (
              <>
                <div
                  className={`text-right mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {date.getDate()}
                </div>
                <div className="space-y-1">
                  {getItemsForDate(date).map((item) => (
                    <div
                      key={item.id}
                      className={`text-sm p-1 rounded flex items-center justify-between group hover:bg-blue-100 transition-colors ${
                        darkMode
                          ? "bg-blue-900 text-blue-200 hover:bg-blue-800"
                          : "bg-blue-50 text-blue-700"
                      }`}
                      title={`${item.name} - ${item.quantity}`}
                    >
                      <span className="truncate flex-1">{item.name}</span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEdit(item)}
                          className={`p-1 rounded transition-colors ${
                            darkMode ? "hover:bg-blue-700" : "hover:bg-blue-200"
                          }`}
                          title="Bearbeiten"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className={`p-1 rounded transition-colors ${
                            darkMode ? "hover:bg-blue-600" : "hover:bg-blue-600"
                          }`}
                          title="Löschen"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {showConfirmDelete && itemToDelete && (
        <DeleteConfirmationModal
          item={itemToDelete}
          onClose={() => setShowConfirmDelete(false)}
          onConfirm={() => {
            onDelete(itemToDelete.id);
            setShowConfirmDelete(false);
            setItemToDelete(null);
          }}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default CalendarView;
