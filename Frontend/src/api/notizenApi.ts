import axios from "axios";
import HOST from "../context/HostContext";

// Interface für eine Notiz (Datenstruktur einer Notiz)
export interface Notiz {
  _id: string;
  title: string;
  text: string;
  owner: {
    _id: string;
    userName: string;
  };
  createdAt: string;
}

// Axios-Instanz mit Basis-URL und Credentials
const api = axios.create({
  baseURL: `${HOST}/api`,
  withCredentials: true,
});

// Funktion zum Abrufen aller Notizen aus der API
export const fetchNotizen = async (): Promise<Notiz[]> => {
  try {
    const response = await api.get<Notiz[]>("/notiz");
    return response.data;
  } catch (error) {
    console.error("Fehler beim Abrufen der Notizen:", error);
    throw error;
  }
};

// Funktion zum Erstellen einer neuen Notiz
export const createNotiz = async (
  title: string,
  text: string
): Promise<Notiz> => {
  try {
    const response = await api.post("/notiz", { title, text });
    return response.data as Notiz;
  } catch (error) {
    console.error("Fehler beim Erstellen der Notiz:", error);
    throw error;
  }
};

// Funktion zum Aktualisieren einer bestehenden Notiz
export const updateNotiz = async (
  id: string,
  title: string,
  text: string
): Promise<Notiz> => {
  try {
    const response = await api.patch(`/notiz/${id}`, { title, text });
    return response.data as Notiz;
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Notiz:", error);
    throw error;
  }
};

// Funktion zum Löschen einer Notiz
export const deleteNotiz = async (id: string): Promise<void> => {
  try {
    await api.delete(`/notiz/${id}`);
  } catch (error) {
    console.error("Fehler beim Löschen der Notiz:", error);
    throw error;
  }
};
