import ProjectFAQ from "./ProjectFAQ";
import Settings from "./Settings";
import ProfilePage from "./ProfileSettings";
import useDarkMode from "../../context/useDarkMode";

const Profile: React.FC = () => {
  const { darkMode } = useDarkMode();

  return (
    <div className="flex justify-center items-center min-h-screen py-30 px-4 sm:px-6 lg:px-8">
      <div
        className={`w-full max-w-4xl p-8 rounded-lg shadow-xl ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <ProfilePage />

        <div
          className={`mt-6 p-6 rounded-lg shadow-md ${
            darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"
          }`}
        >
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">
            Einstellungen
          </h3>
          <Settings />
        </div>

        <div
          className={`mt-6 p-6 rounded-lg shadow-md ${
            darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"
          }`}
        >
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">
            Häufige Fragen
          </h3>
          <ProjectFAQ />
        </div>
      </div>
    </div>
  );
};

export default Profile;
