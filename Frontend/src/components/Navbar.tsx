import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { logout } from "../api/authApi";
import { fetchUserProfile } from "../api/profile";
import HomeIcon from "@mui/icons-material/Home";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import ListIcon from "@mui/icons-material/List";
import useDarkMode from "../context/useDarkMode";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HOST from "../context/HostContext";

function Navbar() {
  const { darkMode } = useDarkMode();
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const [user, setUser] = useState<{
    userName: string;
    profilePicture: string | null;
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const userData = await fetchUserProfile();
      console.log("Fetched User Data:", userData);
      setUser(userData);
    };
    getUser();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate("/");
      handleClose();
    } catch (error) {
      console.error("Logout-Fehler:", error);
    }
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  return (
    <nav
      className={`p-4 shadow-lg fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/home"
          className="text-2xl font-bold hover:text-[#4a90e2] transition-colors duration-300"
        >
          ALMS
        </Link>
        <div className="hidden md:flex space-x-6">
          <Link
            to="/home"
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-300 ${
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
            }`}
          >
            <span>Home</span>
          </Link>
          <Link
            to="/kassenbuch"
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-300 ${
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
            }`}
          >
            <span>Kassenbuch</span>
          </Link>
          <Link
            to="/lebensmittel"
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-300 ${
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
            }`}
          >
            <span>Lebensmittel</span>
          </Link>
          <Link
            to="/einkaufsliste"
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-300 ${
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
            }`}
          >
            <span>Einkaufsliste</span>
          </Link>
        </div>

        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button className="flex items-center space-x-2">
            {user?.profilePicture &&
            user.profilePicture !==
              "00000000-0000-0000-0000-000000000000.avif" ? (
              <img
                src={`${HOST}/data/profilePictures/${user.profilePicture}`}
                alt="Profil"
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full ${
                  darkMode ? "bg-gray-700" : "bg-gray-300"
                }`}
              >
                {user?.userName.charAt(0).toUpperCase()}
              </div>
            )}
          </button>

          {isOpen && (
            <div
              className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg transition-colors duration-300 ${
                darkMode ? "bg-gray-700" : "bg-white"
              }`}
            >
              <Link
                to="/profile"
                onClick={handleClose}
                className={`px-4 py-2 flex items-center space-x-2 transition-colors duration-300 ${
                  darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                }`}
              >
                <AccountCircleIcon />
                <span>Profile</span>
              </Link>
              <button
                onClick={handleLogout}
                className={`w-full text-left px-4 py-2 flex items-center space-x-2 transition-colors duration-300 ${
                  darkMode ? "hover:bg-red-600" : "hover:bg-red-100"
                }`}
              >
                <LogoutIcon />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        className={`fixed bottom-0 left-0 w-full p-3 flex justify-around items-center md:hidden z-50 pb-16 transition-colors duration-300 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <Link
          to="/home"
          onClick={handleClose}
          className="flex flex-col items-center hover:text-green-500 transition-colors duration-300"
        >
          <HomeIcon fontSize="large" />
          <span className="text-xs">Home</span>
        </Link>
        <Link
          to="/kassenbuch"
          onClick={handleClose}
          className="flex flex-col items-center hover:text-green-500 transition-colors duration-300"
        >
          <MenuBookIcon fontSize="large" />
          <span className="text-xs">Kassenbuch</span>
        </Link>
        <Link
          to="/lebensmittel"
          onClick={handleClose}
          className="flex flex-col items-center hover:text-green-500 transition-colors duration-300"
        >
          <ShoppingBasketIcon fontSize="large" />
          <span className="text-xs">Lebensmittel</span>
        </Link>
        <Link
          to="/einkaufsliste"
          onClick={handleClose}
          className="flex flex-col items-center hover:text-green-500 transition-colors duration-300"
        >
          <ListIcon fontSize="large" />
          <span className="text-xs">Einkauf</span>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
