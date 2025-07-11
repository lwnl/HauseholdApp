import React, { useEffect, useState } from "react";
import { fetchUserProfile, updateUserProfile } from "../../api/profile";
import { deleteAccount } from "../../api/authApi";
import useDarkMode from "../../context/useDarkMode";
import { useToast } from "../../context/ToastContext";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import HOST from "../../context/HostContext";

interface UserProfile {
  userName: string;
  profilePicture: string;
}

const ProfileSettings: React.FC = () => {
  const { darkMode } = useDarkMode();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newProfilePicture, setNewProfilePicture] = useState<File | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Benutzer von API laden
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userData = await fetchUserProfile();
        setUser(userData);
        if (userData) {
          setNewName(userData.userName);
        }
      } catch (error) {
        console.error("Fehler beim Laden des Benutzerprofils:", error);
        showToast("Fehler beim Laden des Benutzerprofils", "error");
      }
    };
    loadUserProfile();
  }, [showToast]);

  // Wenn das Profilfoto geändert wird
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      console.log("neu profil bild:", event.target.files[0].name);
      setNewProfilePicture(event.target.files[0]);
    }
  };

  // Benutzerinformationen aktualisieren
  const handleUpdateProfile = async () => {
    const formData = new FormData();
    if (newName) formData.append("userName", newName);
    if (newPassword) formData.append("password", newPassword);
    if (newEmail) formData.append("email", newEmail);
    if (newProfilePicture) formData.append("profilePicture", newProfilePicture);

    try {
      const updatedUser = await updateUserProfile(formData);
      if (updatedUser) {
        setUser(updatedUser);
        setOpen(false);
        showToast("Profil erfolgreich aktualisiert", "success");
      }
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Benutzerprofils:", error);
      showToast("Fehler beim Aktualisieren des Benutzerprofils", "error");
    }
  };

  // Benutzerkonto löschen
  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      console.log("Benutzerkonto erfolgreich gelöscht!");
      showToast("Benutzerkonto erfolgreich gelöscht", "success");
      navigate("/");
    } catch (error) {
      console.error("Fehler beim Löschen des Benutzerkontos", error);
      showToast("Fehler beim Löschen des Benutzerkontos", "error");
    }
  };

  return (
    <div
      className={`p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto transition-colors duration-300 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="flex flex-col items-center mb-6">
        {/* Profil Bild */}
        <div className="relative w-32 h-32 mb-4">
          <img
            src={`${HOST}/data/profilePictures/${user?.profilePicture}`}
            alt="Profil"
            className="w-32 h-32 rounded-full border-4 border-gray-300 dark:border-gray-700 object-cover shadow-md"
            style={{ objectFit: "cover", aspectRatio: "1 / 1" }}
            loading="lazy"
          />
          {/* Aktualisierungsschaltfläche */}
          <button
            onClick={() => setOpen(true)}
            className="absolute bottom-0 right-0 bg-gradient-to-r from-[#a1c4fd] to-[#c2e9fb] text-[#4a90e2] rounded-full p-2 cursor-pointer shadow-lg transition-colors duration-300"
            aria-label="Profil bearbeiten"
          >
            <EditIcon />
          </button>
        </div>
        <h2 className="text-2xl font-bold uppercase text-center">
          Hallo „ {user?.userName || "User"} “
        </h2>
      </div>

      {/* Tailwind Modal */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className={`p-6 rounded-lg shadow-lg w-96 transition-colors duration-300 ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <h3 className="text-lg font-bold mb-4">Profil aktualisieren</h3>
            <input
              type="text"
              placeholder="Neuer Nutzername"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full p-3 border rounded mb-4 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Neues Passwort"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 border rounded mb-4 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Neues Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full p-3 border rounded mb-4 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center mb-4">
              <CameraAltIcon className="mr-2" />
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full p-3 border rounded bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Profilbild ändern"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 border-2 border-[#a1c4fd] text-[#4a90e2] rounded-xl hover:border-[#c2e9fb] hover:text-[#2196f3] transition-colors duration-300"
                aria-label="Abbrechen"
              >
                Abbrechen
              </button>
              <button
                onClick={handleUpdateProfile}
                className="px-4 py-2 bg-gradient-to-r from-[#a1c4fd] to-[#c2e9fb] text-[#4a90e2] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                aria-label="Speichern"
              >
                Speichern
              </button>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setConfirmDelete(true)}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                aria-label="Konto löschen"
              >
                Konto löschen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bestätigungsmodal zum Löschen des Kontos */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="absolute bg-black opacity-80 inset-0 z-0"></div>
          <div className="w-full max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg bg-white">
            <div className="">
              <div className="text-center p-5 flex-auto justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 -m-1 flex items-center text-red-500 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-16 h-16 flex items-center text-red-500 mx-auto"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <h2 className="text-xl font-bold py-4">Sind Sie sicher?</h2>
                <p className="text-sm text-gray-500 px-8">
                  Möchten Sie wirklich Ihr Konto löschen? Dieser Vorgang kann
                  nicht rückgängig gemacht werden.
                </p>
              </div>
              <div className="p-3 mt-2 text-center space-x-4 md:block">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="mb-2 md:mb-0 bg-red-500 border border-red-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-red-600"
                >
                  Löschen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
