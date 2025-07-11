export type UnitType = "stk" | "liter" | "g" | "kg";
export type CategoryType =
  | "obst"
  | "gemüse"
  | "fleisch"
  | "milchprodukt"
  | "getränk"
  | "teigwaren"
  | "tiefkühl"
  | "anderes"
  | "brot";

export type Status = "neu" | "verbraucht";

export interface LebensmittelTyp {
  _id: string;
  name: string;
  menge: number;
  einheit: UnitType;
  category: CategoryType;
  image?: string;
  quelle: string;
}

export interface Lebensmittel {
  _id: string;
  typ: LebensmittelTyp;
  status: Status;
  expirationDate: string;
  purchaseDate: string;
  preis?: number;
  menge: number;
}

export interface CreateLebensmittelData {
  name: string;
  category: CategoryType;
  einheit: UnitType;
  expirationDate: Date;
  preis?: number;
  menge: number;
}

export interface UpdateLebensmittelData {
  status?: Status;
  expirationDate?: string;
  purchaseDate?: string;
  preis?: number;
  menge?: number;
}

export type LebensmittelItem = Lebensmittel;
