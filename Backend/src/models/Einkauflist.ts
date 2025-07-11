import mongoose from "mongoose";

const EinkaufslisteSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    liste: [
      {
        typ: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "LebensmittelTyp",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        menge: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
          validate: {
            validator: Number.isInteger,
            message: "{VALUE} is not an integer value",
          },
        },
        einheit: {
          type: String,
          required: true,
          default: "stk",
        },
        category: {
          type: String,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      default: "offen",
      enum: ["offen", "erledigt"],
    },
    price: {
      type: Number,
      default: 0,
      required: false,
      set: (v: number) => Math.floor(v),
    },
    lastModified: {
      type: Date,
    },
    note: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to ensure menge is always a valid number
EinkaufslisteSchema.pre("save", function (next) {
  this.liste = this.liste.map((item: any) => ({
    ...item,
    menge: parseInt(item.menge) || 1,
  }));
  next();
});

export default mongoose.model("Einkaufsliste", EinkaufslisteSchema);
