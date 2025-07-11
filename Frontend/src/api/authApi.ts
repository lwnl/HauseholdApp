import axios from "axios";
import HOST from "../context/HostContext";
axios.defaults.withCredentials = true;

const API_BASE_URL = `${HOST}/users`;

interface AuthPayload {
  userName?: string;
  email: string;
  password: string;
  profilePicture?: File; //opsionell
}

// Login API Fonksiyonu
export const login = async (payload: AuthPayload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, payload, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Login-Fehler:", error.message);
    } else {
      console.error("Login-Fehler:", "Unbekannter Fehler");
    }
    throw error;
  }
};

//  Register API Fonksiyonu
export const register = async (formData: FormData) => {
  console.log(" an APi:", formData);

  try {
    const response = await axios.post(`${API_BASE_URL}/register`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Register-Fehler:", error.message);
    } else {
      console.error("Register-Fehler:", "Unbekannter Fehler");
    }
    throw error;
  }
};

// Logout
export const logout = async () => {
  try {
    await axios.post(`${API_BASE_URL}/logout`, {}, { withCredentials: true });
    console.log("Logout erfolgreich!");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Logout-Fehler:", error.message);
    } else {
      console.error("Logout-Fehler:", "Unbekannter Fehler");
    }
  }
};

// Benutzerkonto löschen
export const deleteAccount = async () => {
  try {
    await axios.delete(`${API_BASE_URL}/delete`, { withCredentials: true });
    console.log("Benutzerkonto erfolgreich gelöscht!");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Delete-Fehler:", error.message);
    } else {
      console.error("Delete-Fehler:", "Unbekannter Fehler");
    }
  }
};
