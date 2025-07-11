import axios from "axios";
import type {
  Lebensmittel,
  LebensmittelTyp,
  CreateLebensmittelData,
  UpdateLebensmittelData,
} from "../types";
import HOST from "../context/HostContext";

const api = axios.create({
  baseURL: `${HOST}/api`,
  withCredentials: true, 
});

// Lebensmittel endpoints
export const fetchLebensmittel = async (): Promise<Lebensmittel[]> => {
  try {
    const { data } = await api.get<Lebensmittel[]>("/lebensmittel");
    return data;
  } catch (error) {
    console.error("Error fetching Lebensmittel:", error);
    throw new Error("Failed to fetch Lebensmittel");
  }
};

export const createLebensmittel = async (
  data: CreateLebensmittelData
): Promise<Lebensmittel> => {
  try {
    const { data: response } = await api.post<Lebensmittel>(
      "/lebensmittel",
      data
    );
    return response;
  } catch (error) {
    console.error("Error creating Lebensmittel:", error);
    throw new Error("Failed to create Lebensmittel");
  }
};

export const updateLebensmittel = async (
  id: string,
  data: UpdateLebensmittelData
): Promise<Lebensmittel> => {
  try {
    // Specific item update - use the exact ID
    const { data: response } = await api.put<Lebensmittel>(
      `/lebensmittel/${id}`,
      {
        ...data,
        updateType: "single", // Tell backend this is a single item update
      }
    );
    return response;
  } catch (error) {
    console.error("Error updating Lebensmittel:", error);
    throw new Error("Failed to update Lebensmittel");
  }
};

export const deleteLebensmittel = async (
  id: string,
  amount?: number
): Promise<void> => {
  try {
    // If amount is provided, send it as a query parameter
    const params = amount ? { amount } : undefined;
    await api.delete(`/lebensmittel/${id}`, { params });
  } catch (error) {
    console.error("Error deleting Lebensmittel:", error);
    throw new Error("Failed to delete Lebensmittel");
  }
};

// LebensmittelTyp endpoints
export const fetchLebensmittelTypen = async (): Promise<LebensmittelTyp[]> => {
  try {
    const { data } = await api.get<LebensmittelTyp[]>("/lebensmittelTyp");
    return data;
  } catch (error) {
    console.error("Error fetching LebensmittelTypen:", error);
    throw new Error("Failed to fetch LebensmittelTypen");
  }
};

export const createLebensmittelTyp = async (
  data: Omit<LebensmittelTyp, "_id">
): Promise<LebensmittelTyp> => {
  try {
    const { data: response } = await api.post<LebensmittelTyp>(
      "/lebensmittelTyp",
      data,
      {
        withCredentials: true
      }
    );
    return response;
  } catch (error) {
    console.error("Error creating LebensmittelTyp:", error);
    throw new Error("Failed to create LebensmittelTyp");
  }
};

export const updateLebensmittelTyp = async (
  id: string,
  data: Partial<Omit<LebensmittelTyp, "_id">>
): Promise<LebensmittelTyp> => {
  try {
    const { data: response } = await api.put<LebensmittelTyp>(
      `/lebensmittelTyp/${id}`,
      data
    );
    return response;
  } catch (error) {
    console.error("Error updating LebensmittelTyp:", error);
    throw new Error("Failed to update LebensmittelTyp");
  }
};

export const deleteLebensmittelTyp = async (id: string): Promise<void> => {
  try {
    await api.delete(`/lebensmittelTyp/${id}`);
  } catch (error) {
    console.error("Error deleting LebensmittelTyp:", error);
    throw new Error("Failed to delete LebensmittelTyp");
  }
};
