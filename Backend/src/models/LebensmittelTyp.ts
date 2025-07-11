import mongoose, { Document } from "mongoose";

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

export type UnitType = "stk" | "liter" | "g" | "kg";

export interface ILebensmittelTyp extends Document {
  name: string;
  category: CategoryType;
  einheit: UnitType;
  menge: number;
  quelle: string;
}

const LebensmittelTypSchema = new mongoose.Schema<ILebensmittelTyp>({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: [
      "obst",
      "gemüse",
      "fleisch",
      "milchprodukt",
      "getränk",
      "teigwaren",
      "brot",
      "tiefkühl",
      "anderes",
    ],
    required: true,
  },
  einheit: {
    type: String,
    enum: ["stk", "liter", "g", "kg"],
    required: true,
    default: "stk",
  },

  menge: {
    type: Number,
    required: true,
    default: 1,
  },

  quelle: {
    type: String,
    required: true,
  }
});

export default mongoose.model<ILebensmittelTyp>(
  "LebensmittelTyp",
  LebensmittelTypSchema
);
