import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import useDarkMode from "../context/useDarkMode";

const Layout = () => {
  const { darkMode } = useDarkMode();

  return (
    <div
      className={`min-h-screen flex flex-col ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Navbar für alle Unterseiten außer Hauptseite */}
      <Navbar />
      <div className="flex-1 p-4">
        <Outlet /> {/* Hier wird der jeweilige Seiteninhalt gerendert */}
      </div>
    </div>
  );
};

export default Layout;
