import axios from "axios";
import HOST from "../context/HostContext";

// Schnittstelle für eine Warnung (z. B. niedriger Lagerbestand, Ablaufdatum usw.)
export interface Warnung {
  _id: string;
  text: string;
  type: "low_stock" | "expiring_soon" | "expired" | "manual";
  createdAt: string;
  relatedItemId?: string;
  priority: "high" | "medium" | "low";
  status: "active" | "resolved";
}

// Erstellung einer Axios-Instanz mit Basis-URL und Cookies-Unterstützung
const api = axios.create({
  baseURL: `${HOST}/api`,
  withCredentials: true,
});

// Abrufen aller Warnungen aus der API
export const fetchWarnungen = async (): Promise<Warnung[]> => {
  try {
    const response = await api.get<Warnung[]>("/warnungen");
    return response.data;
  } catch (error) {
    console.error("Fehler beim Abrufen der Warnungen:", error);
    throw error;
  }
};

// Erstellen einer neuen Warnung mit Standardwerten für Typ und Priorität
export const createWarnung = async (
  text: string,
  type: Warnung["type"] = "manual",
  priority: Warnung["priority"] = "medium",
  relatedItemId?: string
): Promise<Warnung> => {
  try {
    const response = await api.post<Warnung>("/warnungen", {
      text,
      type,
      priority,
      relatedItemId,
    });
    return response.data;
  } catch (error) {
    console.error("Fehler beim Erstellen der Warnung:", error);
    throw error;
  }
};

// Löschen einer Warnung anhand der ID
export const deleteWarnung = async (id: string): Promise<void> => {
  try {
    await api.delete(`/warnungen/${id}`);
    console.log(`warnung ${id} is deleted`)
  } catch (error) {
    console.error("Fehler beim Löschen der Warnung:", error);
    throw error;
  }
};

// Markieren einer Warnung als erledigt
export const resolveWarnung = async (id: string): Promise<Warnung> => {
  try {
    const response = await api.put<Warnung>(`/warnungen/${id}/resolve`);
    return response.data;
  } catch (error) {
    console.error("Fehler beim Markieren der Warnung als erledigt:", error);
    throw error;
  }
};

// Überprüfen von Lebensmitteln und ggf. Erstellen neuer Warnungen
export const checkAndCreateWarnings = async (
  lebensmittel: {
    id: string;
    name: string;
    quantity: number;
    expiryDate: string;
  }[]
): Promise<Warnung[]> => {
  try {
    const response = await api.post<Warnung[]>("/warnungen/check", {
      lebensmittel,
    });
    return response.data;
  } catch (error) {
    console.error("Fehler beim Überprüfen und Erstellen von Warnungen:", error);
    throw error;
  }
};
