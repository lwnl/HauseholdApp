import axios from "axios";
import type { CategoryType, UnitType } from "../types";
import HOST from "../context/HostContext";

export interface LebensmittelTyp {
  quelle: string;
  _id: string;
  name: string;
  menge: number;
  einheit: UnitType;
  category: CategoryType;
}

export interface EinkaufslisteItem {
  _id: string;
  name: string;
  owner: {
    userId: string;
    userName: string;
  };
  createdAt: string;
  liste: LebensmittelTyp[];
  lastModified?: string;
  note?: string;
}

const api = axios.create({
  baseURL: `${HOST}/api`,
  withCredentials: true,
});

export const fetchLebensmittelTypen = async (): Promise<LebensmittelTyp[]> => {
  try {
    const response = await api.get<LebensmittelTyp[]>("/lebensmittelTyp");
    return response.data;
  } catch (error) {
    console.error("Error fetching LebensmittelTypen:", error);
    throw error;
  }
};

export const fetchEinkaufsliste = async (): Promise<EinkaufslisteItem[]> => {
  try {
    const response = await api.get<EinkaufslisteItem[]>("/einkaufsliste");
    console.log("Api Response: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching Einkaufsliste:", error);
    throw error;
  }
};

export const saveEinkaufsliste = async (
  listName: string,
  items: LebensmittelTyp[],
  ownerId: string,
  note?: string
): Promise<EinkaufslisteItem> => {
  try {
    const itemsToSave = items.map((item) => ({
      typ: item._id,
      menge: Number(item.menge) || 1,
      einheit: item.einheit,
      name: item.name,
      category: item.category,
    }));

    const response = await api.post<EinkaufslisteItem>("/einkaufsliste", {
      name: listName,
      liste: itemsToSave,
      // ownerId: ownerId,
      note,
    });

    return response.data;
  } catch (error) {
    console.error("Error saving Einkaufsliste:", error);
    throw error;
  }
};

export const updateEinkaufsliste = async (
  id: string,
  selectedItems: string[]
): Promise<void> => {
  try {
    await api.put(`/einkaufsliste/${id}`, { selectedItems });
  } catch (error) {
    console.error("Error updating Einkaufsliste:", error);
    throw error;
  }
};

export const deleteEinkaufsliste = async (id: string): Promise<void> => {
  try {
    await api.delete(`/einkaufsliste/${id}`);
  } catch (error) {
    console.error("Error deleting Einkaufsliste:", error);
    throw error;
  }
};

export const updateLebensmittelTyp = async (
  id: string,
  updatedData: Partial<LebensmittelTyp>
): Promise<LebensmittelTyp> => {
  try {
    const response = await api.put<LebensmittelTyp>(
      `/lebensmittelTyp/${id}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating LebensmittelTyp:", error);
    throw error;
  }
};

export const deleteLebensmittelTyp = async (id: string): Promise<void> => {
  try {
    await api.delete(`/LebensmittelTyp/${id}`);
  } catch (error) {
    console.error("Error deleting LebensmittelTyp", error);
  }
};
