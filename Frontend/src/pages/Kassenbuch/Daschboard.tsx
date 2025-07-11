import React from "react";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import useDarkMode from "../../context/useDarkMode";

const Dashboard = () => {
  const { darkMode } = useDarkMode();

  return (
    <div className="pt-20 pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1
        className={`text-2xl font-bold mb-6 ${
          darkMode ? "text-white" : "text-gray-800"
        }`}
      >
        Dashboard
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        <Link
          to="/kassenbuch"
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span>Zum Kassenbuch</span>
        </Link>

        <Link
          to="/kassenbuch/neu"
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusCircle size={20} />
          <span>Neue Transaktion</span>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
