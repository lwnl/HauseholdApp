import { Schema, model } from "mongoose";

const notizSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Titel ist erforderlich"],
      trim: true,
      minLength: 3,
    },
    text: {
      type: String,
      required: [true, "Text ist erforderlich"],
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: [true, "Benutzer-ID ist erforderlich"],
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

const Notiz = model("Notiz", notizSchema);
export default Notiz;
