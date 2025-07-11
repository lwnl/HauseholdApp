import axios from "axios";
import HOST from "../context/HostContext";

// Interface für eine Transaktion
type Transaktion = {
  _id: string;
  date: Date;
  amount: number;
  description: string;
  category: string;
  type: "income" | "expense"; // Einkünfte oder Ausgaben
  userName: string;
  image?: string; // Optionales Bild
};

// API-Aufruf zum Abrufen aller Transaktionen
export const fetchTransaktions = async () => {
  try {
    const response = await axios.get(`${HOST}/transaktion`, {
      withCredentials: true,
    });
    return (
      (response.data as { transactionList: Transaktion[] }).transactionList ||
      []
    );
  } catch (error) {
    console.error("Fehler beim Abrufen der Transaktionen:", error);
    return [];
  }
};

// API-Aufruf zum Erstellen einer neuen Transaktion
export const createTransaktion = async (data: Omit<Transaktion, "_id">) => {
  try {
    const response = await axios.post(`${HOST}/transaktion`, data, {
      withCredentials: true,
    });
    return (response.data as { transaction: Transaktion }).transaction;
  } catch (error) {
    console.error("Fehler beim Erstellen der Transaktion:", error);
    throw error;
  }
};

// API-Aufruf zum Aktualisieren einer bestehenden Transaktion
export const updateTransaktion = async (
  id: string,
  data: Partial<Transaktion>
) => {
  try {
    const response = await axios.patch(`${HOST}/transaktion/${id}`, data, {
      withCredentials: true,
    });
    return (response.data as { transaction: Transaktion }).transaction;
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Transaktion:", error);
    throw error;
  }
};

// API-Aufruf zum Löschen einer Transaktion
export const deleteTransaktion = async (id: string) => {
  try {
    await axios.delete(`${HOST}/transaktion/${id}`, { withCredentials: true });
  } catch (error) {
    console.error("Fehler beim Löschen der Transaktion:", error);
    throw error;
  }
};

// API-Aufruf zur Abfrage des aktuellen Kontostands
export const fetchKontostand = async (
  option?: "both" | "income" | "expense"
) => {
  try {
    const response = await axios.get(
      `${HOST}/transaction/kontostand?option=${option}`,
      { withCredentials: true }
    );
    return (response.data as { kontostand: number }).kontostand || 0;
  } catch (error) {
    console.error("Fehler beim Abrufen des Kontostands:", error);
    return 0;
  }
};
