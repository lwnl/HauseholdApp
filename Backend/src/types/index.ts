import { Document } from "mongoose";

export type UnitType = "stk" | "liter" | "g" | "kg";
export type CategoryType =
  | "obst"
  | "gemüse"
  | "fleisch"
  | "milchprodukt"
  | "getränk"
  | "teigwaren"
  | "brot"
  | "tiefkühl"
  | "anderes";
export type Status = "neu" | "verbraucht";

export interface LebensmittelTyp extends Document {
  name: string;
  menge: number;
  einheit: UnitType;
  category: CategoryType;
  quelle: string;
}

export interface Lebensmittel extends Document {
  typ: LebensmittelTyp["_id"];
  status: Status;
  expirationDate: Date;
  purchaseDate: Date;
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
