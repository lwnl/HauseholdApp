import axios from "axios";
import HOST from "../context/HostContext";

// Basis-URL für die Benutzer-API
const API_URL = `${HOST}/users`;

// Schnittstelle für die API-Antwort mit Benutzerprofil
interface UserProfileResponse {
  user: UserProfile;
}

// Schnittstelle für das Benutzerprofil
interface UserProfile {
  _id: string;
  userName: string; // Benutzername
  profilePicture: string; // Profilbild-URL
}

// Benutzerprofil vom Server abrufen
export const fetchUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const response = await axios.get<UserProfileResponse>(
      `${API_URL}/profile`,
      {
        withCredentials: true, // Cookies für Authentifizierung senden
      }
    );
    return response.data.user as UserProfile;
  } catch (error) {
    console.error("Fehler beim Abrufen des Benutzerprofils:", error);
    return null;
  }
};

// Benutzerprofil aktualisieren (einschließlich Bild-Upload)
export const updateUserProfile = async (
  formData: FormData
): Promise<UserProfile | null> => {
  try {
    const response = await axios.patch<UserProfileResponse>(
      `${API_URL}/update`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" }, // Datei-Upload erlauben
      }
    );
    return response.data.user;
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Benutzerprofils:", error);
    return null;
  }
};
