import { Schema, model } from "mongoose";

const transaktionSchema = new Schema({
    date: {
        type: Date,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        default: 'others'
    },
    type: {
        type: String,
        enum: ["income", "expense"],
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    image: {
        type: String,
        required: false,
        default: null,
    }
},
{
    timestamps: true,
});

export const Transaktion = model("Transaktion", transaktionSchema);