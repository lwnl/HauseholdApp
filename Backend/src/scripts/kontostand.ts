import mongoose from "mongoose";
import { Transaktion } from "../models/Transaktion";

/**
 * Aggregates über Transaktion-Collection und ermittelt den aktuellen Kontostand.
 * @param id string UserId des eingelogten Benutzers
 * @param option enum ["both" | "income" | "expense"] Option für Summe aller Ein/Aus-, Ein-, Aus-Gänge
 * @returns Promise<number | null> : kontostand
 */
export async function kontostand(
  id: string,
  option: "both" | "income" | "expense"
): Promise<number | null> {
  let kontostand: number = 0;
  const objectID = new mongoose.Types.ObjectId(id);
  const result = await Transaktion.aggregate([
    {
      $match: {
        userId: objectID,
      },
    },
    {
      $group: {
        _id: "$type",
        total: {
          $sum: "$amount",
        },
      },
    },
  ]);
  if (option === "both") {
    for (const item of result) {
      if (item._id === "income") {
        kontostand += item.total;
      } else {
        kontostand -= item.total;
      }
    }
  } else if (option === "income") {
    for (const item of result) {
      if (item._id === "income") {
        kontostand += item.total;
      }
    }
  } else if (option === "expense") {
    for (const item of result) {
      if (item._id === "expense") {
        kontostand -= item.total;
      }
    }
  }
  return kontostand;
}
