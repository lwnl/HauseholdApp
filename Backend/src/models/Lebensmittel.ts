import mongoose, { Document } from "mongoose";
import { string } from "zod";

export interface ILebensmittel extends Document {
  owner: string;
  typ: mongoose.Types.ObjectId;
  status: "neu" | "verbraucht";
  expirationDate: Date;
  purchaseDate: Date;
  preis?: number;
  menge: number;
  showWarnung: boolean
}

const LebensmittelSchema = new mongoose.Schema<ILebensmittel>({
  owner: {
    type: String,
    required: true,
  },
  typ: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LebensmittelTyp",
    required: true,
  },
  status: {
    type: String,
    enum: ["neu", "verbraucht"],
    required: true,
    default: "neu",
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
  preis: {
    type: Number,
    min: 0,
  },
  menge: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer value",
    },
  },
  showWarnung: {
    type: Boolean,
    default: true,
  }
});

// Middleware to ensure menge is never negative
LebensmittelSchema.pre("save", function (next) {
  if (this.menge < 0) {
    this.menge = 0;
  }
  next();
});

export default mongoose.model<ILebensmittel>(
  "Lebensmittel",
  LebensmittelSchema
);
