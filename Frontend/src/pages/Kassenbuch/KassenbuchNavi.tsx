import { Link, Outlet, useLocation } from "react-router-dom";
import useDarkMode from "../../context/useDarkMode";
import { Book, TrendingUp, TrendingDown, PlusCircle } from "lucide-react";
import DashboardSummary from "./DashboardSummary";

function KassenbuchNavi() {
  const { darkMode } = useDarkMode();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="pt-20 pb-8 mb-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* DashboardSummary */}
      <DashboardSummary darkMode={darkMode} />

      <nav className="flex flex-wrap gap-2">
        <Link
          to="/kassenbuch"
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            isActive("/kassenbuch")
              ? `${darkMode ? "bg-blue-900 text-blue-100" : "bg-blue-100 text-blue-800"} font-medium`
              : `${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"} ${darkMode ? "text-white" : "text-gray-800"}`
          }`}
        >
          <Book size={18} className="mr-2" />
          <span>Alle Transaktionen</span>
        </Link>

        <Link
          to="/kassenbuch/eingaenge"
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            isActive("/kassenbuch/eingaenge")
              ? "bg-green-100 text-green-800 font-medium"
              : `${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"} ${darkMode ? "text-white" : "text-gray-800"}`
          }`}
        >
          <TrendingUp size={18} className="mr-2 text-green-500" />
          <span>Eingänge</span>
        </Link>

        <Link
          to="/kassenbuch/ausgaenge"
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            isActive("/kassenbuch/ausgaenge")
              ? "bg-red-100 text-red-800 font-medium"
              : `${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"} ${darkMode ? "text-white" : "text-gray-800"}`
          }`}
        >
          <TrendingDown size={18} className="mr-2 text-red-500" />
          <span>Ausgänge</span>
        </Link>

        <Link
          to="/kassenbuch/neu"
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            isActive("/kassenbuch/neu")
              ? `${darkMode ? "bg-blue-900 text-blue-100" : "bg-blue-100 text-blue-800"} font-medium`
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          <PlusCircle size={18} className="mr-2" />
          <span>Neue Transaktion</span>
        </Link>
      </nav>

      <div className={`rounded-lg shadow-lg p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <Outlet />
      </div>
    </div>
  );
}

export default KassenbuchNavi;